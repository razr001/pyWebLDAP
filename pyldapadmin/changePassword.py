from flask import Blueprint, escape, request
from ldap3 import Server, Connection, ALL, BASE, ALL_ATTRIBUTES, MODIFY_REPLACE, MODIFY_ADD
from .func import relSuccess, relFail, hashPassword
from .config import (CUP_LDAP_HOST, CUP_LDAP_BASE, CUP_BIND_DN, CUP_BIND_PW, CUP_OBJECT_CLASS, CUP_LOGIN_ATTR, CUP_FULLNAME_ATTR, CUP_PW_HASH, 
	CUP_AD_MODE, CUP_WHO_CHANGE_PW, CUP_PWD_MIN_LENGTH, CUP_PWD_MAX_LENGTH, CUP_AD_OPT)

bp = Blueprint('changePassword', __name__, url_prefix='/ldap')

@bp.route('/change/user/password', methods=['POST'])
def changePassword():
	params = request.get_json()
	username = params['username']
	oldpassword = params['oldPassword']
	newpassword = params['newPassword']
	confirmpassword = params['confirmPassword']

	if not username:
			return relFail('username is request')

	if not oldpassword:
			return relFail('old password is request')

	if not newpassword:
			return relFail('new password is request')

	if newpassword != confirmpassword:
		return relFail('password no match')

	if len(newpassword) < CUP_PWD_MIN_LENGTH:
		return relFail('password min '+ CUP_PWD_MIN_LENGTH)

	if CUP_PWD_MAX_LENGTH > 0 and len(newpassword) > CUP_PWD_MAX_LENGTH:
		return relFail('password max '+ CUP_PWD_MAX_LENGTH)			

	# connect ldap server
	server = Server(CUP_LDAP_HOST)
	conn = Connection(server, CUP_BIND_DN, CUP_BIND_PW)
	if not conn.bind():
		return relFail('Connect '+CUP_LDAP_HOST+' error: '+conn.last_error)
	# search user
	rel = conn.search(CUP_LDAP_BASE, '(&(objectclass={0})({1}={2}))'.format(CUP_OBJECT_CLASS, CUP_LOGIN_ATTR, username), attributes=[ALL_ATTRIBUTES])
	if not rel:
		conn.unbind()
		return relFail('User {0} not found'.format(username))
	# user dn
	entry = conn.entries[0]
	userDN = entry.entry_dn

	# test oldpassword
	userConn = Connection(server, userDN, oldpassword)
	if not userConn.bind():
		conn.unbind()
		return relFail('User {0} bind error'.format(username))

	# user change or manage change
	changeConn = 	userConn if CUP_WHO_CHANGE_PW == 'user' else conn
	values = {}

	# create ldap password
	hashPw = hashPassword(newpassword, CUP_PW_HASH, CUP_AD_MODE)

	if CUP_AD_MODE:
		# Windows Active Directory
		if CUP_AD_OPT['force_unlock']:
			values["lockoutTime"] = 0
		if CUP_AD_OPT['force_pwd_change']:
			values["pwdLastSet"] = 0
		values['unicodePwd'] = [(MODIFY_REPLACE, [hashPw])]
	else:
		# OpenLDAP use userPassword
		values['userPassword'] = [(MODIFY_REPLACE, [hashPw])]

	# chnage password
	rel = changeConn.modify(userDN, values)
	error = changeConn.last_error
	conn.unbind()
	userConn.unbind()
	if rel:
		return relSuccess()

	return relFail('Change password error: '+error)
