import re
import json
from ldap3 import Server, Connection, ALL, ObjectDef, AttrDef, Reader, Writer, BASE, LEVEL, ALL_ATTRIBUTES, MODIFY_REPLACE
from flask import Blueprint, escape, request
from .ldap import get_ldap
from .func import relSuccess, relFail, hashPassword, verifyHash

bp = Blueprint('ldapadmin', __name__, url_prefix='/ldap')

# 递归条目生成树
def entrysTree(entryList, parentEntry):
  for entry in entryList:
    startIndex = entry['dn'].find(',')
    if entry['dn'][startIndex+1:] == parentEntry['dn']:
      if 'children' not in parentEntry:
        parentEntry['children'] = []
      parentEntry['children'].append(entry)
      newList = entryList.copy()
      newList.remove(parentEntry)
      entrysTree(newList, entry)

@bp.route('/info')
def info():
  ldap = get_ldap()
  return relSuccess(ldap.server.info.to_json(), True)

@bp.route('/fetch/base')
def fetchBase():
  host = request.args.get('host')
  port = request.args.get('port')
  server = Server(host, int(port), get_info=ALL)
  connect = Connection(server, auto_bind=True)
  if not server.info:
    return relSuccess()

  dn = str(server.info.raw['namingContexts'][0], encoding="utf-8")
  return relSuccess(dn)  
  
@bp.route('/schema')
def serverSchema():
  ldap = get_ldap()
  return relSuccess(ldap.server.schema.to_json(), True)

# 服务器的所有objectclass
@bp.route('/objectclasses')  
def objectclasses():
  ldap = get_ldap()
  objectClasses = ldap.server.schema.raw['objectClasses']
  print(objectClasses)
  objectClassList = []
  for objectClass in objectClasses:
    objClassStr = str(objectClass, encoding = "utf8")
    # 匹配 NAME 'objectClass name'
    reObj = re.search( r'NAME\s\'(\w+)\'', objClassStr)
    if(reObj):
      objectClassList.append(reObj.group(1))
  return relSuccess(objectClassList)

# 单个objectclass 所有属性
@bp.route('/objectclass/attr')
def objectclassAttr():
  ldap = get_ldap()
  conn = ldap.connect
  objectclassName = request.args.get('name','')
  if objectclassName == '':
    return relFail('objectclass name is request')
  objCls = ObjectDef([objectclassName], conn)

  attrDist = {
    'name': objectclassName,
    'oidInfo': [oid for oid in objCls._oid_info],
    'must': [],
    'may': [],
  }

  for attrName in objCls._attributes:
    if(attrName.lower() == 'objectclass'):
      continue
    attrObj = objCls._attributes[attrName]
    attrInfo = {'name':attrName, 'superior': attrObj.oid_info.superior, 'syntax':attrObj.oid_info.syntax}
    if attrObj.mandatory:
      attrDist['must'].append(attrInfo)
    else:
      attrDist['may'].append(attrInfo) 

  return relSuccess(attrDist)
  
# 条目树
@bp.route('/entry/tree')
def entryTree():
  ldap = get_ldap()
  conn = ldap.connect
  rootNode = 'dc=my-domain,dc=com'
  rel = conn.search(rootNode, '(objectclass=*)', attributes=['objectclass'])
  if(rel):
    entrysList = []
    rootEntry = {}
    for entry in conn.entries:
      entryJSON = entry.entry_to_json()
      entryDist = json.loads(entryJSON)
      entrysList.append(entryDist)
      if entryDist['dn'] == rootNode:
        rootEntry = entryDist
    entrysTree(entrysList, rootEntry)      
    return relSuccess([rootEntry])
  return relSuccess([{'dn':rootNode}])

# 单个条目信息  
@bp.route('/entry/info')
def entry():
  ldap = get_ldap()
  conn = ldap.connect
  dn = request.args.get('dn','')
  if dn == '':
    return relFail('dn is request')
  rel = conn.search(dn, '(objectclass=*)', search_scope=BASE, attributes=[ALL_ATTRIBUTES, 'objectClass'])
  if(rel):
    entry = conn.entries[0]
    entryJSON = entry.entry_to_json()
    return relSuccess(entryJSON, True)
  return relSuccess()

# 条目的一级子条目
@bp.route('/entry/child')
def entryChild():
  ldap = get_ldap()
  conn = ldap.connect
  dn = request.args.get('dn','')
  if dn == '':
    return relFail('dn is request')
  rel = conn.search(dn, '(objectclass=*)', search_scope=LEVEL)
  if(rel):
    entrysList = []
    for entry in conn.entries:
      entryJSON = entry.entry_to_json()
      entryDist = json.loads(entryJSON)
      entrysList.append(entryDist)
    return relSuccess(entrysList)
  return relSuccess()


@bp.route('/add/entry', methods=['POST'])
def addEntry():
  ldap = get_ldap()
  conn = ldap.connect
  params = request.get_json()
  dn = params['dn']
  objectclass = params['objectClass']
  targetDN = params['targetDN']

  if not dn:
    return relFail('dn is request')

  if not targetDN:
    return relFail('Target dn is request')
  
  if not objectclass:
    return relFail('ObjectClass is request')
  
  del params['dn']
  del params['objectClass']
  del params['targetDN']
  newDN = dn + ',' + targetDN

  try:
    rel = conn.add(newDN, objectclass, params)
    if not rel:
      return relFail(conn.last_error)
  except Exception as e:
    return relFail(str(e))
  
  return relSuccess()

@bp.route('/remove/entry', methods=['POST'])
def removeEntry():
  ldap = get_ldap()
  conn = ldap.connect
  params = request.get_json()
  dn = params['dn']
  if not dn:
    return relFail('dn is request')

  try:
    rel = conn.delete(dn)
    if not rel:
      return relFail(conn.last_error)
  except Exception as e:
    return relFail(str(e))
  
  return relSuccess()

@bp.route('/move/entry', methods=['POST'])
def moveEntry():
  ldap = get_ldap()
  conn = ldap.connect
  params = request.get_json()
  dn = params['dn']
  targetDN = params['targetDN']
  if not dn:
    return relFail('dn is request')
  if not targetDN:
    return relFail('targetDN is request')

  try:
    relative_dn = dn.split(',', 1)[0]
    rel = conn.modify_dn(dn, relative_dn, new_superior=targetDN)
    if not rel:
      return relFail(conn.last_error)
  except Exception as e:
    return relFail(str(e))
  
  return relSuccess()

@bp.route('/update/entry', methods=['POST'])
def updateEntry():
  ldap = get_ldap()
  conn = ldap.connect
  params = request.get_json()
  dn = params['dn']
  if not dn:
    return relFail('dn is request')

  del params['dn']

  try:
    values = {}
    for key in params:
      values[key] = [(MODIFY_REPLACE, [params[key]])]

    rel = conn.modify(dn, values)
    if not rel:
      return relFail(conn.last_error)
  except Exception as e:
    return relFail(str(e))
  
  return relSuccess()        

# 生成ladp规范的hash密码
@bp.route('/create/hash', methods=['POST'])
def getHashPassword():
  params = request.get_json()
  password = params['password']
  hashType = params['hashType']

  if not password:
    return relFail('Password is request')

  if not hashType:
    return relFail('Hash type is request')  

  try:
    return relSuccess(hashPassword(password, hashType))
  except Exception as e:
    return relFail(str(e))   

# 验证hash密码
@bp.route('/verify/hash', methods=['POST'])
def verifyHashPassword():
  params = request.get_json()
  password = params['password']
  hashText = params['value']
  
  if not password:
    return relFail('Password is request')

  if not hashText:
    return relFail('Value is request')

  try:
    return relSuccess(verifyHash(password, hashText)) 
  except Exception as e:
    return relFail(str(e))             