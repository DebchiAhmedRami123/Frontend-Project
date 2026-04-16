import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'

// public
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import RegisterUser from '../pages/public/RegisterUser'
import Contact from '../pages/public/Contact'
import ApplyNutritionist from '../pages/public/ApplyNutritionist'
import CheckoutPlaceholder from '../pages/public/CheckoutPlaceholder'

// user
import UserDashboard from '../pages/user/Dashboard'
import Progress from '../pages/user/Progress'
import FoodScan from '../pages/user/FoodScan'
import MealLog from '../pages/user/MealLog'
import Recommendations from '../pages/user/Recommendations'
import NutritionistMarketplace from '../pages/user/NutritionistMarketplace'
import NutritionistDetail from '../pages/user/NutritionistDetail'
import BookConsultation from '../pages/user/BookConsultation'
import UserProfile from '../pages/user/Profile'
import MealDetails from '../pages/user/MealDetails'

import NutritionistLayout from '../pages/nutritionist/NutritionistLayout'
import NutritionistDashboard from '../pages/nutritionist/Dashboard'
import Consultations from '../pages/nutritionist/Consultations'
import SessionNotes from '../pages/nutritionist/SessionNotes'
import UserProgress from '../pages/nutritionist/UserProgress'
import UploadPlan from '../pages/nutritionist/UploadPlan'
import NutritionistProfile from '../pages/nutritionist/Profile'

// admin
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ApproveNutritionists from '../pages/admin/ApproveNutritionists'
import ManageSubscriptions from '../pages/admin/ManageSubscriptions'
import Inquiries from '../pages/admin/Inquiries'
import ManageAdmins from '../pages/admin/ManageAdmins'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/apply-nutritionist" element={<ApplyNutritionist />} />
        <Route path="/checkout" element={<CheckoutPlaceholder />} />
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
            <Route path="/nutritionists" element={<NutritionistMarketplace />} />
            <Route path="/nutritionists/:id" element={<NutritionistDetail />} />
            <Route path="/dashboard/book" element={<BookConsultation />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />
            <Route path="/dashboard/meals/:id" element={<MealDetails />} />
          </Route>

          {/* Nutritionist */}
          <Route element={<RoleRoute role="nutritionist" />}>
            <Route element={<NutritionistLayout />}>
              <Route path="/nutritionist/clients" element={<NutritionistDashboard />} />
              <Route path="/nutritionist/consultations" element={<Consultations />} />
              <Route path="/nutritionist/notes" element={<SessionNotes />} />
              <Route path="/nutritionist/progress/:userId" element={<UserProgress />} />
              <Route path="/nutritionist/upload" element={<UploadPlan />} />
              <Route path="/nutritionist/profile" element={<NutritionistProfile />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/stats" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/nutritionists" element={<ApproveNutritionists />} />
              <Route path="/admin/subscriptions" element={<ManageSubscriptions />} />
              <Route path="/admin/inquiries" element={<Inquiries />} />
              <Route path="/admin/system-admins" element={<ManageAdmins />} />
            </Route>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
