from tkinter.font import names

from flask import Flask
from db import db
import models
from models import UserModel, RoleModel
from resources.users import blp as UsersBlueprint
from resources.roles import blp as RolesBlueprint
from resources.documents import blp as DocumentBlueprint
from dotenv import load_dotenv
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
    ),
    RoleModel(
        title='Reader',
    )
]

def create_app():
    load_dotenv()
    app = Flask(__name__)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['OPENAPI_VERSION'] = '3.0.3'
    app.config['API_VERSION'] = '1.0.0'
    app.config['API_TITLE'] = 'Enterprise docs'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

    db.init_app(app)
    with app.app_context():
        db.create_all()
        for role in roles:
            exists_role = RoleModel.query.filter_by(title=role.title).first()
            if exists_role is None:
                db.session.add_all(roles)
        db.session.commit()

    app.register_blueprint(UsersBlueprint)
    app.register_blueprint(RolesBlueprint)
    app.register_blueprint(DocumentBlueprint)
    return app