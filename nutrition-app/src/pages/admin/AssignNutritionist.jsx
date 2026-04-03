import React, { useState } from 'react';

const AssignNutritionist = () => {
  // Mock Data
  const [unassignedUsers, setUnassignedUsers] = useState([
    { id: 1, name: 'Karim B.', goal: 'Body Transformation', joined: '2026-03-25' },
    { id: 2, name: 'Amina S.', goal: 'Carb Cycling & Intermittent Fasting', joined: '2026-03-28' },
    { id: 3, name: 'Youssef M.', goal: 'Weight Loss', joined: '2026-04-01' },
    { id: 4, name: 'Sarah L.', goal: 'Muscle Gain', joined: '2026-04-02' },
  ]);

  const [nutritionists, setNutritionists] = useState([
    { id: 101, name: 'Dr. Tariq', specialty: 'Sports Nutrition', currentClients: 8, maxClients: 15 },
    { id: 102, name: 'Dr. Leila', specialty: 'Low Carb Diets', currentClients: 14, maxClients: 15 },
    { id: 103, name: 'Dr. Farid', specialty: 'General Dietetics', currentClients: 5, maxClients: 20 },
  ]);

  const [currentAssignments, setCurrentAssignments] = useState([
    { id: 201, userName: 'Omar D.', nutritionistName: 'Dr. Tariq', assignedDate: '2026-03-10', userId: 99 }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmingAssignment, setConfirmingAssignment] = useState(null);

  // Actions
  const handleInitiateAssignment = (user) => {
    setSelectedUser(user);
    setConfirmingAssignment(null); // Reset confirmation state if switching users
  };

  const handleSelectNutritionist = (nutritionist) => {
    setConfirmingAssignment(nutritionist);
  };

  const cancelConfirmation = () => {
    setConfirmingAssignment(null);
  };

  const confirmAssignment = () => {
    // 1. Add to current assignments
    const newAssignment = {
      id: Date.now(),
      userName: selectedUser.name,
      nutritionistName: confirmingAssignment.name,
      assignedDate: new Date().toISOString().split('T')[0],
      userId: selectedUser.id
    };
    setCurrentAssignments([...currentAssignments, newAssignment]);

    // 2. Remove from unassigned users
    setUnassignedUsers(unassignedUsers.filter(u => u.id !== selectedUser.id));

    // 3. Reset UI selection state
    setSelectedUser(null);
    setConfirmingAssignment(null);
  };

  const handleRemoveAssignment = (assignmentId) => {
    const assignmentToRemove = currentAssignments.find(a => a.id === assignmentId);
    
    // Remove from active assignments table
    setCurrentAssignments(currentAssignments.filter(a => a.id !== assignmentId));
    
    // Push the user back to the unassigned list
    setUnassignedUsers([...unassignedUsers, {
      id: assignmentToRemove.userId,
      name: assignmentToRemove.userName,
      goal: 'Needs Re-evaluation', 
      joined: 'Returned to queue' 
    }]);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full">
      
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Alliance & Assignment</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Connect unassigned users to available nutrition specialists.</p>
      </div>

      {/* Top Section: Side-by-Side Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* LEFT PANEL: Unassigned Users */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-500">person_off</span>
            Unassigned Users
          </h2>
          
          {unassignedUsers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
               <span className="material-symbols-outlined text-4xl text-emerald-400 mb-2">task_alt</span>
               <p className="text-slate-500 font-bold">All users have been successfully assigned.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {unassignedUsers.map(user => (
                <li 
                  key={user.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all ${
                    selectedUser?.id === user.id ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-slate-100 hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  <div className="mb-3 sm:mb-0">
                    <p className="font-bold text-slate-800 text-base">{user.name}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{user.goal}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Joined: {user.joined}</p>
                  </div>
                  <button 
                    onClick={() => handleInitiateAssignment(user)}
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
                      selectedUser?.id === user.id ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700'
                    }`}
                  >
                    Assign <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT PANEL: Assign to Nutritionist */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="material-symbols-outlined text-teal-600">medical_services</span>
             Assign to Nutritionist
          </h2>
          
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
               <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">touch_app</span>
               <p className="text-slate-400 font-bold text-center">Select a user from the left panel<br/>to begin routing.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="mb-6 p-4 bg-teal-50 text-teal-900 rounded-xl font-bold flex items-center shadow-sm border border-teal-100/50">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-full mr-3 animate-pulse"></span>
                Routing: {selectedUser.name}
              </div>

              <ul className="space-y-4 flex-1">
                {nutritionists.map(nutri => (
                  <li key={nutri.id} className="p-5 border border-slate-100 bg-white rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
                    
                    {/* Background Progress Bar for Capacity */}
                    <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                       <div 
                         className={`h-full ${nutri.currentClients >= nutri.maxClients ? 'bg-red-400' : 'bg-teal-400'}`} 
                         style={{ width: `${(nutri.currentClients / nutri.maxClients) * 100}%` }}
                       ></div>
                    </div>

                    {confirmingAssignment?.id === nutri.id ? (
                      /* Confirmation View */
                      <div className="space-y-4 animate-fade-in pb-2">
                        <p className="text-sm font-medium text-slate-700">
                          Transfer <span className="font-bold text-teal-700">{selectedUser.name}</span> to the roster of <span className="font-extrabold bg-slate-100 px-2 py-0.5 rounded text-slate-800">{nutri.name}</span>?
                        </p>
                        <div className="flex gap-3">
                          <button 
                            onClick={cancelConfirmation}
                            className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={confirmAssignment}
                            className="flex-[2] py-2 bg-teal-600 shadow-sm text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-bold flex justify-center items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">verified</span> Confirm Alliance
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Default View */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
                        <div>
                          <p className="font-extrabold text-slate-800 text-base">{nutri.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{nutri.specialty}</p>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mt-3 ${nutri.currentClients >= nutri.maxClients ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                            {nutri.currentClients >= nutri.maxClients ? 'Capacity Reached' : `${nutri.currentClients} / ${nutri.maxClients} Active Clients`}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSelectNutritionist(nutri)}
                          disabled={nutri.currentClients >= nutri.maxClients}
                          className="px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-white hover:border-teal-600 hover:text-teal-700 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Select
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Current Assignments */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
           <span className="material-symbols-outlined text-slate-400">group_add</span>
           Current Assignments Directory
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-4 px-6">User Name</th>
                <th className="py-4 px-6">Nutritionist</th>
                <th className="py-4 px-6">Assigned Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentAssignments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500 font-medium">No active assignments are currently logged in the directory.</td>
                </tr>
              ) : (
                currentAssignments.map(assignment => (
                  <tr key={assignment.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 text-slate-800 font-extrabold text-sm">{assignment.userName}</td>
                    <td className="py-4 px-6 text-slate-600 font-bold text-sm">
                       <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">{assignment.nutritionistName}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-semibold text-xs">{assignment.assignedDate}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="text-slate-400 hover:text-red-600 font-bold transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">link_off</span> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AssignNutritionist;
