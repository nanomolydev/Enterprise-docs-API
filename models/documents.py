from db import db
from enum import Enum

class CategoryDoc(str,Enum):
    personal_doc = 'Кадровый документ',
    financial_doc = 'Финансовый документ',
    contract_doc = 'Договор',
    internal_doc = 'Внутренний регламент',
    technical_doc = 'Техническая документация'

class AccessLevelDoc(str,Enum):
    public = 'Открытый',
    official_use = 'Для служебного пользования',
    confidential = 'Конфиденциально'

class StatusDoc(str,Enum):
    active = 'Активный',
    reviewing = 'На согласовании',
    archived = 'Архив',
    expired = 'Истёк срок хранения'

class DocModel(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    reg_number = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.Date, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    department = db.Column(db.String(100), nullable=True)
    category = db.Column(db.Enum(CategoryDoc), nullable=False)
    access_level = db.Column(db.Enum(AccessLevelDoc), nullable=False)
    status = db.Column(db.Enum(StatusDoc), nullable=False)
    storage_deadline = db.Column(db.DateTime, nullable=True)
    file_path = db.Column(db.String(100), nullable=False)
    file_original_name = db.Column(db.String(100), nullable=False)
    file_hash = db.Column(db.String(256), nullable=False)