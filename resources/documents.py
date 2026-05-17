import hashlib
import os
from datetime import datetime
from io import BytesIO
from pathlib import Path

from flask.views import MethodView
from flask_login import current_user
from flask_smorest import Blueprint
from flask import send_file

from db import db
from decorators.roles import permission_required
from models import UserModel, RoleModel, DocModel, AuditLogModel
from models.documents import AccessLevelDoc
from schemas import DocumentQuerySchema, DocumentSchema, UploadDocumentSchema, EditDocumentSchema
from cryptography.fernet import Fernet
import uuid
library_prefix = 'data/'
blp = Blueprint("documents", __name__, description='Document Operations')

@blp.route("/api/documents")
class DocsOperations(MethodView):
    @blp.arguments(DocumentSchema, location='form')
    @blp.arguments(UploadDocumentSchema, location='files')
    @blp.response(200, DocumentSchema)
    @permission_required("create_doc")
    def post(self, form_data, file_data):
        upload_dir = Path(library_prefix)
        upload_dir.mkdir(parents=True, exist_ok=True)
        new_doc = DocModel(**form_data)
        new_doc.author_id = current_user.id
        uploaded_file = file_data["file"]
        file_bytes = uploaded_file.read()
        cipher = Fernet(os.getenv("KEY_DOCUMENT"))
        encrypted_doc = cipher.encrypt(file_bytes)
        h = hashlib.sha256()
        h.update(encrypted_doc)
        uuid4 = uuid.uuid4()
        new_doc.file_path = f"{library_prefix}{uuid4}.bin"
        new_doc.file_hash = h.hexdigest()
        new_doc.file_original_name = uploaded_file.filename
        new_doc.created_at = datetime.now()


        with open(f"{library_prefix}{uuid4}.bin", "wb") as f:
            f.write(encrypted_doc)

        db.session.add(new_doc)

        db.session.commit()
        db.session.add(AuditLogModel(
            user_id=current_user.id,
            action='created_document',
            document_id=new_doc.id,
            document_title=new_doc.title,
            document_reg_number=new_doc.reg_number,
            timestamp=datetime.now(),
            is_complete=True
        ))
        db.session.commit()
        return new_doc
    @blp.arguments(DocumentQuerySchema, location='query')
    @blp.response(200,DocumentSchema(many=True))
    @permission_required("read")
    def get(self, filter_data):
        all_doc = DocModel.query
        access_level = filter_data.get("access_level")
        category = filter_data.get("category")
        status = filter_data.get("status")
        name = filter_data.get("name")
        offset = filter_data.get("offset", 0)
        limit = filter_data.get("limit")
        all_doc = all_doc.order_by(DocModel.created_at.desc())
        if(current_user.role.id==3):
            all_doc = all_doc.filter(DocModel.access_level==AccessLevelDoc.public)

        if(access_level):
            all_doc = all_doc.filter(DocModel.access_level==access_level
            )
        if(category):
            all_doc = all_doc.filter(DocModel.category==category)
        if(status):
            all_doc = all_doc.filter(DocModel.status==status)
        if(name):
            all_doc = all_doc.filter(DocModel.title.ilike(f'%{name}%'))
        
        all_doc = all_doc.offset(offset)
        if(limit is not None):
            all_doc = all_doc.limit(limit)
        
        db.session.add(AuditLogModel(
            user_id=current_user.id,
            action='view_document_list',
            timestamp=datetime.now(),
            is_complete=True
        ))
        db.session.commit()
        return all_doc

@blp.route("/api/documents/<int:document_id>/download")
class DocDownload(MethodView):
    @permission_required("download_doc")
    def get(self, document_id):
        find_doc = DocModel.query.get_or_404(document_id)
        if(current_user.role.id==3 and find_doc.access_level!=AccessLevelDoc.public):
            db.session.add(AuditLogModel(
                user_id=current_user.id,
                action='download_document',
                document_id = find_doc.id,
                document_title = find_doc.title,
                document_reg_number = find_doc.reg_number,
                timestamp=datetime.now(),
                is_complete=False
            ))
            db.session.commit()
            return {"message": 'Permission denied'}, 403
        with open(find_doc.file_path, "rb") as f:
            file_bytes = f.read()

        h = hashlib.sha256()
        h.update(file_bytes)
        if(h.hexdigest()==find_doc.file_hash):
            cipher = Fernet(os.getenv("KEY_DOCUMENT"))
            decrypted_data = cipher.decrypt(file_bytes)
            db.session.add(AuditLogModel(
                user_id=current_user.id,
                action='download_document',
                document_id=find_doc.id,
                document_title=find_doc.title,
                document_reg_number=find_doc.reg_number,
                timestamp=datetime.now(),
                is_complete=True
            ))
            db.session.commit()
            return send_file(BytesIO(decrypted_data), download_name=find_doc.file_original_name, as_attachment=True)
        else:
            db.session.add(AuditLogModel(
                user_id=current_user.id,
                action='download_document',
                document_id=find_doc.id,
                document_title=find_doc.title,
                document_reg_number=find_doc.reg_number,
                timestamp=datetime.now(),
                is_complete=False
            ))
            db.session.commit()
            return {"message": "File checksum mismatch detected"}, 409

@blp.route("/api/documents/<int:document_id>")
class DocOperations(MethodView):
    @permission_required("read")
    @blp.response(200,DocumentSchema)
    def get(self, document_id):
        find_doc = DocModel.query.get_or_404(document_id)
        return find_doc

    @blp.arguments(EditDocumentSchema, location='form')
    @blp.arguments(UploadDocumentSchema, location='files', required=False)
    @permission_required("edit")
    def patch(self, form_data, file_data, document_id):
        upload_dir = Path(library_prefix)
        upload_dir.mkdir(parents=True, exist_ok=True)
        role = RoleModel.query.filter(RoleModel.users.any(id=current_user.id)).first()
        all_selfdoc = DocModel.query.filter(DocModel.author_id==current_user.id).all()
        if(any(doc.id==document_id for doc in all_selfdoc)):
            pass
        else:
            if (role.edit_anydoc==False):
                find_doc = DocModel.query.get_or_404(document_id)
                db.session.add(AuditLogModel(
                    user_id=current_user.id,
                    action='edit_document',
                    document_id=document_id,
                    document_title=find_doc.title,
                    document_reg_number=find_doc.reg_number,
                    timestamp=datetime.now(),
                    is_complete=False
                ))
                db.session.commit()
                return {"message": "Permission denied"}, 403
        find_doc = DocModel.query.get_or_404(document_id)
        for key, value in form_data.items():
            setattr(find_doc, key,value)
        uploaded_file = file_data.get("file", None)
        if(uploaded_file):
            file_bytes = uploaded_file.read()
            os.remove(find_doc.file_path)
            cipher = Fernet(os.getenv("KEY_DOCUMENT"))
            encrypt_data = cipher.encrypt(file_bytes)
            h = hashlib.sha256()
            h.update(encrypt_data)
            uuid4 = uuid.uuid4()
            new_path = f"{library_prefix}{uuid4}.bin"
            with open(new_path, 'wb') as f:
                f.write(encrypt_data)
            find_doc.file_hash = h.hexdigest()
            find_doc.file_original_name = uploaded_file.filename
            find_doc.file_path = new_path
        find_doc.updated_at = datetime.now()
        db.session.add(find_doc)
        db.session.commit()
        db.session.add(AuditLogModel(
            user_id=current_user.id,
            action='edit_document',
            document_id=find_doc.id,
            document_title=find_doc.title,
            document_reg_number=find_doc.reg_number,
            timestamp=datetime.now(),
            is_complete=True
        ))
        db.session.commit()
        return {"message": "File edited"}, 200
    @permission_required('delete')
    def delete(self, document_id):
        role = RoleModel.query.filter(RoleModel.users.any(id=current_user.id)).first()
        all_selfdoc = DocModel.query.filter(DocModel.author_id == current_user.id).all()
        if (any(doc.id == document_id for doc in all_selfdoc)):
            pass
        else:
            if (role.del_anydoc == False):
                find_doc = DocModel.query.get_or_404(document_id)
                db.session.add(AuditLogModel(
                    user_id=current_user.id,
                    action='delete_document',
                    document_id=document_id,
                    document_title=find_doc.title,
                    document_reg_number=find_doc.reg_number,
                    timestamp=datetime.now(),
                    is_complete=False
                ))
                db.session.commit()
                return {"message": "Permission denied"}, 403
        find_doc = DocModel.query.get_or_404(document_id)
        os.remove(find_doc.file_path)
        db.session.add(AuditLogModel(
            user_id=current_user.id,
            action='delete_document',
            document_id=document_id,
            document_title=find_doc.title,
            document_reg_number=find_doc.reg_number,
            timestamp=datetime.now(),
            is_complete=True
        ))
        db.session.commit()
        db.session.delete(find_doc)
        db.session.commit()

        return {"message": "Delete success"}, 200
    

@blp.route("/api/documents/count")
class DocsCount(MethodView):
    @permission_required("read")
    @blp.arguments(DocumentQuerySchema, location='query')
    def get(self, filter_data):
        all_doc = DocModel.query
        access_level = filter_data.get("access_level")
        category = filter_data.get("category")
        status = filter_data.get("status")
        name = filter_data.get("name")

        if(current_user.role.id==3):
            all_doc = all_doc.filter(DocModel.access_level==AccessLevelDoc.public)

        if(access_level):
            all_doc = all_doc.filter(DocModel.access_level==access_level
            )
        if(category):
            all_doc = all_doc.filter(DocModel.category==category)
        if(status):
            all_doc = all_doc.filter(DocModel.status==status)
        if(name):
            all_doc = all_doc.filter(DocModel.title.ilike(f'%{name}%'))
        return {"count": all_doc.count()}