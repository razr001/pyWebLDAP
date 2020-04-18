import json
import re
from flask import jsonify
from passlib.hash import ldap_salted_sha1, ldap_md5, ldap_sha1, ldap_salted_md5

def relSuccess(data=None, isJson=None):
  return relFail(data, 0, isJson)

def relFail(data, code=1, isJson=None):
  return jsonify({'code':code, 'data': json.loads(data) if isJson and data else data})


def hashPassword(password, hash_type, ad_mode=False):
  if ad_mode:
    return '"'+password+'"'.encode('UTF-16LE')

  if hash_type == 'MD5':
    return ldap_md5.hash(password)
  elif hash_type == 'SMD5':
    return ldap_salted_md5.hash(password)
  elif hash_type == 'SHA':
    return ldap_sha1.hash(password)
  elif hash_type == 'SSHA':
    return ldap_salted_sha1.hash(password) 
  else:
    return password

def verifyHash(password, hash_value, hash_type='auto'):
  if hash_type == 'auto':
    reObj = re.search( r'^\{(\w+)\}', hash_value)
    if reObj:
      hash_type = reObj.group(1)

  if hash_type == 'MD5':
    return ldap_md5.verify(password, hash_value)
  elif hash_type == 'SMD5':
    return ldap_salted_md5.verify(password, hash_value)
  elif hash_type == 'SHA':
    return ldap_sha1.verify(password, hash_value)
  elif hash_type == 'SSHA':
    return ldap_salted_sha1.verify(password, hash_value) 
  else:
    return password == hash_value        