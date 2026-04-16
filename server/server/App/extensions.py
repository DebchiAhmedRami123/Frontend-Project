from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer as serializer
import time
from flask_migrate import Migrate
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

bc = Bcrypt()
ma = Marshmallow()
mail = Mail()
migrate = Migrate()
s = serializer  # not initialized here — we need the secret key

class Base(DeclarativeBase):
    def __repr__(self):
        cols = [f"{c}={getattr(self, c)}" for c in self.__mapper__.columns.keys()]
        return f"{self.__class__.__name__}({', '.join(cols)})"


db = SQLAlchemy(model_class=Base)


# In-memory Redis fallback for development

class MemoryStore:
    """Drop-in replacement for redis.Redis when Redis is not available."""

    def __init__(self):
        self._store = {}
        self._expiry = {}

    def _clean(self, key):
        if key in self._expiry and time.time() > self._expiry[key]:
            self._store.pop(key, None)
            self._expiry.pop(key, None)

    def get(self, key):
        self._clean(key)
        return self._store.get(key)

    def set(self, key, value):
        self._store[key] = value

    def setex(self, key, ttl, value):
        if isinstance(ttl, timedelta):
            ttl = int(ttl.total_seconds())
        self._store[key] = value
        self._expiry[key] = time.time() + ttl

    def exists(self, key):
        self._clean(key)
        return key in self._store

    def delete(self, key):
        self._store.pop(key, None)
        self._expiry.pop(key, None)

    def incr(self, key):
        self._clean(key)
        val = self._store.get(key, 0)
        self._store[key] = int(val) + 1
        return self._store[key]

    def expire(self, key, ttl):
        self._expiry[key] = time.time() + ttl

    def ttl(self, key):
        if key in self._expiry:
            remaining = int(self._expiry[key] - time.time())
            return max(remaining, 0)
        return -1

    def ping(self):
        return True


# ── Create redis_client (real Redis or in-memory fallback) ──────────────────────

try:
    import redis
    redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
    redis_client.ping()
except Exception:
    print("WARNING: Redis not available — using in-memory store (development mode)")
    redis_client = MemoryStore()

# Do you need the MemoryStore on your local PC?
# If you are comfortable installing Redis (via Docker, apt, brew, or Windows Subsystem for Linux) 
# and you want the full Redis experience – you don’t need this fallback. You can just run Redis and connect to it.
# But the fallback is a convenience for cases where you want to:
# Write code that works anywhere without extra setup.
# Switch between “real Redis in production” and “no Redis in development” without changing code (just swap the client object).


# ── JWT setup ───────────────────────────────────────────────────────────────────

jwt = JWTManager()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_data):
    jti = jwt_data['jti']
    return redis_client.exists(jti)

@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_data):
    return {"error": "Token has expired"}, 401

@jwt.unauthorized_loader
def unauthorized_response(error):
    return {"error": "Missing or invalid token"}, 401

@jwt.revoked_token_loader
def revoked_token_response(jwt_header, jwt_data):
    return {"error": "Token has been revoked, please log in again"}, 401