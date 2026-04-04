from flask import Flask, request, make_response
from dotenv import load_dotenv
load_dotenv()
from App.extensions import(
    bc,ma,jwt,mail
)
from App.models import db
from App.config import Config



def create_app():
    app = Flask(__name__)

    # ── CORS — handle preflight OPTIONS + add headers to all responses ──────
    @app.before_request
    def handle_preflight():
        if request.method == 'OPTIONS':
            response = make_response()
            origin = request.headers.get('Origin')
            if origin:
                response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if origin:
            response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    #set app configuration
    app.config.from_object(Config)

    #initialization app with extensions
    db.init_app(app)
    bc.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)




    from App.auth.extensions import bp_auth
    app.register_blueprint(bp_auth)
    with app.app_context():
        db.create_all()

    return app