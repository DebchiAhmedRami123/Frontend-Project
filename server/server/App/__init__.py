from flask import Flask, request, make_response
from dotenv import load_dotenv
load_dotenv()
from App.extensions import(
    bc, ma, jwt, mail, migrate, db
)
from App.config import Config


def create_app():
    app = Flask(__name__)

    # ── CORS — handle preflight OPTIONS(before return response of this request) + add headers to all responses(after return response to this request) ──────
    # run Before every request that reaches the Flask app
    # check if the request method is OPTIONS (preflight request)
    
    # very important: the browser sends an OPTIONS preflight request automatically only when the actual request is `not simple`
    @app.before_request #The server must respond with CORS headers to tell the browser whether the actual request is allowed by this function
    def handle_preflight(): 
            #Browsers send an OPTIONS preflight request automatically for cross-origin requests that are not “simple”
        if request.method == 'OPTIONS': 
            response = make_response()
            origin = request.headers.get('Origin')
            if origin:
                response.headers['Access-Control-Allow-Origin'] = origin
            # tell the browser which headers and methods are allowed for CORS requests (coming from the browsers)
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            # The preflight request is answered immediately, and the normal route handler is not called for that OPTIONS request.
            return response

    @app.after_request # run After each request, after the view function returns but before the response is sent to the client.
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
    migrate.init_app(app, db)



    from App.auth import bp_auth
    app.register_blueprint(bp_auth)
    with app.app_context():
        db.create_all()

    return app

# What changes by placing the CORS code inside the factory?
# Every app instance created by calling create_flask_app() will have CORS enabled globally.
# All routes registered on that app (whether defined inside the factory or on the returned app)
# will automatically support cross-origin requests with credentials and the specified headers/methods.
# This is a clean, self‑contained way to enable CORS without relying on third‑party extensions like Flask-CORS. 
# The configuration is tied to the app instance, not to a global variable.

# preflight:
# The browser sends one OPTIONS request per cross-origin endpoint + method + headers combination.
# The server’s preflight response can include Access-Control-Max-Age (e.g., 86400 seconds = 1 day). During that time, 
# the browser caches the result and skips sending another OPTIONS for that same request type.
# After the preflight succeeds, the actual request (e.g., POST, PUT, DELETE) is sent – without another OPTIONS.
# So in normal operation, you will see only one OPTIONS call per unique API endpoint and method 
# (or none if caching is enabled), not one per actual request.


# Is caching enabled by default?
# Caching is not enabled by default
# The browser does not cache the preflight result unless the server explicitly 
# sends the Access-Control-Max-Age header in the OPTIONS response. Example: Access-Control-Max-Age: 86400   // 24 hours in seconds
# Without this header, the browser sends an OPTIONS request every time a non‑simple request is made 
# (or per browser implementation defaults – often 5 seconds). So you should add max-age to reduce network traffic.