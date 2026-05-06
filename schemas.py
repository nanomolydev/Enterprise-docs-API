from marshmallow import Schema, fields
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


class PlainUserSchema(Schema):
    id = fields.Int(dump_only=True, required=False)
    login = fields.Str(required=True)
    password = fields.Str(required=True)

class UserSchema(PlainUserSchema):
    full_name = fields.Str(required=True)
    is_active = fields.Bool(dump_only=True, required=False)
    department = fields.Str(required=False)
    role_id = fields.Int(required=True)
    role = fields.Nested(PlainRoleSchema, dump_only=True,required=False)

class RoleSchema(PlainRoleSchema):
    users = fields.List(fields.Nested(PlainUserSchema, dump_only=True,required=False))

class DocumentSchema(Schema):
    id = fields.Int(dump_only=True, required=False)
    title = fields.Str(required=True)
    reg_number = fields.Str(required=True)
    created_at = fields.DateTime(required=False,dump_only=True)
    updated_at = fields.DateTime(required=False, dump_only=True)
    author_id = fields.Int(required=False)
    department = fields.Str(required=False)
    category = fields.Enum(CategoryDoc, required=True)
    access_level = fields.Enum(AccessLevelDoc, required=True)
    status = fields.Enum(StatusDoc, required=True)
    storage_deadline = fields.DateTime(required=False)
    file_path = fields.Str(required=False)
    file_original_name = fields.Str(required=False)
    file_hash = fields.Str(required=False)

class EditDocumentSchema(Schema):
    title = fields.Str(required=False)
    reg_number = fields.Str(required=False)
    author_id = fields.Int(required=False)
    department = fields.Str(required=False)
    category = fields.Enum(CategoryDoc, required=False)
    access_level = fields.Enum(AccessLevelDoc, required=False)
    status = fields.Enum(StatusDoc, required=False)
    storage_deadline = fields.DateTime(required=False)

class UploadDocumentSchema(Schema):
    file = fields.Raw(required=False)

class PatchUser(Schema):
    full_name = fields.Str(required=False)
    is_active = fields.Bool(required=False)
    role_id = fields.Int(required=False)