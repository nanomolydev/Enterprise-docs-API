from flask.views import MethodView
from flask_smorest import Blueprint
from sqlalchemy import and_
from db import db
from decorators.roles import permission_required
from models import AuditLogModel
from schemas import AuditLogsQuerySchema, AuditLogsSchema

blp = Blueprint("audit_log", __name__, description='Audit operations')

@blp.route("/api/logs")
class AuditLogOperations(MethodView):
    @blp.response(200,AuditLogsSchema(many=True))
    @permission_required("read_logs")
    @blp.arguments(AuditLogsQuerySchema, location='query')
    def get(self, filter_data):
        all_logs = AuditLogModel.query
        action = filter_data.get("action")
        user_id = filter_data.get("user_id")
        start_timestamp = filter_data.get("start_timestamp")
        end_timestamp = filter_data.get("end_timestamp")
        offset = filter_data.get("offset", 0)
        limit = filter_data.get("limit")
        all_logs = all_logs.order_by(AuditLogModel.timestamp.desc())
        if(user_id):
            all_logs = all_logs.filter(AuditLogModel.user_id==user_id)
        if(action):
            all_logs = all_logs.filter(AuditLogModel.action==action)
        if(start_timestamp and end_timestamp):
            all_logs = all_logs.filter(and_(AuditLogModel.timestamp>start_timestamp, AuditLogModel.timestamp<end_timestamp))
        all_logs = all_logs.offset(offset)
        if(limit is not None):
            all_logs = all_logs.limit(limit)
        return all_logs.all()

@blp.route("/api/logs/count")
class LogCount(MethodView):
    @permission_required("read_logs")
    @blp.arguments(AuditLogsQuerySchema, location='query')
    def get(self, filter_data):
        all_logs = AuditLogModel.query
        action = filter_data.get("action")
        user_id = filter_data.get("user_id")
        start_timestamp = filter_data.get("start_timestamp")
        end_timestamp = filter_data.get("end_timestamp")
        
        if(user_id):
            all_logs = all_logs.filter(AuditLogModel.user_id==user_id)
        if(action):
            all_logs = all_logs.filter(AuditLogModel.action==action)
        if(start_timestamp and end_timestamp):
            all_logs = all_logs.filter(and_(AuditLogModel.timestamp>start_timestamp, AuditLogModel.timestamp<end_timestamp))
        
        return {"count":all_logs.count()}
    

@blp.route("/api/logs/<int:log_id>")
class GetOneLog(MethodView):
    @blp.response(200,AuditLogsSchema())
    @permission_required("read_logs")
    def get(self, log_id):
        return AuditLogModel.query.get_or_404(log_id)