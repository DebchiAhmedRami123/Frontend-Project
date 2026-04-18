from flask import Flask, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
from App.extensions import(
    db,
    bc,
    ma,
    jwt,
    mail
)
from App.config import Config


def create_app():
    app = Flask(__name__)

    # ── CORS ────────────────────────────────────────────────────────────────────
    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"])

    #set app configuration
    app.config.from_object(Config)

    #initialization app with extensions
    db.init_app(app)
    bc.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    from App.auth.routes import bp_auth
    from App.meals.routes import bp_meals
    from App.recognition.routes import bp_recognition

    app.register_blueprint(bp_auth)
    app.register_blueprint(bp_meals)
    app.register_blueprint(bp_recognition)

    with app.app_context():
        db.create_all()

    return app