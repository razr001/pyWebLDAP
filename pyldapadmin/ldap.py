from ldap3 import Server, Connection, ALL
from flask import g, current_app, request, session

class LDAP:
	server = None
	connect = None
	host = None
	port = 389
	username = None
	password = None
	base = None

	def __init__(self, host, port, username, password, base=None):
		self.host = host
		self.port = int(port)
		self.username = username
		self.password = password
		self.base = base
		self.server = Server(self.host, self.port, get_info=ALL)
	
	def __del__(self):
		if self.connect:
			self.connect.unbind()

	def connection(self):
		self.connect = Connection(self.server, self.username, self.password) if self.username and self.password else Connection(self.server)
		return self.connect.bind()

	def save(self, ldapId):
		ldapIdStr = str(ldapId)
		ldapInfo = session.get('connect_'+ldapIdStr)
		if not ldapInfo:
			session['connect_'+ldapIdStr] = {
				'host': self.host,
				'port': self.port,
				'username': self.username,
				'password': self.password,
				'base': self.base
			}

def get_ldap():
	ldapIdStr = str(request.headers['ldapId'])
	ldapInfo = session.get('connect_'+ldapIdStr)

	if not ldapInfo:
		return None

	ins = LDAP(ldapInfo['host'], ldapInfo['port'], ldapInfo['username'], ldapInfo['password'], ldapInfo['base'])
	if ins.connection():
		return ins
	return None

def close_ldap(ldapId):
	ldapIdStr = str(ldapId)
	if session.get('connect_'+ldapIdStr):
		session.pop('connect_'+ldapIdStr)

