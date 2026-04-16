import React, { useState, useEffect, useMemo } from 'react'
import { listUsers, changeUserStatus } from '../../api/adminApi'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Inline Actions State
  const [deleteModalUser, setDeleteModalUser] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, statusFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // The backend uses user_type and status parameters
      const data = await listUsers(roleFilter || null, statusFilter || null)
      setUsers(data)
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Derived State (Filtering & Pagination) ───────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const nameMatch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return nameMatch || emailMatch;
    })
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ── Action Handlers ──────────────────────────────────────────────────────────
  const toggleStatus = async (user) => {
    setProcessingId(user.id)
    const newStatus = user.status.toLowerCase() === 'active' ? 'inactive' : 'active'
    try {
      await changeUserStatus(user.id, newStatus, 'Status toggled from admin dashboard')
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
    } catch (err) {
      console.error('Failed to change status', err)
    } finally {
      setProcessingId(null)
    }
  }

  const confirmDelete = async () => {
    setProcessingId(deleteModalUser.id)
    try {
      // The backend maps DELETE /users/<id> to a soft-delete (inactive)
      // but there is also a BAN option. We'll use the changeUserStatus to set to 'inactive' directly
      await changeUserStatus(deleteModalUser.id, 'inactive', 'Deleted by admin via dashboard')
      setUsers(users.map(u => u.id === deleteModalUser.id ? { ...u, status: 'inactive' } : u))
      setDeleteModalUser(null);
    } catch (err) {
      console.error('Failed to delete user', err)
    } finally {
      setProcessingId(null)
    }
  }

  // ── Render Helpers ───────────────────────────────────────────────────────────
  const getRoleBadge = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'nutritionist': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'patient': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ── Page Header & Control Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Directory of all registered platform accounts.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search by name or email" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none shadow-sm"
          >
            <option value="">All Roles</option>
            <option value="patient">Patient</option>
            <option value="nutritionist">Nutritionist</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
           </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">No users found matching your criteria.</td>
                    </tr>
                  )}
                  {currentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 border-transparent transition-colors group">
                      
                      {/* Avatar & Name */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner border border-slate-200/50 overflow-hidden">
                            {user.image ? <img src={user.image} alt={user.full_name} className="w-full h-full object-cover" /> : (user.full_name?.charAt(0) || '?')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm tracking-tight">{user.full_name || 'Anonymous User'}</div>
                            <div className="text-xs font-semibold text-slate-400 mt-0.5">Joined {new Date(user.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Email */}
                      <td className="py-3 px-6 text-sm font-medium text-slate-500">{user.email}</td>
                      
                      {/* Role */}
                      <td className="py-3 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md border ${getRoleBadge(user.user_type)}`}>
                          {user.user_type}
                        </span>
                      </td>
                      
                      {/* Status Toggle */}
                      <td className="py-3 px-6 text-center">
                        <button 
                          disabled={processingId === user.id}
                          onClick={() => toggleStatus(user)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${user.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.status?.toLowerCase() === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.status}</div>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-3 px-6 text-right relative">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-slate-400 hover:text-teal-600 transition-colors" title="View Profile">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          
                          <button 
                            disabled={processingId === user.id || user.status?.toLowerCase() === 'inactive'}
                            onClick={() => setDeleteModalUser(user)}
                            className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:hover:text-slate-400" title="Deactivate User"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
  
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    
            {/* ── Pagination Footer ── */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
              <p className="text-xs font-semibold text-slate-500">
                Showing <span className="font-bold text-slate-800">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-slate-800">{filteredUsers.length}</span> results
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteModalUser(null)}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <span className="material-symbols-outlined text-[32px] text-red-500">warning</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Deactivate User?</h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              Are you sure you want to deactivate <span className="font-bold text-slate-800">{deleteModalUser.full_name || deleteModalUser.email}</span>'s account?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalUser(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={processingId === deleteModalUser.id}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {processingId === deleteModalUser.id ? 'Processing...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}