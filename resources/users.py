from flask.views import MethodView
from flask_smorest import Blueprint
from db import db
from models import UserModel, RoleModel
from schemas import UserSchema, PatchRole

blp = Blueprint("users", __name__, description='User Operations')

@blp.route("/users")
class UsersOperations(MethodView):
    @blp.arguments(UserSchema)
    @blp.response(200,UserSchema)
    def post(self, user_data):
        new_user = UserModel(**user_data)
        db.session.add(new_user)
        db.session.commit()
        return new_user
    @blp.response(200,UserSchema(many=True))
    def get(self):
        all_user = UserModel.query.all()
        return all_user

@blp.route("/users/<int:user_id>")
class UserOperations(MethodView):
    @blp.arguments(PatchRole)
    def patch(self, role_data, user_id):
        find = UserModel.query.get_or_404(user_id)
        if (role_data['role_id']==0):
            find.role_id = None
            db.session.add(find)
            db.session.commit()
            return {"message": f"User '{find.login}' role has been revoked"}, 200
        else:

            role = RoleModel.query.get_or_404(role_data['role_id'])
            find.role_id = role_data['role_id']
            db.session.add(find)
            db.session.commit()
            return {"message": f"Role '{role.title}' assigned to user '{find.login}'"}, 200