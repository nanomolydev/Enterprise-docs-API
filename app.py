import datetime
import os

from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

from db import db
import models
from models import UserModel, RoleModel
from resources.users import blp as UsersBlueprint
from resources.roles import blp as RolesBlueprint
from resources.documents import blp as DocumentBlueprint
from resources.auth import blp as AuthBlueprint
from resources.audit_log import blp as AuditLogBlueprint
from resources.frontend import blp as FrontendBlueprint
from dotenv import load_dotenv
from login import login
load_dotenv()
roles = [
    RoleModel(
        title='Admin',
        create_doc=True,
        read_doc=True,
        edit_selfdoc=True,
        del_selfdoc=True,
        edit_anydoc=True,
        del_anydoc=True,
        user_manage=True,
        read_logs=True,
        download_doc=True
    ),
    RoleModel(
        title='Employee',
        create_doc=True,
        edit_selfdoc=True,
        del_selfdoc=True,
        download_doc=True
    ),
    RoleModel(
        title='Reader'
    )
]

admin = UserModel()
admin.full_name = "Admin"
admin.created_at = datetime.datetime.now()
admin.login = os.getenv("admin_login")
admin.set_password(os.getenv("admin_password"))
admin.role_id = 1

def create_app():

    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("KEY_AUTH")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['OPENAPI_VERSION'] = '3.0.3'
    app.config['API_VERSION'] = '1.0.0'
    app.config['API_TITLE'] = 'Enterprise docs'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
    login.init_app(app)

    @login.unauthorized_handler
    def unauthorized():
        return jsonify({"message": "Необходима авторизация"}), 401

    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        messages = {
            400: "Некорректный запрос",
            401: "Необходима авторизация",
            403: "Доступ запрещён",
            404: "Запрошенные данные не найдены",
            405: "Метод запроса не поддерживается",
            409: "Конфликт данных",
            422: "Ошибка валидации данных",
            500: "Внутренняя ошибка сервера",
        }
        description = getattr(err, "description", "")
        message = description if any("а" <= char.lower() <= "я" or char == "ё" for char in description) else messages.get(err.code, "Ошибка выполнения запроса")
        return jsonify({"message": message}), err.code

    db.init_app(app)
    with app.app_context():
        db.create_all()
        for role in roles:
            exists_role = RoleModel.query.filter_by(title=role.title).first()
            if exists_role is None:
                db.session.add_all(roles)
        exists_admin = UserModel.query.filter_by(login=admin.login).first()
        if exists_admin is None:
            db.session.add(admin)
        db.session.commit()

    app.register_blueprint(UsersBlueprint)
    app.register_blueprint(RolesBlueprint)
    app.register_blueprint(DocumentBlueprint)
    app.register_blueprint(AuthBlueprint)
    app.register_blueprint(AuditLogBlueprint)
    app.register_blueprint(FrontendBlueprint)
    return app
