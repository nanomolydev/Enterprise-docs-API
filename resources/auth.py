from flask.views import MethodView
from flask_smorest import Blueprint
from flask_login import current_user, login_user, logout_user

from models import UserModel
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
                return {"message": "You are logged in"}, 200
            else:
                return {"message": "Incorrect password"}, 401
        else:
            return {"message": "No data found"}, 404
@blp.route("/logout")
class LogoutOperations(MethodView):
    def post(self):
        logout_user()
        return {"message": "You are logout"}, 200