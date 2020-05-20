import random
from flask import Blueprint, request, session, redirect, url_for
from .func import relSuccess, relFail, verifyHash 
from .AuthException import AuthException
from .config import URL_PREFIX, ADMIN_NAME, ADMIN_PW

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.before_app_request
def verify():
  loginPath = URL_PREFIX + '/auth/login'
  changePasswordPath = URL_PREFIX + '/ldap/change/user/password'
  logout = URL_PREFIX + '/auth/logout'
  if (request.path in (loginPath, changePasswordPath, logout)) or request.path.find(URL_PREFIX) == -1:
    return

  loginId = session.get('login_id')
  if not loginId:
    raise AuthException()

@bp.route('/checkLogin')
def checkLogin():
  loginId = session.get('login_id')
  if loginId:
    return relSuccess()
  return relFail()

@bp.route('/login', methods=['POST'])
def login():
  session.clear()
  params = request.get_json()
  adminName = params['username']
  adminPw = params['password']
  
  if adminName == ADMIN_NAME and verifyHash(adminPw, ADMIN_PW): 
    session['login_id'] = random.randint(1000, 2000)
    session.permanent = True
    return relSuccess()

  return relFail('login fail')

@bp.route('/logout', methods=['POST'])
def logout():
  session.clear()
  return relSuccess()

