import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RoleRoute({ role }) {
  const { role: userRole, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return userRole === role ? <Outlet /> : <Navigate to="/login" replace />
}