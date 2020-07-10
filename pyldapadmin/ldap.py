from ldap3 import Server, Connection, ALL, Tls, SASL, ANONYMOUS, SIMPLE, GSSAPI
from flask import g, current_app, request, session
import ssl

class LDAP:
	server = None
	connect = None
	host = None
	port = 389
	username = None
	password = None
	base = None

	def __init__(self, host, port, username, password, base=None, method=None,):
		self.host = host
		self.port = int(port)
		self.username = username if username else None
		self.password = password if password else None
		self.base = base
		# ssl tls gssapi
		self.method = method
		tls = Tls(validate=ssl.CERT_NONE)
		self.server = Server(self.host, self.port, get_info=ALL, use_ssl=(method=='ssl'), tls=tls if method=='ssl' or method=='tls' else None)
	
	def __del__(self):
		if self.connect:
			self.connect.unbind()

	def connection(self):
		authentication = SASL if self.method == 'gssapi' else None
		sasl_mechanism = GSSAPI if self.method == 'gssapi' else None
		self.connect = Connection(self.server, self.username, self.password, authentication=authentication, sasl_mechanism=sasl_mechanism)
		if self.method == 'tls':
			self.connect.start_tls()
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
				'base': self.base,
				'method': self.method
			}

def get_ldap():
	ldapIdStr = str(request.headers['ldapId'])
	ldapInfo = session.get('connect_'+ldapIdStr)

	if not ldapInfo:
		return None

	ins = LDAP(ldapInfo['host'], ldapInfo['port'], ldapInfo['username'], ldapInfo['password'], ldapInfo['base'], ldapInfo['method'])
	if ins.connection():
		return ins
	return None

def close_ldap(ldapId):
	ldapIdStr = str(ldapId)
	if session.get('connect_'+ldapIdStr):
		session.pop('connect_'+ldapIdStr)

