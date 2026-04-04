from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer as serializer
import time
from datetime import timedelta

bc = Bcrypt()
ma = Marshmallow()
mail = Mail()
s = serializer  # not initialized here — we need the secret key


# ── In-memory Redis fallback for development ────────────────────────────────────

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