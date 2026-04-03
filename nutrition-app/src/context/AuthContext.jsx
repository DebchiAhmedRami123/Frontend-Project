import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedRole = localStorage.getItem('role')
    const storedToken = localStorage.getItem('access_token')
    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
    setLoading(false)
  }, [])

  const login = (userData, userRole, token) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('role', userRole)
    localStorage.setItem('access_token', token)
    setUser(userData)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}