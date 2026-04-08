# 🎨 Frontend Deep Dive

The CaloAI frontend is a React-powered SPA (Single Page Application) designed with a "Vitality" aesthetic — clean, professional, and fast.

---

## 🚦 Routing & Security (`src/routes/`)

We use a layered routing approach to ensure data privacy:

### 1. `PrivateRoute.jsx`
-   Checks if a user is logged in (`AuthContext`).
-   Redirects to `/login` if no user session is found.

### 2. `RoleRoute.jsx`
-   Wraps routes to ensure the logged-in user has the correct role (`client`, `nutritionist`, `admin`).
-   Redirects to the home page or specific dashboard if unauthorized.
-   Key Roles:
    -   **Client**: Accesses `/dashboard`, `/dashboard/scan`, `/dashboard/log`, etc.
    -   **Nutritionist**: Accesses `/nutritionist/clients`, `/nutritionist/progress/:id`, etc.
    -   **Admin**: Accesses `/admin/stats`, `/admin/users`, `/admin/nutritionists`, etc.

---

## 🏗️ State Management (`src/context/AuthContext.jsx`)

We use a custom `AuthContext` to handle:
-   **User Data**: Name, email, ID.
-   **Role Persistance**: Stored in `localStorage` to survive page refreshes.
-   **Auth State**: `login()` and `logout()` functions that manage JWT tokens and local storage.

---

## 💎 Design System & Styles

The look and feel are powered by **Tailwind CSS**, emphasizing:
-   **Glassmorphism**: Translucent panels and blurred backgrounds for a premium feel.
-   **Vitality Gradient**: A custom teal-to-emerald gradient used for primary buttons and CTAs.
-   **Typography**: Clean sans-serif fonts with carefully balanced spacing.
-   **Micro-interactions**: Hover effects, smooth transitions, and pulse animations for AI scanning.

---

## 📱 Key Components

### 1. `Sidebar.jsx` (Client-side)
-   Navigation for users.
-   Dynamically shows "Become a Nutritionist" if the user is a standard client.
-   Links to scanning, progress tracking, and consultations.

### 2. `Login.jsx`
-   A multi-step, animated login/registration flow.
-   Features split-screen layout with branding and form.
-   Handles password resets and role redirection.

### 3. `DashboardOverview.jsx`
-   A high-level view of health data, calories, and recent logs using a card-based layout.
