'''
@Author: ouruiting
@Date: 2020-07-10 09:28:38
@LastEditors: ouruiting
@LastEditTime: 2020-07-10 13:44:47
@Description: file content
'''

# web login name
ADMIN_NAME = 'admin'
# web login password
ADMIN_PW = 'admin'

# must modification
SECRET_KEY = 'PIgX28H-sC5c+dShdS08U@#TUL9ZMAu5Tyn'

# 用户自助修改密码相关配置
CUP_LDAP_HOST = '192.168.5.100'
CUP_LDAP_BASE = 'dc=cnabc-inc,dc=com'
CUP_BIND_DN = 'cn=admin,dc=cnabc-inc,dc=com'
CUP_BIND_PW = 'iYI0H1S#tweQD!7'
CUP_OBJECT_CLASS = 'posixAccount'
CUP_LOGIN_ATTR = 'uid'
CUP_FULLNAME_ATTR = 'cn'

# MD5, SHA, SMD5, SSHA
CUP_PW_HASH = 'SSHA'

# Who changes the password?
# Also applicable for question/answer save
# user: the user itself
# manager: the above binddn
CUP_WHO_CHANGE_PW = 'manager'

CUP_PWD_MIN_LENGTH = 1

CUP_PWD_MAX_LENGTH = 0

# Active Directory mode
# true: use unicodePwd as password field
# false: LDAPv3 standard behavior
CUP_AD_MODE = False
CUP_AD_OPT = {
  # Force account unlock when password is changed
  'force_unlock': False,
  # Force user change password at next login
  'force_pwd_change': False,
  # Allow user with expired password to change password
  # 'change_expired_password':False,
}

# Modification is not recommended
URL_PREFIX = '/api'