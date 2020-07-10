import os
from datetime import timedelta
from flask import Flask, url_for
from .config import SECRET_KEY, URL_PREFIX

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        PERMANENT_SESSION_LIFETIME = timedelta(minutes=60),
        SECRET_KEY = SECRET_KEY,
        DATABASE = os.path.join(app.instance_path, 'pyldapadmin.db'),
    )

    if test_config:
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from .AuthException import AuthException
    from . import func, ldap

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return app.send_static_file("index.html")

    @app.errorhandler(AuthException)
    def errorhandler(e):
      return func.relFail(e.msg, e.code) 

    @app.errorhandler(Exception)
    def errorhandler(e):
      return func.relFail(str(e), -1)        

    # from . import db
    # db.init_app(app)

    from . import ldapadmin, changePassword, auth, connections
    register_blueprint(app, auth.bp)
    register_blueprint(app, ldapadmin.bp)
    register_blueprint(app, changePassword.bp)
    register_blueprint(app, connections.bp)

    return app


def register_blueprint(app, bp):
    app.register_blueprint(bp, url_prefix=URL_PREFIX + bp.url_prefix)
