# 🐍 Backend Deep Dive

The CaloAI backend is built on **Flask**, focusing on RESTful principles, security, and a robust data model.

---

## 📂 Core Business Logic (`server/server/App/`)

### 1. Database Schema (`models.py`)
We use **SQLAlchemy** for a relational PostgreSQL database.
-   **Polymorphism**: The `User` model is the base class for `Client`, `Nutritionist`, and `Admin`.
-   **Client Model**: Tracks weight, height, age, gender, weight goal, and assigned nutritionist.
-   **Nutritionist Model**: Tracks expertise, bio, and years of experience.
-   **Relationships**: `Nutritionist` has a `relationship` (one-to-many) with `Client`.

### 2. Blueprints (`auth/routes.py`)
Authentication is modularized into a blueprint:
-   `POST /register`: Creates a new user (defaults to `client` role).
-   `POST /login-email`: Validates email existence.
-   `POST /login-password`: Validates password and issues a JWT token.
-   `GET /me`: Returns the current user's profile based on their token.

---

## 🛠️ Extensions & Helpers (`extensions.py`)

-   **SQLAlchemy (`db`)**: Shared instance for database operations.
-   **Migrate**: Handles schema changes via Alembic/Flask-Migrate.
-   **CORS**: Configured to allow communication from the React frontend (`FRONTEND_URL`).
-   **Bcrypt**: Used for hashing and salting passwords (never stored as plain text).

---

## 🧠 Services & Task Handlers (Planned)

### 1. AI Scanning
-   Backend receives an image or food description.
-   Requests are processed by an AI engine (mocked in early dev) to return calorie and macro estimates.
-   Results are stored as a `MealLog` entry.

### 2. Consultations
-   A system for booking sessions and logging notes.
-   Nutritionists can update a client's weight goal and diet plan directly through the API.
