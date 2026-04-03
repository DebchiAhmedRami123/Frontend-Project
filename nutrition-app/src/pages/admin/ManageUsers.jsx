import React, { useState, useMemo } from 'react'

// ── Mock Data Generation ───────────────────────────────────────────────────────
const generateMockUsers = () => {
  const roles = ["User", "User", "User", "Nutritionist", "Admin"];
  const statuses = ["Active", "Active", "Active", "Inactive"];
  const names = [
    "Rami M.", "Sarah K.", "Amine B.", "Lina M.", "Dr. Khaled", 
    "Dr. Meriem", "Sofia T.", "Alex J.", "Yasmine K.", "Omar M.",
    "Karim S.", "Nour E.", "Tariq A.", "Aisha R.", "Admin Root"
  ];
  
  return Array.from({ length: 15 }).map((_, i) => ({
    id: `u_${i + 1}`,
    name: names[i],
    email: `${names[i].split(" ")[0].toLowerCase()}@example.com`,
    role: roles[i % roles.length],
    assignedNutritionist: roles[i % roles.length] === "User" ? (i % 2 === 0 ? "Dr. Sarah" : "Dr. Khaled") : null,
    joined: `Oct ${20 - i}, 2026`,
    status: statuses[i % statuses.length],
    avatar: names[i].charAt(0)
  }));
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ManageUsers() {
  const [users, setUsers] = useState(generateMockUsers())
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8 // Set to 8 to show pagination explicitly for 15 items

  // Inline Actions State
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [deleteModalUser, setDeleteModalUser] = useState(null)

  // ── Derived State (Filtering & Pagination) ───────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'All' || user.role === roleFilter;
      const matchStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    })
  }, [users, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination if filters change and current page is now empty
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ── Action Handlers ──────────────────────────────────────────────────────────
  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  }

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    setEditingRoleId(null);
  }

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== deleteModalUser.id));
    setDeleteModalUser(null);
  }

  // ── Render Helpers ───────────────────────────────────────────────────────────
  const getRoleBadge = (role) => {
    switch(role) {
      case 'Admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'Nutritionist': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'User': return 'bg-green-100 text-green-800 border-green-200';
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
            <option value="All">All Roles</option>
            <option value="User">User</option>
            <option value="Nutritionist">Nutritionist</option>
            <option value="Admin">Admin</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Nutritionist</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">No users found matching your criteria.</td>
                </tr>
              )}
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 border-transparent transition-colors group">
                  
                  {/* Avatar & Name */}
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner border border-slate-200/50">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm tracking-tight">{user.name}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">Joined {user.joined}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td className="py-3 px-6 text-sm font-medium text-slate-500">{user.email}</td>
                  
                  {/* Role */}
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  
                  {/* Assigned Nutritionist */}
                  <td className="py-3 px-6">
                    {user.assignedNutritionist ? (
                      <span className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        {user.assignedNutritionist}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="py-3 px-6 text-center">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.status}</div>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-3 px-6 text-right relative">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      <button className="text-slate-400 hover:text-teal-600 transition-colors" title="View Profile">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setEditingRoleId(editingRoleId === user.id ? null : user.id)}
                          className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit Role"
                        >
                          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        </button>
                        
                        {/* Inline Role Editing Dropdown */}
                        {editingRoleId === user.id && (
                          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden flex flex-col py-1 animate-fade-in text-left">
                             <button onClick={() => handleRoleChange(user.id, 'User')} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-700 text-left">Set as User</button>
                             <button onClick={() => handleRoleChange(user.id, 'Nutritionist')} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-700 text-left">Set as Nutritionist</button>
                             <button onClick={() => handleRoleChange(user.id, 'Admin')} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-700 border-t border-slate-50 text-left">Set as Admin</button>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setDeleteModalUser(user)}
                        className="text-slate-400 hover:text-red-500 transition-colors" title="Delete User"
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
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
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
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteModalUser(null)}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <span className="material-symbols-outlined text-[32px] text-red-500">warning</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2">Delete User?</h3>
            <p className="text-sm font-medium text-slate-500 mb-8">
              Are you sure you want to permanently remove <span className="font-bold text-slate-800">{deleteModalUser.name}</span> from the platform? This action cannot be undone.
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
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}