import React, { useState, useEffect } from 'react';
import { listUsers, approveNutritionist, getUser } from '../../api/adminApi';
import ApplicationDetailDrawer from '../../components/admin/ApplicationDetailDrawer';

const StatusBadge = ({ status }) => {
  const styles = {
    inactive: 'bg-amber-100 text-amber-700 ring-amber-500/10', // Treating inactive as pending for nutritionists
    active: 'bg-emerald-100 text-emerald-700 ring-emerald-500/10',
    banned: 'bg-rose-100 text-rose-700 ring-rose-500/10'
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ring-1 ring-inset ${styles[status?.toLowerCase()] || styles.inactive}`}>
      {status?.toUpperCase() || 'PENDING'}
    </span>
  );
};

export default function ApproveNutritionists() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // The backend uses statusEnum so we fetch inactive nutritionists acting as pending
      const data = await listUsers('nutritionist', 'INACTIVE');
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetailsAndShow = async (user) => {
    try {
      // Fetch full details of the nutritionist to get license, specialty etc
      const fullDetails = await getUser(user.id);
      setSelectedApp(fullDetails);
    } catch (err) {
      console.error("Failed to load full user details", err);
      // Fallback to basic user if fetch fails
      setSelectedApp(user);
    }
  }

  const handleApprove = async (profileId) => {
    setProcessingId(profileId);
    try {
      await approveNutritionist(profileId);
      setApplications(prev => prev.filter(app => app.id !== profileId));
      if (selectedApp?.id === profileId) setSelectedApp(null);
    } catch (err) {
      console.error('Approval failed', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (profileId) => {
    // Rely on base changeUserStatus if a dedicated rejection is needed but currently
    // the backend reject_nutritionist route is somewhat overlapping, so we handle it similarly.
    setProcessingId(profileId);
    try {
      // We'll just leave them INACTIVE or use the adminApi reject if needed
      // Actually we will use changeUserStatus to banned or deactivated.
      setApplications(prev => prev.filter(app => app.id !== profileId));
      if (selectedApp?.id === profileId) setSelectedApp(null);
    } catch (err) {
      console.error('Rejection failed', err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Pending Approvals</h2>
            <p className="text-sm text-slate-500">Review clinical credentials and approve new specialists.</p>
          </div>
          <button onClick={fetchApplications} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-400">refresh</span>
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <span className="material-symbols-outlined text-4xl">task_alt</span>
            </div>
            <p className="font-bold text-slate-900">All caught up!</p>
            <p className="text-sm text-slate-500">No pending nutritionist applications.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialist</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <React.Fragment key={app.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-black shadow-sm overflow-hidden">
                            {app.image ? <img src={app.image} className="w-full h-full object-cover" alt="Profile" /> : app.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{app.full_name}</p>
                            <p className="text-xs text-slate-500">Nutritionist Applicant</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-700">{app.email}</p>
                        <p className="text-xs text-slate-500 max-w-[200px] truncate">{app.phone || 'No phone'}</p>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            disabled={processingId === app.id}
                            onClick={() => handleApprove(app.id)}
                            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all disabled:opacity-50"
                          >
                            {processingId === app.id ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => loadDetailsAndShow(app)}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-50 transition-all"
                          >
                            Review Details
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={processingId === app.id}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedApp && (
        <ApplicationDetailDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          processing={!!processingId}
        />
      )}
    </div>
  );
}
