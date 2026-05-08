import datetime

from flask.views import MethodView
from flask_smorest import Blueprint
from flask_login import current_user, login_user, logout_user
from marshmallow.utils import timestamp
from db import db
from models import UserModel
from models.audit_log import AuditLogModel
from schemas import PlainUserSchema

blp = Blueprint("auth", __name__, description="Auth Operations")

@blp.route("/login")
class LoginOperations(MethodView):
    @blp.arguments(PlainUserSchema)
    def post(self, user_data):
        if current_user.is_authenticated:
            return {"message": "You are already logged in"}, 200
        find_user = UserModel.query.filter(UserModel.login==user_data['login']).first()
        if(find_user):
            if(find_user.check_password(user_data['password'])):
                login_user(find_user)
                db.session.add(
                    AuditLogModel(user_id=find_user.id, action='user_login', timestamp=datetime.datetime.now(),
                                  is_complete=True))
                db.session.commit()
                return {"message": "You are logged in"}, 200
            else:

                db.session.add(AuditLogModel(user_id=find_user.id,action='user_login', timestamp=datetime.datetime.now(), is_complete=False))
                db.session.commit()
                return {"message": "Incorrect password"}, 401
        else:
            return {"message": "No data found"}, 404
@blp.route("/logout")
class LogoutOperations(MethodView):
    def post(self):
        db.session.add(AuditLogModel(user_id=current_user.id, action='user_logout', timestamp=datetime.datetime.now(),
                                     is_complete=True))
        db.session.commit()
        logout_user()
        return {"message": "You are logout"}, 200