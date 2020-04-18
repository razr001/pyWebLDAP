import sqlite3
from flask import Blueprint, escape, request, current_app
from .func import relSuccess, relFail
from .db import get_db, init_db

bp = Blueprint('connections', __name__, url_prefix='/connect')

# @bp.route('/init')
# def init():
#   init_db()
#   return 'init db'

# add connect
@bp.route('/add', methods=['POST'])
def addConnect():
  host = '192.168.234.131'
  port = 389
  username = 'cn=Manager,dc=my-domain,dc=com'
  password = 'admin'
  base = 'dc=my-domain,dc=com'

  db = get_db()
  db.execute('INSERT INTO connection (host, port, username, userpw, base) VALUES (?, ?, ?, ?, ?)', (host, port, username, password, base))
  db.commit()

  return relSuccess()

# connect list
@bp.route('/list')
def connectList():
  db = get_db()
  rows = db.execute('SELECT * FROM connection').fetchall()
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
  connId = request.args.get('id')
  if not connId:
    return relFail('id is request')

  host = '192.168.234.131'
  port = 389
  username = 'cn=Manager,dc=my-domain,dc=com'
  password = '123456'
  base = 'dc=my-domain,dc=com'

  db = get_db()
  db.execute('UPDATE connection SET host=?, port=?, username=?, userpw=?, base=? WHERE id=?', (host, port, username, password, base, connId))
  db.commit()
  return relSuccess()

# delete connect
@bp.route('/del', methods=['POST'])
def connectDelete():
  connId = request.args.get('id')
  if not connId:
    return relFail('id is request')

  db = get_db()
  db.execute('DELETE FROM connection WHERE id=?', (connId))
  db.commit()
  return relSuccess()      