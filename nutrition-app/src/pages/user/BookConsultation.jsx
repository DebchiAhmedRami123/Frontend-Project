import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const specialists = [
  { id: 's1', name: 'Dr. Tariq', specialty: 'Sports Nutrition & Muscle Gain', avatar: 'T', color: 'bg-blue-500' },
  { id: 's2', name: 'Dr. Leila', specialty: 'Low Carb Diets & Carb Cycling', avatar: 'L', color: 'bg-rose-500' },
  { id: 's3', name: 'Dr. Farid', specialty: 'General Dietetics & Weight Loss', avatar: 'F', color: 'bg-amber-500' },
];

const goals = [
  'Body Transformation',
  'Fat Loss',
  'Muscle Gain',
  'Intermittent Fasting',
  'Diet Re-evaluation',
];

const timeSlots = ['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

// ── Calendar Helpers ───────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return [...blanks, ...days];
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function BookConsultation() {
  const navigate = useNavigate();
  const today = new Date();

  // State
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const calendarDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);

  const canBook = selectedDay && selectedTime && selectedSpecialist;

  const formattedDate = selectedDay
    ? `${MONTHS[calMonth]} ${selectedDay}, ${calYear}`
    : '';

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleBook = () => {
    if (canBook) setIsBooked(true);
  };

  // ── Success View ─────────────────────────────────────────────────────────────
  if (isBooked) {
    const specialist = specialists.find(s => s.id === selectedSpecialist);
    return (
      <Sidebar>
        <div className="animate-fade-in font-body pb-12">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200/50">
              <span className="material-symbols-outlined text-5xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="text-4xl font-extrabold text-teal-950 tracking-tight mb-4">Consultation Booked!</h1>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-md mx-auto">
              Your session has been confirmed. Here are the details:
            </p>

            <div className="bg-white rounded-3xl shadow-xl shadow-teal-900/5 border border-slate-100 p-8 text-left space-y-5 mb-10">
              <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                <div className={`w-12 h-12 rounded-xl ${specialist?.color || 'bg-teal-500'} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                  {specialist?.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-slate-800">{specialist?.name}</p>
                  <p className="text-xs font-bold text-slate-400">{specialist?.specialty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</span>
                  <span className="text-sm font-extrabold text-slate-800">{formattedDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                  <span className="text-sm font-extrabold text-slate-800">{selectedTime}</span>
                </div>
                {selectedGoal && (
                  <div className="col-span-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Goal</span>
                    <span className="text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg inline-block">{selectedGoal}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-base hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Return to Dashboard
            </button>
          </div>
        </div>
      </Sidebar>
    );
  }

  // ── Main Booking View ────────────────────────────────────────────────────────
  return (
    <Sidebar>
      <div className="animate-fade-in font-body pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Back Button */}
          <div className="mb-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Dashboard
            </button>
          </div>

          {/* Page Header */}
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Book Your Consultation</h1>
            <p className="text-slate-500 font-medium mt-3 text-lg">Select a date, time, and specialist to schedule your 1-on-1 session.</p>
          </header>

          {/* Two-column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ── LEFT COLUMN: Date & Time ── */}
            <div className="space-y-6">
              
              {/* Calendar Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-600">calendar_month</span>
                    {MONTHS[calMonth]} {calYear}
                  </h2>
                  <div className="flex gap-1">
                    <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-slate-500">chevron_left</span>
                    </button>
                    <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-slate-500">chevron_right</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (!day) return <div key={`blank-${i}`} />;
                    const isPast = calYear === today.getFullYear() && calMonth === today.getMonth() && day < today.getDate();
                    const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
                    const isSelected = selectedDay === day;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => !isPast && setSelectedDay(day)}
                        disabled={isPast}
                        className={`
                          w-full aspect-square rounded-xl text-sm font-bold transition-all duration-200 relative
                          ${isPast ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer hover:bg-teal-50'}
                          ${isSelected ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30 hover:bg-teal-700' : ''}
                          ${isToday && !isSelected ? 'ring-2 ring-teal-500/30 text-teal-700 font-extrabold' : ''}
                          ${!isSelected && !isPast && !isToday ? 'text-slate-700' : ''}
                        `}
                      >
                        {day}
                        {isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">schedule</span>
                  Available Time Slots
                </h2>
                
                {!selectedDay ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">touch_app</span>
                    <p className="text-slate-400 font-bold text-sm">Select a date above to see available slots.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 border
                          ${selectedTime === time
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Specialist & Goal ── */}
            <div className="space-y-6">
              
              {/* Specialist Selection */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">medical_services</span>
                  Choose a Specialist
                </h2>
                <div className="space-y-3">
                  {specialists.map(spec => (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedSpecialist(spec.id)}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group
                        ${selectedSpecialist === spec.id
                          ? 'border-teal-500 bg-teal-50/60 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }
                      `}
                    >
                      <div className={`w-12 h-12 rounded-xl ${spec.color} text-white flex items-center justify-center font-black text-lg shadow-md shrink-0`}>
                        {spec.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-800 text-base">{spec.name}</p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">{spec.specialty}</p>
                      </div>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                        ${selectedSpecialist === spec.id
                          ? 'border-teal-600 bg-teal-600'
                          : 'border-slate-300 group-hover:border-slate-400'
                        }
                      `}>
                        {selectedSpecialist === spec.id && (
                          <span className="material-symbols-outlined text-white text-[14px]">check</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Dropdown */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">flag</span>
                  Your Primary Goal
                </h2>
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-400 transition-all"
                >
                  <option value="">Select a goal (optional)</option>
                  {goals.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                <h2 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">edit_note</span>
                  Additional Notes
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the specialist about your dietary restrictions, concerns, or anything specific you'd like to discuss..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:outline-none focus:border-teal-400 transition-all resize-none"
                />
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleBook}
                disabled={!canBook}
                className={`
                  w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-3
                  ${canBook
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/30'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[22px]">event_available</span>
                {canBook ? 'Confirm Booking' : 'Select date, time & specialist to continue'}
              </button>

              {/* Selection Summary */}
              {(selectedDay || selectedTime || selectedSpecialist) && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 animate-fade-in">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Booking Summary</span>
                  <div className="space-y-2">
                    {selectedDay && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-teal-600 text-[16px]">calendar_today</span>
                        <span className="font-bold text-slate-700">{formattedDate}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-teal-600 text-[16px]">schedule</span>
                        <span className="font-bold text-slate-700">{selectedTime}</span>
                      </div>
                    )}
                    {selectedSpecialist && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-teal-600 text-[16px]">person</span>
                        <span className="font-bold text-slate-700">{specialists.find(s => s.id === selectedSpecialist)?.name}</span>
                      </div>
                    )}
                    {selectedGoal && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-teal-600 text-[16px]">flag</span>
                        <span className="font-bold text-slate-700">{selectedGoal}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </Sidebar>
  );
}