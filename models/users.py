from db import db
from flask_login import UserMixin
from login import login
from werkzeug.security import generate_password_hash, check_password_hash


class UserModel(UserMixin,db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=True)
    role = db.relationship("RoleModel", back_populates='users')
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

@login.user_loader
def load_user(id):
    return db.session.get(UserModel, id)