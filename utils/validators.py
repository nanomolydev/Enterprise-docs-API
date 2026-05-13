# pylint: disable=missing-class-docstring
from marshmallow import validate, ValidationError

def validate_uppercase(value):
    if not any(c.isupper() for c in value):
        raise ValidationError("Пароль должен содержать хотя бы одну заглавную букву")

def validate_lowercase(value):
    if not any(c.islower() for c in value):
        raise ValidationError("Пароль должен содержать хотя бы одну строчную букву")

def validate_digit(value):
    if not any(c.isdigit() for c in value):
        raise ValidationError("Пароль должен содержать хотя бы одну цифру")

def validate_special(value):
    specials = "!@#$%^&*()_+"
    if not any(c in specials for c in value):
        raise ValidationError(f"Пароль должен содержать хотя бы один специальный символ {specials}")