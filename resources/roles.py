from flask.views import MethodView
from flask_smorest import Blueprint
from db import db
from models import UserModel, RoleModel
from schemas import UserSchema, PatchRole, RoleSchema

blp = Blueprint("roles", __name__, description='Role Operations')

@blp.route("/roles")
class RolesOperations(MethodView):
    @blp.response(200,RoleSchema(many=True))
    def get(self):
        all_role = RoleModel.query.all()
        return all_role
