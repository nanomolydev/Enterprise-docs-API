from flask.views import MethodView
from flask_smorest import Blueprint
from flask import render_template
blp = Blueprint("frontend", __name__, description='Frontend Endpoints')

@blp.route("/login")
class LoginFrontend(MethodView):
    def get(self):
        return render_template("auth.html")


@blp.route("/files")
class FilesFrontend(MethodView):
    def get(self):
        return render_template("files.html")
