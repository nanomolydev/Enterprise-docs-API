from email.policy import default
from enum import Enum
from db import db


class ActionEnum(str, Enum):
    created_document = 'created_document'
    view_document_list = 'view_document_list'
    edit_document = 'edit_document'
    delete_document = 'delete_document'
    download_document = 'download_document'
    user_login = 'user_login'
    user_logout = 'user_logout'
class AuditLogModel(db.Model):
    __tablename__ = 'audit_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.Enum(ActionEnum), nullable=False)
    document_id = db.Column(db.Integer, nullable=True)
    document_title = db.Column(db.String(100), nullable=True)
    document_reg_number = db.Column(db.String(100), nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    is_complete = db.Column(db.Boolean, nullable=False, default=True)
    user = db.relationship('UserModel', back_populates='audit_logs')