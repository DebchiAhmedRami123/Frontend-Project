import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'

// public
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import RegisterUser from '../pages/public/RegisterUser'
import RegisterNutritionist from '../pages/public/RegisterNutritionist'
import Blog from '../pages/public/Blog'
import BlogPost from '../pages/public/BlogPost'
import Contact from '../pages/public/Contact'

// user
import UserDashboard from '../pages/user/Dashboard'
import FoodTracker from '../pages/user/FoodTracker'
import FoodLog from '../pages/user/FoodLog'
import ActivePlan from '../pages/user/ActivePlan'
import BrowsePlans from '../pages/user/BrowsePlans'
import BookConsultation from '../pages/user/BookConsultation'
import UserProfile from '../pages/user/Profile'

// nutritionist
import NutritionistDashboard from '../pages/nutritionist/Dashboard'
import Consultations from '../pages/nutritionist/Consultations'
import UserProgress from '../pages/nutritionist/UserProgress'
import UploadPlan from '../pages/nutritionist/UploadPlan'
import WriteBlogPost from '../pages/nutritionist/WriteBlogPost'
import NutritionistProfile from '../pages/nutritionist/Profile'

// admin
import AdminDashboard from '../pages/admin/Dashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ApproveNutritionists from '../pages/admin/ApproveNutritionists'
import ManageSubscriptions from '../pages/admin/ManageSubscriptions'
import ManageBlog from '../pages/admin/ManageBlog'
import Inquiries from '../pages/admin/Inquiries'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/register/nutritionist" element={<RegisterNutritionist />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── Protected ── */}
        <Route element={<PrivateRoute />}>

          {/* User */}
          <Route element={<RoleRoute role="user" />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/tracker" element={<FoodTracker />} />
            <Route path="/dashboard/log" element={<FoodLog />} />
            <Route path="/dashboard/plan" element={<ActivePlan />} />
            <Route path="/dashboard/browse" element={<BrowsePlans />} />
            <Route path="/dashboard/book" element={<BookConsultation />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />
          </Route>

          {/* Nutritionist */}
          <Route element={<RoleRoute role="nutritionist" />}>
            <Route path="/nutritionist" element={<NutritionistDashboard />} />
            <Route path="/nutritionist/consultations" element={<Consultations />} />
            <Route path="/nutritionist/progress/:userId" element={<UserProgress />} />
            <Route path="/nutritionist/upload" element={<UploadPlan />} />
            <Route path="/nutritionist/blog/new" element={<WriteBlogPost />} />
            <Route path="/nutritionist/profile" element={<NutritionistProfile />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/nutritionists" element={<ApproveNutritionists />} />
            <Route path="/admin/subscriptions" element={<ManageSubscriptions />} />
            <Route path="/admin/blog" element={<ManageBlog />} />
            <Route path="/admin/inquiries" element={<Inquiries />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}