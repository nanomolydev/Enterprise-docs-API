import datetime

from flask import jsonify
from flask.views import MethodView
from flask_smorest import Blueprint
from db import db
from decorators.roles import permission_required
from models import UserModel, RoleModel
from schemas import UserSchema, PatchUser

blp = Blueprint("users", __name__, description='User Operations')



@blp.route("/api/users")
class UsersOperations(MethodView):
    @blp.arguments(UserSchema)
    @blp.response(200,UserSchema)
    @permission_required('user_manage')
    def post(self, user_data):
        new_user = UserModel()
        new_user.role_id = user_data.get('role_id', None)
        new_user.department = user_data.get("department", None)
        new_user.full_name = user_data.get("full_name", None)
        new_user.is_active = user_data.get("is_active", True)
        new_user.created_at = datetime.datetime.now()
        new_user.login = user_data['login']
        new_user.set_password(user_data['password'])
        db.session.add(new_user)
        db.session.commit()
        return new_user
    @blp.response(200,UserSchema(many=True))
    @permission_required('user_manage')
    def get(self):
        all_user = UserModel.query.all()
        return all_user

@blp.route("/api/users/<int:user_id>")
class UserOperations(MethodView):
    @permission_required("user_manage")
    @blp.response(200,UserSchema)
    def get(self, user_id):
        find_user = UserModel.query.get_or_404(user_id)
        return find_user
    @blp.arguments(PatchUser)
    @permission_required('user_manage')
    def patch(self, role_data, user_id):
        find = UserModel.query.get_or_404(user_id)
        if(role_data.get('role_id', None) == None):
            find.full_name = role_data.get("full_name", find.full_name)
            find.is_active = role_data.get("is_active", find.is_active)
            db.session.add(find)
            db.session.commit()
            return {"message": f"Updated"}, 200
        else:
            
            role = RoleModel.query.get_or_404(role_data['role_id'])
            if (role):
                find.role_id = role_data['role_id']
                find.full_name = role_data.get("full_name", find.full_name)
                find.is_active = role_data.get("is_active", find.is_active)
                db.session.add(find)
                db.session.commit()
                return {"message": f"Updated"}, 200