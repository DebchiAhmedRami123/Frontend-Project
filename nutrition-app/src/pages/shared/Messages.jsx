import React, { useState, useEffect, useRef } from 'react'
import { getConversations, getThread, sendMessage } from '../../api/messageApi'
import useAuth from '../../hooks/useAuth'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeThread, setActiveThread] = useState(null) // partner_id
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const msgEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (activeThread) loadThread(activeThread)
  }, [activeThread])

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      const data = await getConversations()
      setConversations(data)
      // Open first conversation by default on desktop
      if (data.length > 0 && !activeThread) {
        setActiveThread(data[0].partner_id)
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadThread = async (partnerId) => {
    try {
      const data = await getThread(partnerId)
      setMessages(data)
      // Refresh conversations to update unread counts
      const convos = await getConversations()
      setConversations(convos)
    } catch (err) {
      console.error('Failed to load thread:', err)
    }
  }

  const handleSend = async () => {
    if (!newMsg.trim() || !activeThread) return
    setSending(true)
    try {
      await sendMessage({ receiver_id: activeThread, body: newMsg.trim() })
      setNewMsg('')
      await loadThread(activeThread)
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const activePartner = conversations.find(c => c.partner_id === activeThread)

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-6">Messages</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-50 rounded-xl mb-3" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-16 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px] text-slate-300">chat</span>
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">No messages yet</h3>
          <p className="text-sm text-slate-400 font-medium">Start a conversation from a nutritionist's profile page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          
          {/* Sidebar: Conversations List */}
          <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${activeThread ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-600 uppercase tracking-widest">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(convo => (
                <button
                  key={convo.partner_id}
                  onClick={() => setActiveThread(convo.partner_id)}
                  className={`w-full p-4 flex items-center gap-3 text-left transition-colors border-b border-slate-50 ${
                    activeThread === convo.partner_id ? 'bg-teal-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-sm shrink-0 overflow-hidden">
                    {convo.partner_image ? (
                      <img src={convo.partner_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      convo.partner_name?.charAt(0) || '?'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 truncate">{convo.partner_name}</span>
                      {convo.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {convo.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                      {convo.last_message_is_mine ? 'You: ' : ''}{convo.last_message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main: Thread View */}
          <div className={`flex-1 flex flex-col ${!activeThread ? 'hidden md:flex' : 'flex'}`}>
            {activeThread ? (
              <>
                {/* Thread Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                  <button 
                    onClick={() => setActiveThread(null)}
                    className="md:hidden text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xs overflow-hidden">
                    {activePartner?.partner_image ? (
                      <img src={activePartner.partner_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      activePartner?.partner_name?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{activePartner?.partner_name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activePartner?.partner_role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {messages.map(msg => {
                    const isMine = String(msg.sender_id) === String(user?.id)
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm font-medium ${
                          isMine
                            ? 'bg-teal-600 text-white rounded-br-md'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md shadow-sm'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.body}</p>
                          <p className={`text-[10px] mt-1.5 ${isMine ? 'text-teal-200' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={msgEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white">
                  <div className="flex items-end gap-3">
                    <textarea
                      rows="1"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium resize-none focus:ring-2 focus:ring-teal-500/20 focus:outline-none max-h-32"
                      style={{ minHeight: '44px' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !newMsg.trim()}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        newMsg.trim() 
                          ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm' 
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <span className="material-symbols-outlined text-[48px] text-slate-200 mb-4 block">forum</span>
                  <p className="text-sm font-bold text-slate-400">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
