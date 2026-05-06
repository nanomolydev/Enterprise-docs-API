from flask.views import MethodView
from flask_smorest import Blueprint

from decorators.roles import permission_required
from models import AuditLogModel
from schemas import AuditLogsSchema

blp = Blueprint("audit_log", __name__, description='Audit operations')

@blp.route("/logs")
class AuditLogOperations(MethodView):
    @blp.response(200,AuditLogsSchema(many=True))
    @permission_required("read_logs")
    def get(self):
        return AuditLogModel.query.all()