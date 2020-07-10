class AuthException(Exception):
  def __init__(self):
      self.code = 403
      self.msg = 'No rights'
  def __str__(self):
      return repr('code:{0}, msg:{1}'.format(self.code, self.msg))