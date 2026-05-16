from flask.views import MethodView
from flask_smorest import Blueprint
from db import db
from decorators.roles import permission_required
from models import UserModel, RoleModel
from schemas import UserSchema,  RoleSchema

blp = Blueprint("roles", __name__, description='Role Operations')

@blp.route("/api/roles")
class RolesOperations(MethodView):
    @blp.response(200,RoleSchema(many=True))
    @permission_required('user_manage')
    def get(self):
        all_role = RoleModel.query.all()
        return all_role
