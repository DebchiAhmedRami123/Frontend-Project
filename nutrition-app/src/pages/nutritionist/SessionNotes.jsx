import React, { useState, useMemo } from 'react'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const initialNotes = [
  {
    id: "note_5",
    clientId: "cli_001",
    clientName: "Rami M.",
    date: "Oct 27, 2026",
    tag: "Milestone",
    content: "Rami hit his first weight milestone today. Adherence to the carb-cycling protocol is excellent. Advised him to maintain current macros for another two weeks."
  },
  {
    id: "note_4",
    clientId: "cli_003",
    clientName: "Sofia T.",
    date: "Oct 25, 2026",
    tag: "Warning",
    content: "Client reported feeling fatigued during afternoon workouts. We need to look at increasing intra-workout carbs or adjusting the pre-workout meal timing."
  },
  {
    id: "note_3",
    clientId: "cli_002",
    clientName: "Alex J.",
    date: "Oct 24, 2026",
    tag: "General",
    content: "Weekly check-in completed. Maintenance calories seem accurate. Minor adjustments made to weekend meal plans."
  },
  {
    id: "note_2",
    clientId: "cli_001",
    clientName: "Rami M.",
    date: "Oct 15, 2026",
    tag: "Achievement",
    content: "Successfully navigated a vacation week without breaking the fasting window. Great behavioral progress."
  }
];

const mockClients = ["All Clients", "Rami M.", "Alex J.", "Sofia T."];
const mockTags = ["All Tags", "General", "Warning", "Achievement", "Milestone"];

// ── Component ──────────────────────────────────────────────────────────────────
export default function SessionNotes() {
  const [notes, setNotes] = useState(initialNotes)
  const [searchQuery, setSearchQuery] = useState('')
  const [clientFilter, setClientFilter] = useState('All Clients')
  const [tagFilter, setTagFilter] = useState('All Tags')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Modal Form State
  const [newNoteClient, setNewNoteClient] = useState('Rami M.')
  const [newNoteTag, setNewNoteTag] = useState('General')
  const [newNoteContent, setNewNoteContent] = useState('')

  // ── Filter Logic ─────────────────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchClient = clientFilter === 'All Clients' || note.clientName === clientFilter
      const matchTag = tagFilter === 'All Tags' || note.tag === tagFilter

      return matchSearch && matchClient && matchTag
    })
  }, [notes, searchQuery, clientFilter, tagFilter])

  // ── Action Handlers ──────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const handleSaveNote = () => {
    if (!newNoteContent.trim()) return

    const newNote = {
      id: `note_${Date.now()}`,
      clientId: "cli_new",
      clientName: newNoteClient,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tag: newNoteTag,
      content: newNoteContent
    }

    setNotes([newNote, ...notes])
    setIsModalOpen(false)
    setNewNoteContent('')
  }

  // ── UI Helpers ───────────────────────────────────────────────────────────────
  const getTagStyle = (tag) => {
    switch(tag) {
      case 'Warning': return 'bg-red-50 text-red-700 border-red-200'
      case 'Milestone': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Achievement': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default: return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="relative animate-fade-in max-w-5xl mx-auto pb-24">
      
      {/* ── Page Header & Controls ── */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Session Notes</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Note
          </button>
        </div>

        {/* Filter/Search Row */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none placeholder:font-normal"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <select 
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            >
              {mockClients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            >
              {mockTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <div className="relative flex-1 sm:w-40 min-w-[140px]">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">calendar_today</span>
              <input 
                type="text" 
                placeholder="Select Date" 
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Notes Feed ── */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px] text-slate-400">edit_note</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No notes found</h3>
            <p className="text-sm font-medium text-slate-500">Start documenting your client journeys by writing a note.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-teal-600 font-bold hover:underline"
            >
              Write your first note
            </button>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="relative bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <button className="text-lg font-extrabold text-teal-700 hover:text-teal-800 transition-colors tracking-tight">
                    {note.clientName}
                  </button>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${getTagStyle(note.tag)}`}>
                    {note.tag}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-400">{note.date}</span>
              </div>
              
              <div className="pr-4 md:pr-12">
                <p className="text-base text-slate-600 leading-relaxed font-medium">
                  {note.content}
                </p>
              </div>

              {/* Hover Actions */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-teal-600 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(note.id)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 hover:scale-105 transition-all z-40"
      >
        <span className="material-symbols-outlined text-[28px]">edit_square</span>
      </button>

      {/* ── Compose Panel (Modal) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-xl overflow-hidden animate-fade-in flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-800">New Session Note</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Client</label>
                  <select 
                    value={newNoteClient}
                    onChange={(e) => setNewNoteClient(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  >
                    {mockClients.filter(c => c !== "All Clients").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tag</label>
                  <select 
                    value={newNoteTag}
                    onChange={(e) => setNewNoteTag(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                  >
                    {mockTags.filter(t => t !== "All Tags").map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Note Content</label>
                 <textarea 
                   rows="6"
                   value={newNoteContent}
                   onChange={(e) => setNewNoteContent(e.target.value)}
                   placeholder="Write your session notes here..."
                   className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none resize-none placeholder:font-normal"
                 />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                className="px-8 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm rounded-xl transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
