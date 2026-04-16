# 🏗️ Architecture & Stack

CaloAI follows a modern **Monorepo** structure, separating the client-side experience from the server-side logic while maintaining a shared context.

---

## 🛠️ The Tech Stack

### Frontend (`nutrition-app/`)
-   **Core**: React 18+ (using Vite for lightning-fast bundling).
-   **Styling**: Tailwind CSS (customized for "Vitality" aesthetics).
-   **Routing**: React Router v6.
-   **State**: React Context API (`AuthContext`) for auth and role persistence.
-   **Icons**: Material Symbols Outlined (Google Fonts).

### Backend (`server/`)
-   **Framework**: Flask (Python 3.10+).
-   **Database**: PostgreSQL (relational storage for users, logs, and relationships).
-   **ORM**: SQLAlchemy 2.0 (using Declarative Mapping).
-   **Auth**: JWT (JSON Web Tokens) for stateless session handling.
-   **Serialization**: Custom `to_dict` methods and Marshmallow (planned).

---

## 📁 Directory Structure (Key Paths)

```text
/
├── nutrition-app/          # React Frontend
│   ├── src/
│   │   ├── api/            # Axios/Fetch abstractions
│   │   ├── components/     # UI components (shared, layout)
│   │   ├── context/        # Auth and global state
│   │   ├── hooks/          # Custom hooks (e.g., useAuth)
│   │   ├── pages/          # Page components (public, user, nutritionist, admin)
│   │   └── routes/         # Routing logic (PrivateRoute, RoleRoute)
│   └── package.json
│
├── server/                 # Flask Backend
│   ├── server/             # Root server package
│   │   ├── App/            # Main application logic
│   │   │   ├── auth/       # Authentication blueprints and routes
│   │   │   ├── models.py   # SQLAlchemy models/schema
│   │   │   └── extensions.py # Shared Flask extensions (db, migrate, etc)
│   │   └── run.py          # Entry point
│   └── requirements.txt
```

---

## 🔐 Data & Auth Flow

1.  **Request**: Frontend sends an HTTP request (via `authApi.js`).
2.  **Auth**: Backend validates JWT header or basic credentials.
3.  **Role Logic**: `RoleRoute.jsx` on the frontend ensures users only access pages matching their assigned roles (`client`, `nutritionist`, `admin`).
4.  **Database**: PostgreSQL handles complex relationships, particularly between Nutritionists and their assigned Clients (many-to-one).
