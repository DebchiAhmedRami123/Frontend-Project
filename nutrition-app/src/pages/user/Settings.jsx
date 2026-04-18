import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function Settings() {
  const { user, logout, updateToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });

  // Goals State
  const [goalsForm, setGoalsForm] = useState({
    currentWeight: user?.weight || '',
    goal: user?.goal || 'Maintain'
  });

  // Preferences State
  const [preferencesForm, setPreferencesForm] = useState({
    theme: 'Light',
    language: 'English',
    notifications: true
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/auth/update-profile', profileForm);
      setSuccessMsg('Profile updated successfully');
      if (data.token) updateToken(data.token);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating profile');
    }
    setLoading(false);
  };

  const handleGoalsSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/auth/update-goals', goalsForm);
      setSuccessMsg('Goals updated successfully. Target Calories Recalculated!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating goals');
    }
    setLoading(false);
  };

  const handleExportData = async () => {
    try {
      const response = await axiosInstance.get('/auth/export-data', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_data.json');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setErrorMsg('Error exporting data');
    }
  };

  const handleDeleteHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your meal history?')) return;
    try {
      await axiosInstance.delete('/auth/delete-history');
      setSuccessMsg('Meal history cleared successfully');
    } catch (err) {
      setErrorMsg('Error clearing history');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Irreversible action. Delete your account completely?')) return;
    try {
      await axiosInstance.delete('/auth/delete-account');
      await logout();
      navigate('/login');
    } catch (err) {
      setErrorMsg('Error deleting account');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        {successMsg && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMsg}</div>}
        {errorMsg && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{errorMsg}</div>}

        <div className="bg-white shadow rounded-lg flex overflow-hidden">
          <div className="w-1/4 bg-gray-50 flex flex-col p-4 border-r border-gray-200">
            <button onClick={() => { setActiveTab('profile'); clearMessages(); }} className={`p-3 text-left w-full font-medium rounded mb-2 ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>Edit Profile</button>
            <button onClick={() => { setActiveTab('goals'); clearMessages(); }} className={`p-3 text-left w-full font-medium rounded mb-2 ${activeTab === 'goals' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>Update Goals</button>
            <button onClick={() => { setActiveTab('preferences'); clearMessages(); }} className={`p-3 text-left w-full font-medium rounded mb-2 ${activeTab === 'preferences' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>Preferences</button>
            <button onClick={() => { setActiveTab('account'); clearMessages(); }} className={`p-3 text-left w-full text-red-600 font-medium rounded mb-2 ${activeTab === 'account' ? 'bg-red-100' : 'hover:bg-gray-200'}`}>Danger Zone</button>
          </div>
          
          <div className="p-8 w-3/4">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
                <div className="pt-4 border-t mt-4">
                  <h3 className="text-md font-bold mb-2">Change Password</h3>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" name="currentPassword" value={profileForm.currentPassword} onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border mb-2" />
                  
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" name="newPassword" value={profileForm.newPassword} onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded mt-4">Save Profile</button>
              </form>
            )}

            {/* GOALS TAB */}
            {activeTab === 'goals' && (
              <form onSubmit={handleGoalsSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Update Goals</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Weight (kg)</label>
                  <input type="number" value={goalsForm.currentWeight} onChange={(e) => setGoalsForm({...goalsForm, currentWeight: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Goal</label>
                  <select value={goalsForm.goal} onChange={(e) => setGoalsForm({...goalsForm, goal: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                    <option value="Lose">Lose Weight</option>
                    <option value="Maintain">Maintain Weight</option>
                    <option value="Gain">Gain Muscle</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded mt-4">Recalculate Calories & Save</button>
              </form>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Preferences</h2>
                <div className="flex items-center justify-between">
                  <span className="text-md text-gray-700">Theme</span>
                  <select value={preferencesForm.theme} onChange={(e) => setPreferencesForm({...preferencesForm, theme: e.target.value})} className="rounded-md border-gray-300 shadow-sm p-1 border">
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-md text-gray-700">Language</span>
                  <select value={preferencesForm.language} onChange={(e) => setPreferencesForm({...preferencesForm, language: e.target.value})} className="rounded-md border-gray-300 shadow-sm p-1 border">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-md text-gray-700">Push Notifications</span>
                  <input type="checkbox" checked={preferencesForm.notifications} onChange={(e) => setPreferencesForm({...preferencesForm, notifications: e.target.checked})} className="h-4 w-4 bg-blue-600" />
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded mt-4">Save Preferences</button>
              </div>
            )}

            {/* ACCOUNT/DANGER TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6 border-t-4 border-red-500 pt-4">
                <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
                <div>
                  <h3 className="font-bold">Export Data</h3>
                  <p className="text-sm text-gray-600 mb-2">Download all your personal data and meal history in JSON format.</p>
                  <button onClick={handleExportData} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">Export My Data</button>
                </div>
                <div>
                  <h3 className="font-bold">Delete Meal History</h3>
                  <p className="text-sm text-gray-600 mb-2">Delete all logged meals and reset progress stats. This cannot be undone.</p>
                  <button onClick={handleDeleteHistory} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete History</button>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-bold text-red-700">Delete Account</h3>
                  <p className="text-sm text-gray-600 mb-2">Permanently delete your account, subscriptions, profile, and history. This cannot be undone.</p>
                  <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
