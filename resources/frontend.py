from flask.views import MethodView
from flask_smorest import Blueprint
from flask import render_template
blp = Blueprint("frontend", __name__, description='Frontend Endpoints')

@blp.route("/login")
class LoginFrontend(MethodView):
    def get(self):
        return render_template("login.html")


@blp.route("/documents")
class FilesFrontend(MethodView):
    def get(self):
        return render_template("documents.html")
    


@blp.route("/users")
class UsersFrontend(MethodView):
    def get(self):
        return render_template("users.html")
    
@blp.route("/logs")
class LogsFrontend(MethodView):
    def get(self):
        return render_template("logs.html")