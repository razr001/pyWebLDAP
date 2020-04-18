from ldap3 import Server, Connection, ALL
from flask import g, current_app

class LDAP:
	server = None
	connect = None

	def __init__(self, host):
		self.server = Server(host, get_info=ALL)
		self.connect = Connection(self.server, 'cn=Manager,dc=my-domain,dc=com', 'secret', auto_bind=True)


def get_ldap():
	if 'ldap' not in g:
		g.ldap = LDAP(current_app.config['LDAP_HOST'])

	return g.ldap
