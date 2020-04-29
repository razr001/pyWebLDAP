import sqlite3
from flask import Blueprint, escape, request, current_app
from .func import relSuccess, relFail
from .ldap import LDAP
from .db import get_db, init_db

bp = Blueprint('connections', __name__, url_prefix='/connect')

# @bp.route('/init')
# def init():
#   init_db()
#   return 'init db'
@bp.route('/test', methods=['POST'])
def testConnect():
  params = request.get_json()
  host = params['host']
  port = int(params['port'])
  anonymity = int(params['anonymity'])       
  password = params['password'] if anonymity == 0 else ''
  username = params['username'] if anonymity == 0 else ''

  if not host or not port:
    return relFail('host and port is request')

  ldapServer = LDAP(host, port, username, password)
  conn = ldapServer.connection()
  if not conn:
    return relFail('Connection error')
  return relSuccess() 

# add connect
@bp.route('/add', methods=['POST'])
def addConnect():
  params = request.get_json()
  anonymity = int(params['anonymity'])
  host = params['host']
  port = int(params['port'])
  password = params['password'] if anonymity == 0 else ''
  username = params['username'] if anonymity == 0 else ''
  base = params['base']

  db = get_db()
  db.execute('INSERT INTO connection (host, port, username, password, base, anonymity) VALUES (?, ?, ?, ?, ?, ?)', (host, port, username, password, base, anonymity))
  db.commit()

  return relSuccess()

# connect list
@bp.route('/list')
def connectList():
  db = get_db()
  rows = db.execute('SELECT * FROM connection ORDER BY id DESC').fetchall()
  return relSuccess(rows)

# connect info
@bp.route('/info')
def connectInfo():
  connId = request.args.get('id')
  if not connId:
    return relFail('id is request')

  db = get_db()
  rows = db.execute('SELECT * FROM connection WHERE id = ?', (connId)).fetchone()
  return relSuccess(rows)

# update connect 
@bp.route('/update', methods=['POST'])
def connectUpdate():
  params = request.get_json()
  connId = params['id']
  anonymity = int(params['anonymity'])
  host = params['host']
  port = int(params['port'])
  password = params['password'] if anonymity == 0 else ''
  username = params['username'] if anonymity == 0 else ''
  base = params['base']

  if not connId:
    return relFail('id is request')

  db = get_db()
  db.execute('UPDATE connection SET host=?, port=?, username=?, password=?, base=?, anonymity=? WHERE id=?', (host, port, username, password, base, anonymity, connId))
  db.commit()
  return relSuccess()

# delete connect
@bp.route('/del', methods=['POST'])
def connectDelete():
  params = request.get_json()
  connId = params['id']
  if not connId:
    return relFail('id is request')

  db = get_db()
  db.execute('DELETE FROM connection WHERE id=?', (connId,))
  db.commit()
  return relSuccess()      