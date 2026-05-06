from functools import wraps

from flask import abort
from flask_login import login_required, current_user

from models import UserModel


def permission_required(permission):
    def decorator(func):
        @wraps(func)
        @login_required
        def wrapper(*args, **kwargs):
            if(permission=='read'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.read_doc==False):
                    abort(403, 'Permission denied')
            if(permission=='edit'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.edit_selfdoc == True or find_user.role.edit_anydoc == True):
                    pass
                else:
                    abort(403, 'Permission denied')
            if (permission == 'delete'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.del_selfdoc == True or find_user.role.del_anydoc == True):
                    pass
                else:
                    abort(403, 'Permission denied')
            if (permission == 'user_manage'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.user_manage == False):
                    abort(403, 'Permission denied')
            if (permission == 'create_doc'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.create_doc == False):
                    abort(403, 'Permission denied')
            if (permission == 'download_doc'):
                find_user = UserModel.query.get_or_404(current_user.id)
                if (find_user.role.download_doc == False):
                    abort(403, 'Permission denied')
            return func(*args, **kwargs)

        return wrapper
    return decorator