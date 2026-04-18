import React, { useState } from 'react';
import { sendMessage } from '../../api/messageApi';

const AskQuestionModal = ({ isOpen, onClose, nutritionistId, nutritionistName }) => {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await sendMessage({
        receiver_id: nutritionistId,
        subject: `Question from ${formData.name}`,
        body: formData.message,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', message: '' });
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please log in first.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-surface-container/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-3xl border border-surface-container animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-10 animate-in fade-in zoom-in">
            <div className="w-20 h-20 bg-secondary-fixed/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-on-secondary-container">check</span>
            </div>
            <h3 className="font-headline text-2xl font-black mb-2">Message Sent!</h3>
            <p className="text-on-surface-variant font-body">
              {nutritionistName} will get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-headline text-2xl font-black mb-2">Ask a Question</h3>
            <p className="text-on-surface-variant mb-8 font-body">
              Need more details? Send a direct message to <span className="text-secondary font-bold">{nutritionistName}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">
                  Your Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-2xl px-6 py-4 font-body border border-surface-container focus:outline-none focus:border-secondary transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">
                  Message
                </label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-surface-container-low rounded-2xl px-6 py-4 font-body border border-surface-container focus:outline-none focus:border-secondary transition-all resize-none"
                  placeholder="I'm interested in your Sports Nutrition package..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-700 font-bold text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-secondary text-white rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-secondary/20"
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AskQuestionModal;
