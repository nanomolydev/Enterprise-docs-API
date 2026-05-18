# pylint: disable=missing-class-docstring
from marshmallow import Schema, fields, validate
from utils.validators import validate_special, validate_digit, validate_lowercase, validate_uppercase
from models.audit_log import ActionEnum
from models.documents import CategoryDoc, StatusDoc, AccessLevelDoc



class PlainRoleSchema(Schema):
    id = fields.Int(dump_only=True, required=False)
    title = fields.Str(required=True)
    create_doc = fields.Bool(required=True)
    read_doc = fields.Bool(required=True)
    edit_selfdoc = fields.Bool(required=True)
    del_selfdoc = fields.Bool(required=True)
    edit_anydoc = fields.Bool(required=True)
    del_anydoc = fields.Bool(required=True)
    user_manage = fields.Bool(required=True)
    read_logs = fields.Bool(required=True)
    download_doc = fields.Bool(required=True)

class SmallUserSchema(Schema):
    id = fields.Int(required=False, dump_only=True)
    full_name = fields.Str(required=True)
    role_id = fields.Int(required=True)
    role = fields.Nested(PlainRoleSchema, dump_only=True,required=False)

class PlainUserSchema(Schema):
    id = fields.Int(dump_only=True, required=False)
    login = fields.Str(required=True, validate=[
        validate.Length(min=3, max=20),
        validate.Regexp(r'^[A-Za-z0-9_-]+$', 0, error="Username может содержать только буквы, цифры, _ и -")
    ])
    password = fields.Str(required=True,validate=[
        validate.Length(min=8, max=20),
        validate_uppercase,
        validate_lowercase,
        validate_digit,
        validate_special
    ])

class UserSchema(PlainUserSchema):
    full_name = fields.Str(required=True)
    is_active = fields.Bool(dump_only=True, required=False)
    department = fields.Str(required=False)
    role_id = fields.Int(required=True)
    role = fields.Nested(PlainRoleSchema, dump_only=True,required=False)

class AuditLogsSchema(Schema):
    id = fields.Int(dump_only=True, required=False)
    user_id = fields.Int(dump_only=True, required=False)
    action = fields.Enum(ActionEnum, dump_only=True, required=False)
    document_id = fields.Int(dump_only=True, required=False)
    document_title = fields.Str(dump_only=True, required=False)
    document_reg_number = fields.Str(dump_only=True, required=False)
    timestamp = fields.DateTime(dump_only=True, required=False)
    is_complete = fields.Bool(dump_only=True, required=False)
    user = fields.Nested(UserSchema, dump_only=True, required=False)

class RoleSchema(PlainRoleSchema):
    users = fields.List(fields.Nested(PlainUserSchema, dump_only=True,required=False))

class DocumentQuerySchema(Schema):
    offset = fields.Int(required=False)
    limit = fields.Int(required=False)
    name = fields.Str(required=False)
    category=fields.Enum(CategoryDoc, required=False)
    access_level = fields.Enum(AccessLevelDoc, required=False)
    status = fields.Enum(StatusDoc, required=False)


class AuditLogsQuerySchema(Schema):
    offset = fields.Int(required=False)
    limit = fields.Int(required=False)
    action = fields.Str(required=False)
    user_id=fields.Int(required=False)
    start_timestamp = fields.DateTime()
    end_timestamp = fields.DateTime()

class DocumentSchema(Schema):
    id = fields.Int(dump_only=True, required=False)
    title = fields.Str(required=True)
    reg_number = fields.Str(required=True)
    created_at = fields.DateTime(required=False,dump_only=True)
    updated_at = fields.DateTime(required=False, dump_only=True)
    author_id = fields.Int(required=False)
    author = fields.Nested(SmallUserSchema,required=False, dump_only=True)
    department = fields.Str(required=False)
    category = fields.Enum(CategoryDoc, required=True)
    access_level = fields.Enum(AccessLevelDoc, required=True)
    status = fields.Enum(StatusDoc, required=True)
    storage_deadline = fields.DateTime(required=False)
    file_path = fields.Str(required=False, load_only=True)
    file_original_name = fields.Str(required=False)
    file_hash = fields.Str(required=False, load_only=True)
    message = fields.Str(required=False, dump_only=True)


class EditDocumentSchema(Schema):
    title = fields.Str(required=False)
    reg_number = fields.Str(required=False)
    department = fields.Str(required=False)
    category = fields.Enum(CategoryDoc, required=False)
    access_level = fields.Enum(AccessLevelDoc, required=False)
    status = fields.Enum(StatusDoc, required=False)
    storage_deadline = fields.DateTime(required=False)

class UploadDocumentSchema(Schema):
    file = fields.Raw(required=True)

class FormEditDocumentSchema(Schema):
    file = fields.Raw(required=False)

class PatchUser(Schema):
    full_name = fields.Str(required=False)
    is_active = fields.Bool(required=False)
    role_id = fields.Int(required=False)