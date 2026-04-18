import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'

// public
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import RegisterUser from '../pages/public/RegisterUser'
import Contact from '../pages/public/Contact'
import ApplyNutritionist from '../pages/public/ApplyNutritionist'

// user
import UserDashboard from '../pages/user/Dashboard'
import Progress from '../pages/user/Progress'
import FoodScan from '../pages/user/FoodScan'
import MealLog from '../pages/user/MealLog'
import Recommendations from '../pages/user/Recommendations'
import UserProfile from '../pages/user/Profile'
import MealDetails from '../pages/user/MealDetails'

// nutritionist
import NutritionistLayout from '../pages/nutritionist/NutritionistLayout'
import UserProgress from '../pages/nutritionist/UserProgress'
import NutritionistProfile from '../pages/nutritionist/Profile'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/apply-nutritionist" element={<ApplyNutritionist />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── Protected ── */}
        <Route element={<PrivateRoute />}>

          {/* User */}
          <Route element={<RoleRoute role="client" />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/progress" element={<Progress />} />
            <Route path="/dashboard/scan" element={<FoodScan />} />
            <Route path="/dashboard/log" element={<MealLog />} />
            <Route path="/dashboard/recommendations" element={<Recommendations />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />
            <Route path="/dashboard/meals/:id" element={<MealDetails />} />
          </Route>

          {/* Nutritionist (Core Profile only) */}
          <Route element={<RoleRoute role="nutritionist" />}>
            <Route element={<NutritionistLayout />}>
              <Route path="/nutritionist/clients" element={<UserProgress />} />
              <Route path="/nutritionist/profile" element={<NutritionistProfile />} />
            </Route>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
