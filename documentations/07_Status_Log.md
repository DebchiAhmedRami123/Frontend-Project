# 🕒 Status Log (Current Task Tracking)

This file tracks the **active** task currently being developed. If you are a new AI or developer, start here to see what was in progress.

---

## 🚀 Active Task: Nutritionist Application Flow (Apr 2026)

### 🧩 Problem Statement
The current registration flow allowed users to pick between "Patient" and "Nutritionist" at the start. This was too "open" for a professional clinical platform.

### 🎯 Goal
1.  **Remove role selection** from the registration page. Everyone registers as a standard user first.
2.  **Add a professional application portal** on the home page for specialists.
3.  **Submission Logic**: Nutritionists submit a profile/resume which enters a "Pending" state for Admin review.
4.  **Admin Approval**: Access to the Nutritionist Dashboard is only unlocked after approval.

### ✅ Completed Steps
- [x] Created full project documentation in `documentations/`.
- [x] Updated `README.md` with critical documentation links.
- [x] Established implementation plan for the application flow.
- [x] Edit `Login.jsx` to remove role picker during registration.
- [x] Create `ApplyNutritionist.jsx` in `src/pages/public/`.
- [x] Refactor `Navbar` into a shared component for consistency.
- [x] Add routes in `AppRouter.jsx` for the application flow.
- [x] Update `Home.jsx` "For Professionals" link.
- [x] Add "Become a Nutritionist" link to `Sidebar.jsx`.

### 🛠️ Next Steps
- [ ] Admin approval logic implementation (Backend/Frontend).
- [ ] Profile management for accepted nutritionists.

---

## 🧪 Current Known Issues
-   The "Apply" flow will be **frontend-only** (mocked) for now, as per user instructions.
-   Direct navigation to `/nutritionist/` routes currently relies on manual database role updates; the application flow will bridge this gap.
