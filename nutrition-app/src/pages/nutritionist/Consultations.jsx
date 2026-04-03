import React, { useState } from 'react'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const initialConsultations = {
  pending: [
    { id: 1, client: "Omar Meziane", goal: "Maintenance", requestedAt: "Apr 1, 2026", message: "Struggling with late night eating" },
    { id: 2, client: "Karim Saadi", goal: "Muscle Gain", requestedAt: "Apr 2, 2026", message: "Need help with post-workout nutrition" }
  ],
  scheduled: [
    { id: 3, client: "Ahmed Benali", scheduledAt: "Apr 8, 2026 15:00", zoomLink: "https://zoom.us/j/example" }
  ],
  completed: [
    { id: 4, client: "Yasmine Kaci", completedAt: "Mar 28, 2026", notePreview: "Discussed increasing protein at breakfast..." }
  ]
}

export default function Consultations() {
  const [activeTab, setActiveTab] = useState('pending')
  const [data, setData] = useState(initialConsultations)
  
  // State to track which pending card is actively expanding its scheduler form
  const [expandedCardId, setExpandedCardId] = useState(null)
  const [scheduleData, setScheduleData] = useState({ datetime: '', zoomLink: '' })

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleAcceptClick = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id)
  }

  const handleConfirmSchedule = (pendingItem) => {
    if (!scheduleData.datetime || !scheduleData.zoomLink) return alert('Please enter date and zoom link')

    // Move from pending to scheduled
    const newPending = data.pending.filter(item => item.id !== pendingItem.id)
    const newScheduledItem = {
      id: pendingItem.id,
      client: pendingItem.client,
      scheduledAt: scheduleData.datetime.replace('T', ' '),
      zoomLink: scheduleData.zoomLink
    }

    setData({
      ...data,
      pending: newPending,
      scheduled: [...data.scheduled, newScheduledItem]
    })
    
    setExpandedCardId(null)
    setScheduleData({ datetime: '', zoomLink: '' })
    setActiveTab('scheduled') // Immediately flip them to scheduled tab to see result
  }

  const handleMarkCompleted = (scheduledItem) => {
    // Move from scheduled to completed
    const newScheduled = data.scheduled.filter(item => item.id !== scheduledItem.id)
    const newCompletedItem = {
      id: scheduledItem.id,
      client: scheduledItem.client,
      completedAt: "Today",
      notePreview: "Awaiting final session notes..."
    }

    setData({
      ...data,
      scheduled: newScheduled,
      completed: [newCompletedItem, ...data.completed]
    })
  }

  const handleDecline = (id) => {
    setData({
      ...data,
      pending: data.pending.filter(item => item.id !== id)
    })
  }

  // ── Render Helpers ───────────────────────────────────────────────────────────
  const renderTabs = () => {
    const tabs = [
      { id: 'pending', label: `Pending (${data.pending.length})` },
      { id: 'scheduled', label: `Scheduled (${data.scheduled.length})` },
      { id: 'completed', label: `Completed (${data.completed.length})` }
    ]

    return (
      <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpandedCardId(null) }}
            className={`pb-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-teal-600 text-teal-700' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Consultations</h1>
      {renderTabs()}

      {/* ── Pending View ── */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {data.pending.length === 0 && <p className="text-slate-500 font-medium py-10 text-center">No pending requests.</p>}
          
          {data.pending.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row gap-6 transition-all">
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{item.client}</h3>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {item.goal}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-auto md:ml-0">
                    Requested: {item.requestedAt}
                  </span>
                </div>
                <div className="bg-slate-50 border-l-4 border-slate-200 p-4 rounded-r-xl mt-4">
                  <p className="text-sm font-medium text-slate-600 italic">"{item.message}"</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-center gap-3 md:w-48">
                {expandedCardId !== item.id && (
                  <>
                    <button 
                      onClick={() => handleAcceptClick(item.id)}
                      className="w-full text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 py-2.5 px-4 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2"
                    >
                      Accept & Schedule <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                    <button 
                      onClick={() => handleDecline(item.id)}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Decline request
                    </button>
                  </>
                )}
              </div>

              {/* Inline Expansion Form */}
              {expandedCardId === item.id && (
                <div className="w-full md:w-72 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3 animate-fade-in shadow-inner">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={scheduleData.datetime}
                    onChange={(e) => setScheduleData({...scheduleData, datetime: e.target.value})}
                    className="w-full text-sm border border-slate-200 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                  
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Zoom Link</label>
                  <input 
                    type="url" 
                    placeholder="https://zoom.us/j/..."
                    value={scheduleData.zoomLink}
                    onChange={(e) => setScheduleData({...scheduleData, zoomLink: e.target.value})}
                    className="w-full text-sm border border-slate-200 bg-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  />
                  
                  <div className="flex items-center gap-2 mt-2">
                     <button 
                        onClick={() => setExpandedCardId(null)}
                        className="flex-1 py-2 text-xs font-bold text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                        onClick={() => handleConfirmSchedule(item)}
                        className="flex-[2] py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
                     >
                       Confirm Session
                     </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Scheduled View ── */}
      {activeTab === 'scheduled' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.scheduled.length === 0 && <p className="text-slate-500 font-medium py-10 md:col-span-2 text-center">No upcoming sessions.</p>}
          
          {data.scheduled.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
               <div className="flex items-start justify-between mb-6">
                 <div>
                   <h3 className="text-xl font-extrabold text-slate-800">{item.client}</h3>
                   <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md mt-2 border border-emerald-100">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                     Confirmed
                   </span>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Scheduled for</p>
                   <p className="text-lg font-black text-teal-700">{item.scheduledAt}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                  <a 
                    href={item.zoomLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-bold rounded-xl flex justify-center items-center gap-2 transition-colors border border-blue-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span> Join Zoom
                  </a>
                  <button 
                     onClick={() => handleMarkCompleted(item)}
                     className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-colors border border-slate-200"
                  >
                    Mark as Completed
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Completed View ── */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {data.completed.length === 0 && <p className="text-slate-500 font-medium py-10 text-center">No past sessions.</p>}
          
          {data.completed.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl opacity-80 shadow-sm border border-slate-100 p-6 flex items-center justify-between hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                   <span className="material-symbols-outlined text-[24px]">verified</span>
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-slate-800">{item.client}</h3>
                   <p className="text-xs font-semibold text-slate-400 mt-0.5">Completed {item.completedAt}</p>
                 </div>
              </div>
              
              <div className="flex-1 max-w-sm mx-auto hidden md:block px-6">
                <p className="text-xs text-slate-500 italic truncate bg-slate-50 py-2 px-4 rounded-lg border border-slate-100">
                  {item.notePreview}
                </p>
              </div>

              <button className="text-sm font-bold text-teal-600 hover:underline">
                View Full Notes
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}