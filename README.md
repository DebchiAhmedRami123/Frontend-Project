# 🥗 CaloAI — Full Stack Digital Vitality Platform

Welcome to the **CaloAI** (formerly NutriTrack) codebase! This is a monorepo containing everything needed for our AI-powered nutrition and fitness platform.

---

## 📚 Project Documentation
> [!IMPORTANT]
> For a full technical deep dive, architecture analysis, and current project status, please refer to the **[documentations/](file:///c:/Users/HP/Desktop/AI%20Calorie%20Estimation%20System%20Project/Frontend%20Project/documentations/)** folder. It is the single source of truth for all developers (and AI agents) working on this project.

- **[01_Overview.md](file:///c:/Users/HP/Desktop/AI%20Calorie%20Estimation%20System%20Project/Frontend%20Project/documentations/01_Overview.md)**: Goals and Mission.
- **[02_Architecture.md](file:///c:/Users/HP/Desktop/AI%20Calorie%20Estimation%20System%20Project/Frontend%20Project/documentations/02_Architecture.md)**: Tech Stack and Flow.
- **[07_Status_Log.md](file:///c:/Users/HP/Desktop/AI%20Calorie%20Estimation%20System%20Project/Frontend%20Project/documentations/07_Status_Log.md)**: **What is being worked on right now.**

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
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd server/server
   ```
2. **Setup Virtual Environment (Recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables (.env):**
   - Create a file named `.env` in `server/server/`.
   - Ask @DebchiAhmedRami123 for the keys or use:
     ```env
     SECRET_KEY=yoursecret
     DB_password=your_db_password
     DATABASE_URI=postgresql://postgres:your_db_password@localhost:5432/nutrition_app
     FRONTEND_URL=http://localhost:5173
     ```
5. **Run the server:**
   ```bash
   python run.py
   ```
   *Note: On the first run, the database tables will be created automatically.*

### 4. Important: Creating Your First User
Since you're starting with an empty database:
1. Open the app at **http://localhost:5173**.
2. Go to the **Register** page.
3. Create a new account. By default, new accounts are created with the **"client"** role.
4. To create an **Admin** or **Nutritionist**, you can manually update your role in the database or use a script.

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
