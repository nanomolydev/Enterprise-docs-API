from db import db


class RoleModel(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    create_doc = db.Column(db.Boolean, default=False, nullable=False)
    read_doc = db.Column(db.Boolean, default=True, nullable=False)
    edit_selfdoc = db.Column(db.Boolean, default=False, nullable=False)
    del_selfdoc = db.Column(db.Boolean, default=False, nullable=False)
    edit_anydoc = db.Column(db.Boolean, default=False, nullable=False)
    del_anydoc = db.Column(db.Boolean, default=False, nullable=False)
    user_manage = db.Column(db.Boolean, default=False, nullable=False)
    read_logs = db.Column(db.Boolean, default=False, nullable=False)
    download_doc = db.Column(db.Boolean, default=True, nullable=False)
    users = db.relationship('UserModel', back_populates='role')