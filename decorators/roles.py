from datetime import datetime
from functools import wraps

from flask import abort
from flask_login import login_required, current_user

from models import UserModel
from db import db
from models.audit_log import AuditLogModel

def permission_required(permission):
    def decorator(func):
        @wraps(func)
        @login_required
        def wrapper(*args, **kwargs):
            if(current_user.is_active==False):
                db.session.add(AuditLogModel(
                    user_id=current_user.id,
                    action='user_login',
                    timestamp=datetime.now(),
                    is_complete=False
                ))
                db.session.commit()
                abort(403, 'Permission denied')
            if(permission=='read'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.read_doc==False):
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='view_document',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            if(permission=='edit'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.edit_selfdoc == True or find_user.role.edit_anydoc == True):
                    pass
                else:
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='edit_document',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            if (permission == 'delete'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.del_selfdoc == True or find_user.role.del_anydoc == True):
                    pass
                else:
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='delete_document',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            if (permission == 'user_manage'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.user_manage == False):
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='manage_user',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            if (permission == 'create_doc'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.create_doc == False):
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='created_document',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            if (permission == 'download_doc'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.download_doc == False):
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='download_document',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            if(permission=='read_logs'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.read_logs == False):
                    db.session.add(AuditLogModel(
                        user_id=current_user.id,
                        action='read_logs',
                        timestamp=datetime.now(),
                        is_complete=False
                    ))
                    db.session.commit()
                    abort(403, 'Permission denied')
            return func(*args, **kwargs)

        return wrapper
    return decorator