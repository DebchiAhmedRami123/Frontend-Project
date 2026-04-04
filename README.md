# 🥗 CaloAI — Full Stack Digital Vitality Platform

Welcome to the **CaloAI** (formerly NutriTrack) codebase! This is a monorepo containing everything needed for our AI-powered nutrition and fitness platform.

---

## 📂 Project Structure

- **`nutrition-app/`**: Our modern React + Tailwind CSS frontend dashboard.
- **`server/`**: The Flask + PostgreSQL backend engine that handles auth, meal logs, and AI scanning.

---

## 🛠️ Getting Started (For Collaborators)

If you just cloned this repository, follow these steps to get the project running locally:

### 1. Prerequisites (What you need installed)
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** (Active locally, database named `nutrition_app`)

### 2. Frontend Setup
```bash
cd nutrition-app
npm install
npm run dev
```
The frontend will start at **http://localhost:5173**.

### 3. Backend Setup
1. Open a new terminal.
2. Navigate to the backend folder:
   ```bash
   cd server/server
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables (.env):**
   - Create a new file named `.env` in `server/server/`.
   - Ask @DebchiAhmedRami123 for the secret keys, or use these placeholders:
     ```env
     SECRET_KEY=yoursecret
     DB_password=your_db_pass
     DATABASE_URI=postgresql://postgres:your_db_pass@localhost:5432/nutrition_app
     FRONTEND_URL=http://localhost:5173
     # You will also need a Google Mail setup for password resets
     ```
5. Run the server:
   ```bash
   python run.py
   ```
The backend will start at **http://localhost:5000**.

---

## 🔒 Security Reminder
- Never commit your `.env` file to GitHub.
- Keep your PostgreSQL credentials local.

## 🤝 Collaboration Workflow
1. **Always `git pull`** before starting a session to avoid merge conflicts.
2. Push your changes regularly to your feature branch or main.
3. Keep frontend components inside `src/components` and new pages in `src/pages`.

---

**Happy Coding! 🚀**
