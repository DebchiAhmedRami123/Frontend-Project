# 🛠️ Development & Contribution

Welcome to the team! This guide explains how to get up and running and how to contribute to the CaloAI codebase.

---

## 🚀 Quick Setup

### 1. Repository Access
Ensure you have the latest code:
```bash
git pull origin main
```

### 2. Frontend Configuration
-   Location: `nutrition-app/`
-   Command: `npm run dev`
-   Standard Port: `5173`

### 3. Backend Configuration
-   Location: `server/server/`
-   Command: `python run.py`
-   Standard Port: `5000`
-   **.env Setup**: (Ask an admin for keys)
    -   `SECRET_KEY`: For session and tokens.
    -   `DATABASE_URI`: Connection string for PostgreSQL.
    -   `FRONTEND_URL`: Usually `http://localhost:5173`.

---

## 🤝 Coding Standards

-   **Frontend**:
    -   Use **Functional Components** with hooks.
    -   Keep UI components in `src/components` and page-level views in `src/pages`.
    -   Use **Tailwind CSS** for all styling; avoid inline styles.
-   **Backend**:
    -   Use **Blueprints** for new feature sets.
    -   Always use **Declarative Base** for new SQLAlchemy models.
    -   Implement `to_dict` on all models for easy JSON serialization.
-   **Commits**: Use descriptive messages like `feat: add ai-scanner-v1` or `fix: auth-redirect-bug`.

---

## 📜 Project Evolution

-   **V1 (NutriTrack)**: Initial foundation, basic auth, and dashboard.
-   **V2 (CaloAI Rebranding)**: Premium aesthetic overhaul, glassmorphism, and brand transition.
-   **V3 (Professional Suite - Current)**: Implementation of the Nutritionist application flow, admin approval logic, and client-professional assignment.

---

## 🔮 Future Roadmap

1.  **AI Image Uploads**: Moving from mock text-based estimates to full computer vision integration.
2.  **DNA & Biomarker Sync**: Integrating third-party health data.
3.  **Real-time Consultations**: Video and chat integration for nutritionists and patients.
