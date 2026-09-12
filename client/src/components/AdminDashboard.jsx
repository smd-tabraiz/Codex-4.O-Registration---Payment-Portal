import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Download, Search, RefreshCw, Mail, ChevronDown, ChevronUp,
  Lock, Loader2, FileSpreadsheet, ExternalLink, Users, IndianRupee,
  TrendingUp, Clock, CheckCircle2, XCircle, AlertTriangle, Trophy,
  GraduationCap, Building2, Phone, Hash, User, CreditCard, Calendar,
  Activity, ArrowUpRight, Trash2, Pencil, Save, X,
} from 'lucide-react';
import api from '../api/axiosInstance';

const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1Yor_zjBkP5jfk-c4m63ZMXAIwNwIcCLYfIKvjsHQwOA/edit?usp=sharing';

// ── Helpers ────────────────────────────────────────────────────
const statusColor = (s) => {
  if (s === 'paid')    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};

const StatusIcon = ({ status }) => {
  if (status === 'paid')    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
  if (status === 'pending') return <Clock        className="w-3.5 h-3.5 text-amber-600" />;
  return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// ── Main Component ──────────────────────────────────────────────
const AdminDashboard = ({ adminToken, adminSecret, onLogout }) => {
  const [data, setData]               = useState({ stats: null, registrations: [] });
  const [loading, setLoading]         = useState(true);
  const [exporting, setExporting]     = useState(false);
  const [search, setSearch]           = useState('');
  const [statusFilter, setFilter]     = useState([]);
  const [expandedId, setExpanded]     = useState(null);
  const [resendingId, setResending]   = useState(null);
  const [deletingId, setDeletingId]   = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editStatusValue, setEditStatusValue] = useState('');
  const [savingStatusId, setSavingStatusId]   = useState(null);
  const [underConstruction, setUnderConstruction] = useState(false);
  const [togglingConstruction, setTogglingConstruction] = useState(false);
  const [registrationsClosed, setRegistrationsClosed] = useState(false);
  const [togglingClosed, setTogglingClosed]           = useState(false);
  const [registrationFee, setRegistrationFee] = useState(300);
  const [feeInput, setFeeInput]               = useState('300');
  const [savingFee, setSavingFee]             = useState(false);
  const [feeSuccess, setFeeSuccess]           = useState('');
  const [registrationCap, setRegistrationCap] = useState(200);
  const [capInput, setCapInput]               = useState('200');
  const [savingCap, setSavingCap]             = useState(false);
  const [capSuccess, setCapSuccess]           = useState('');
  const [syncingSheets, setSyncingSheets]     = useState(false);
  const [error, setError]             = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const searchRef = useRef(null);

  const getHeaders = () => {
    const token  = adminToken  || localStorage.getItem('codex_admin_token');
    if (token) return { Authorization: `Bearer ${token}` };
    const secret = adminSecret || localStorage.getItem('codex_admin_secret') || 'Shamstabraiz@100251';
    return { 'x-admin-secret': secret };
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/registrations', {
        headers: getHeaders(),
        params: { search: search.trim(), status: statusFilter.join(',') },
      });
      setData(res.data);

      const settingsRes = await api.get('/register/system-settings');
      if (settingsRes.data?.settings) {
        setUnderConstruction(settingsRes.data.settings.underConstruction === true);
        setRegistrationsClosed(settingsRes.data.settings.registrationsClosed === true);
        if (settingsRes.data.settings.registrationFee !== undefined) {
          const feeVal = Number(settingsRes.data.settings.registrationFee);
          setRegistrationFee(feeVal);
          setFeeInput(String(feeVal));
        }
        if (settingsRes.data.settings.registrationCap !== undefined) {
          const capVal = Number(settingsRes.data.settings.registrationCap);
          setRegistrationCap(capVal);
          setCapInput(String(capVal));
        }
      } else if (res.data?.stats) {
        if (res.data.stats.registrationFee !== undefined) {
          const feeVal = Number(res.data.stats.registrationFee);
          setRegistrationFee(feeVal);
          setFeeInput(String(feeVal));
        }
        if (res.data.stats.registrationCap !== undefined) {
          const capVal = Number(res.data.stats.registrationCap);
          setRegistrationCap(capVal);
          setCapInput(String(capVal));
        }
      }

      setLastRefresh(new Date());
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, [adminToken, adminSecret, statusFilter]);

  const handleSearchSubmit = (e) => { e.preventDefault(); fetchAdminData(); };

  const handleExportExcel = async (overrideFilters) => {
    const filters = overrideFilters !== undefined ? overrideFilters : statusFilter;
    setExporting(true);
    try {
      const response = await api.get('/admin/export', {
        headers: getHeaders(),
        params: { status: filters.join(',') },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href  = url;
      const label = filters.length > 0 ? `_${filters.join('-')}` : '_all';
      link.setAttribute('download', `Codex4_Registrations${label}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to generate Excel export.');
    } finally {
      setExporting(false);
    }
  };

  const handleResendEmail = async (regId) => {
    setResending(regId);
    try {
      const res = await api.post(`/admin/resend-email/${regId}`, {}, { headers: getHeaders() });
      alert(res.data.message || 'Confirmation email resent!');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend email.');
    } finally {
      setResending(null);
    }
  };

  const handleDeleteRegistration = async (reg) => {
    const confirmed = window.confirm(
      `⚠️ PERMANENTLY DELETE this registration?\n\nTeam: ${reg.teamName} (${reg.teamId})\nStatus: ${reg.status}\n\nThis cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(reg._id);
    try {
      const res = await api.delete(`/admin/registration/${reg._id}`, { headers: getHeaders() });
      alert(res.data.message || 'Registration deleted.');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete registration.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStatus = (reg) => {
    setEditingStatusId(reg._id);
    setEditStatusValue(reg.status);
  };

  const handleCancelEditStatus = () => {
    setEditingStatusId(null);
    setEditStatusValue('');
  };

  const handleSaveStatus = async (regId) => {
    setSavingStatusId(regId);
    try {
      await api.patch(`/admin/registration-status/${regId}`, { status: editStatusValue }, { headers: getHeaders() });
      setEditingStatusId(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSavingStatusId(null);
    }
  };

  const handleToggleUnderConstruction = async () => {
    setTogglingConstruction(true);
    const newValue = !underConstruction;
    try {
      const res = await api.post('/admin/system-settings', { underConstruction: newValue }, {
        headers: getHeaders(),
      });
      setUnderConstruction(res.data.underConstruction === true);
      alert(`System construction mode is now: ${newValue ? 'ON (Under Construction)' : 'OFF (Live)'}`);
    } catch (err) {
      alert('Failed to toggle construction mode.');
    } finally {
      setTogglingConstruction(false);
    }
  };

  const handleToggleRegistrationsClosed = async () => {
    setTogglingClosed(true);
    const newValue = !registrationsClosed;
    try {
      const res = await api.post('/admin/system-settings', { registrationsClosed: newValue }, {
        headers: getHeaders(),
      });
      setRegistrationsClosed(res.data.registrationsClosed === true);
      alert(`Registration Status is now: ${newValue ? 'CLOSED' : 'OPEN'}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to toggle registration status.');
    } finally {
      setTogglingClosed(false);
    }
  };

  const handleUpdateFee = async (overrideValue) => {
    const targetFee = overrideValue !== undefined ? Number(overrideValue) : Number(feeInput);
    if (isNaN(targetFee) || targetFee < 0) {
      alert('Please enter a valid non-negative number for the registration fee.');
      return;
    }

    setSavingFee(true);
    setFeeSuccess('');
    try {
      const res = await api.post('/admin/system-settings', { registrationFee: targetFee }, {
        headers: getHeaders(),
      });
      const savedFee = res.data.registrationFee !== undefined ? res.data.registrationFee : targetFee;
      setRegistrationFee(savedFee);
      setFeeInput(String(savedFee));
      setFeeSuccess(`Registration fee updated to ₹${savedFee}! This now applies live to all user registrations.`);
      setTimeout(() => setFeeSuccess(''), 5000);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update registration fee.');
    } finally {
      setSavingFee(false);
    }
  };

  const handleUpdateCap = async (overrideValue) => {
    const targetCap = overrideValue !== undefined ? Number(overrideValue) : Number(capInput);
    if (isNaN(targetCap) || targetCap <= 0) {
      alert('Please enter a valid positive number for team registration capacity.');
      return;
    }

    setSavingCap(true);
    setCapSuccess('');
    try {
      const res = await api.post('/admin/system-settings', { registrationCap: targetCap }, {
        headers: getHeaders(),
      });
      const savedCap = res.data.registrationCap !== undefined ? res.data.registrationCap : targetCap;
      setRegistrationCap(savedCap);
      setCapInput(String(savedCap));
      setCapSuccess(`Team capacity cap updated to ${savedCap} teams!`);
      setTimeout(() => setCapSuccess(''), 5000);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update registration capacity.');
    } finally {
      setSavingCap(false);
    }
  };

  const handleSyncGoogleSheets = async () => {
    setSyncingSheets(true);
    try {
      const res = await api.post('/admin/sync-sheets', {}, { headers: getHeaders() });
      alert(res.data.message || 'Google Sheet synchronized successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to sync Google Sheet.');
    } finally {
      setSyncingSheets(false);
    }
  };

  const { stats, registrations } = data;
  const fillPct   = stats ? Math.min((stats.paidTeamsCount / stats.registrationCap) * 100, 100) : 0;
  const spotsLeft = stats ? stats.registrationCap - stats.paidTeamsCount : 0;
  const STATUS_OPTIONS = ['paid', 'pending', 'failed'];

  const toggleFilter = (s) => {
    setFilter(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── TOP HEADER BAR ────────────────────────────── */}
      <div className="bg-[#0F172A] text-white rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">
                Codex 4.0 · Coders' Club GPREC
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <Activity className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1] mt-0.5 font-normal">
              {lastRefresh ? `Last refreshed: ${lastRefresh.toLocaleTimeString('en-IN')}` : 'Loading...'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleToggleUnderConstruction}
            disabled={togglingConstruction}
            className={`px-3.5 py-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50 ${
              underConstruction
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Site Under Construction Mode"
          >
            {togglingConstruction ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className={`w-4 h-4 ${underConstruction ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            )}
            <span>Under Construction: {underConstruction ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleToggleRegistrationsClosed}
            disabled={togglingClosed}
            className={`px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 ${
              registrationsClosed
                ? 'bg-rose-500/30 text-rose-200 border-rose-400/50 hover:bg-rose-500/40 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Registration Open/Closed Status"
          >
            {togglingClosed ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className={`w-4 h-4 ${registrationsClosed ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            )}
            <span>Registrations: {registrationsClosed ? 'CLOSED' : 'OPEN'}</span>
          </button>

          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-300" />
            Open Sheet
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handleSyncGoogleSheets}
            disabled={syncingSheets}
            className="px-3 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Force re-sync all registrations directly to Google Sheet"
          >
            {syncingSheets ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync Sheet
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="px-3.5 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-400/40 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export .xlsx
          </button>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          {error}
        </div>
      )}

      {/* ── REGISTRATION FEE CONFIGURATION PANEL ──────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Event Registration Fee Control</h2>
                <p className="text-xs text-[#64748B]">
                  Change the registration fee anytime. Updated fee immediately reflects on user registration pages and Cashfree checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Current Active Fee Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
            <span className="text-xs text-slate-500 font-medium">Active Fee:</span>
            <span className="text-sm font-extrabold text-emerald-600 font-mono">₹{registrationFee} INR</span>
          </div>
        </div>

        {/* Input & Action Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Enter Amount (₹):</span>
            <div className="relative rounded-lg shadow-xs max-w-[140px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                ₹
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                placeholder="300"
                className="block w-full pl-7 pr-3 py-1.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={() => handleUpdateFee()}
              disabled={savingFee || !feeInput}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            >
              {savingFee ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Apply</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
            {[200, 250, 300, 350, 400, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setFeeInput(String(preset));
                  handleUpdateFee(preset);
                }}
                disabled={savingFee}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                  registrationFee === preset
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Success Feedback */}
        {feeSuccess && (
          <div className="mt-3 flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feeSuccess}</span>
          </div>
        )}
      </div>

      {/* ── REGISTRATION CAPACITY CONFIGURATION PANEL ─────────── */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Event Team Capacity Control</h2>
                <p className="text-xs text-[#64748B]">
                  Set the total registration limit (maximum teams allowed). Controls live spot counters and registration cap.
                </p>
              </div>
            </div>
          </div>

          {/* Current Active Cap Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
            <span className="text-xs text-slate-500 font-medium">Active Capacity:</span>
            <span className="text-sm font-extrabold text-blue-600 font-mono">{registrationCap} Teams</span>
          </div>
        </div>

        {/* Input & Action Controls */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 shrink-0">Enter Capacity:</span>
            <div className="relative rounded-lg shadow-xs max-w-[140px]">
              <input
                type="number"
                min="1"
                step="1"
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
                placeholder="200"
                className="block w-full px-3 py-1.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => handleUpdateCap()}
              disabled={savingCap || !capInput}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
            >
              {savingCap ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Apply</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
            {[50, 100, 150, 200, 250, 300, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setCapInput(String(preset));
                  handleUpdateCap(preset);
                }}
                disabled={savingCap}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                  registrationCap === preset
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {preset} Teams
              </button>
            ))}
          </div>
        </div>

        {/* Success Feedback */}
        {capSuccess && (
          <div className="mt-3 flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-semibold animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{capSuccess}</span>
          </div>
        )}
      </div>

      {/* ── STAT CARDS ────────────────────────────────── */}
      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Teams Registered */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Teams Registered</span>
                <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB]"><Trophy className="w-4 h-4" /></div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0F172A]">{stats.paidTeamsCount}</span>
                <span className="text-[#64748B] text-sm font-medium">/ {stats.registrationCap}</span>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-medium text-[#64748B] mb-1">
                  <span>{fillPct.toFixed(0)}% filled</span>
                  <span className={spotsLeft <= 5 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>{spotsLeft} spots left</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${spotsLeft <= 10 ? 'bg-rose-500' : 'bg-[#2563EB]'}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Revenue Collected</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><IndianRupee className="w-4 h-4" /></div>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-emerald-700">
                  ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-normal">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ₹{registrationFee} per team · {stats.paidTeamsCount} teams paid
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Total Participants</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Users className="w-4 h-4" /></div>
              </div>
              <span className="text-3xl font-extrabold text-purple-700">{stats.totalParticipants}</span>
              <div className="text-xs text-[#64748B] font-normal">Across all paid teams</div>
            </div>

            {/* Year-wise */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Year-wise Split</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><GraduationCap className="w-4 h-4" /></div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {['1st','2nd','3rd','4th'].map((yr) => (
                  <div key={yr} className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                    <div className="text-[10px] text-[#64748B] font-semibold mb-1">{yr}</div>
                    <div className={`font-extrabold text-base ${yr === '4th' ? 'text-amber-700' : 'text-[#0F172A]'}`}>
                      {stats.yearBreakdown?.[yr] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PIPELINE ROW ────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Paid',    count: registrations.filter(r=>r.status==='paid').length,    color: 'text-emerald-700', bg: 'border-emerald-200 bg-emerald-50/50', icon: CheckCircle2 },
              { label: 'Pending', count: registrations.filter(r=>r.status==='pending').length, color: 'text-amber-700',   bg: 'border-amber-200  bg-amber-50/50',  icon: Clock },
              { label: 'Failed',  count: registrations.filter(r=>r.status==='failed').length,  color: 'text-rose-700',    bg: 'border-rose-200   bg-rose-50/50',   icon: XCircle },
            ].map(({ label, count, color, bg, icon: Icon }) => (
              <div key={label} className={`bg-white p-4 rounded-xl border ${bg} shadow-card flex items-center gap-4`}>
                <Icon className={`w-7 h-7 ${color}`} />
                <div>
                  <div className={`text-2xl font-extrabold ${color}`}>{count}</div>
                  <div className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">{label} Registrations</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── FILTER + SEARCH ───────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search team, roll, email, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all shadow-xs"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* ALL option */}
          <button
            onClick={() => setFilter([])}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              statusFilter.length === 0
                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border-[#CBD5E1]'
            }`}
          >
            All
          </button>

          {/* Multi-select filter chips */}
          {STATUS_OPTIONS.map((f) => {
            const isSelected = statusFilter.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? f === 'paid'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : f === 'pending'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-[#64748B] hover:text-[#0F172A] border-[#CBD5E1]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // Handled by button onClick
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 cursor-pointer pointer-events-none"
                />
                {f}
              </button>
            );
          })}

          {/* Contextual Download Excel button based on active filters */}
          <button
            onClick={() => handleExportExcel()}
            disabled={exporting}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 ml-1"
            title="Download Excel spreadsheet matching the selected filters"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download Excel {statusFilter.length > 0 ? `(${statusFilter.join(', ')})` : '(All)'}
          </button>
        </div>
      </div>

      {/* ── REGISTRATIONS TABLE ───────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-card">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2 flex-wrap">
            <Users className="w-4 h-4 text-[#64748B]" />
            <span className="text-sm font-bold text-[#0F172A]">
              {registrations.length} Registration{registrations.length !== 1 ? 's' : ''}
            </span>
            {statusFilter.length > 0 ? (
              statusFilter.map((sf) => (
                <span key={sf} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${statusColor(sf)}`}>
                  {sf}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200 bg-slate-100 text-slate-600 uppercase">
                ALL
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium hidden sm:block">
            Click any row to expand member details
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center flex flex-col items-center gap-3 text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
            <span className="text-sm font-medium">Loading registrations...</span>
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-16 text-center text-[#64748B] flex flex-col items-center gap-2">
            <Users className="w-10 h-10 text-slate-300" />
            <p className="font-semibold text-[#0F172A]">No registrations found</p>
            <p className="text-xs">Try changing the filter or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold uppercase tracking-wider text-[10px] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-5 py-3.5">Team</th>
                  <th className="px-5 py-3.5">Leader</th>
                  <th className="px-5 py-3.5 text-center">Members</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Paid On</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {registrations.map((reg) => {
                  const leader     = reg.members?.find((m) => m.isLeader) || reg.members?.[0];
                  const isExpanded = expandedId === reg._id;

                  return (
                    <React.Fragment key={reg._id}>
                      <tr
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''}`}
                        onClick={() => setExpanded(isExpanded ? null : reg._id)}
                      >
                        {/* Team */}
                        <td className="px-5 py-4">
                          <div className="font-mono font-bold text-[#2563EB] text-xs">{reg.teamId}</div>
                          <div className="font-bold text-[#0F172A] text-sm mt-0.5">{reg.teamName}</div>
                        </td>

                        {/* Leader */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#0F172A]">{leader?.name}</div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">{leader?.email}</div>
                          <div className="text-[11px] text-[#64748B] font-mono">{leader?.rollNo}</div>
                        </td>

                        {/* Member count */}
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-[#0F172A] font-bold text-sm border border-[#E2E8F0]">
                            {reg.members?.length || 0}
                          </span>
                        </td>

                        {/* Status — click pencil to edit */}
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          {editingStatusId === reg._id ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={editStatusValue}
                                onChange={(e) => setEditStatusValue(e.target.value)}
                                className="bg-white border border-[#2563EB] text-[#0F172A] text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                              >
                                <option value="paid">paid</option>
                                <option value="pending">pending</option>
                                <option value="failed">failed</option>
                              </select>
                              <button
                                onClick={() => handleSaveStatus(reg._id)}
                                disabled={savingStatusId === reg._id}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all disabled:opacity-40"
                                title="Save status"
                              >
                                {savingStatusId === reg._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={handleCancelEditStatus}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#64748B] border border-[#CBD5E1] transition-all"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase border ${statusColor(reg.status)}`}>
                                <StatusIcon status={reg.status} />
                                {reg.status}
                              </span>
                              <button
                                onClick={() => handleEditStatus(reg)}
                                className="p-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-[#64748B] hover:text-[#2563EB] border border-[#CBD5E1] transition-all"
                                title="Edit status"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          <div className="font-mono text-[11px] text-[#64748B] max-w-[120px] truncate" title={reg.paymentDetails?.cfPaymentId || reg.paymentDetails?.razorpayPaymentId}>
                            {reg.paymentDetails?.cfPaymentId || reg.paymentDetails?.razorpayPaymentId || <span className="text-[#94A3B8] italic">N/A</span>}
                          </div>
                          {reg.paymentDetails?.amount > 0 && (
                            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">₹{reg.paymentDetails.amount}</div>
                          )}
                        </td>

                        {/* Paid On — date + time */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-0.5 text-[11px] text-[#64748B]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 shrink-0 text-[#64748B]" />
                              <span>{formatDateTime(reg.paymentDetails?.paidAt)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Actions — email, expand, delete */}
                        <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {reg.status === 'paid' && (
                              <button
                                onClick={() => handleResendEmail(reg._id)}
                                disabled={resendingId === reg._id}
                                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 transition-all disabled:opacity-40"
                                title="Resend Confirmation Email"
                              >
                                {resendingId === reg._id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Mail className="w-3.5 h-3.5" />}
                              </button>
                            )}
                            <button
                              onClick={() => setExpanded(isExpanded ? null : reg._id)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F172A] border border-[#CBD5E1] transition-all"
                              title="Toggle Details"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteRegistration(reg)}
                              disabled={deletingId === reg._id}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all disabled:opacity-40"
                              title="Delete Registration"
                            >
                              {deletingId === reg._id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── EXPANDED MEMBER PANEL ─────────────── */}
                      {isExpanded && (
                        <tr className="bg-[#F8FAFC]">
                          <td colSpan={7} className="px-5 py-5 border-t border-[#E2E8F0]">
                            <div className="space-y-4">
                              {/* Panel header */}
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                                  <Users className="w-3.5 h-3.5" />
                                  {reg.teamName} — {reg.teamId}
                                </h5>
                                {reg.status === 'paid' && (reg.paymentDetails?.cfPaymentId || reg.paymentDetails?.razorpayPaymentId) && (
                                  <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="font-mono">{reg.paymentDetails.cfPaymentId || reg.paymentDetails.razorpayPaymentId}</span>
                                  </div>
                                )}
                              </div>

                              {/* Member cards */}
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {reg.members?.map((m, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                                      m.isLeader
                                        ? 'bg-blue-50/70 border-blue-200'
                                        : 'bg-white border-[#E2E8F0]'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="font-bold text-[#0F172A] text-sm">{m.name}</div>
                                      {m.isLeader && (
                                        <span className="text-[9px] font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                          Leader
                                        </span>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-[#64748B]">
                                      <div className="flex items-center gap-1.5 col-span-2 font-mono text-[11px] break-all text-[#0F172A]">
                                        <User className="w-3 h-3 shrink-0 text-[#64748B]" />
                                        {m.email}
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Hash className="w-3 h-3 text-[#64748B]" />
                                        <span className="font-mono text-[#0F172A]">{m.rollNo || '—'}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Phone className="w-3 h-3 text-[#64748B]" />
                                        <span>{m.mobile || '—'}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <GraduationCap className="w-3 h-3 text-[#64748B]" />
                                        <span>{m.year} Year</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Building2 className="w-3 h-3 text-[#64748B]" />
                                        <span>{m.branch}</span>
                                      </div>
                                    </div>
                                    <div className="text-[10px] text-[#64748B] border-t border-[#E2E8F0] pt-1.5">
                                      {m.college || 'GPREC'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && registrations.length > 0 && (
          <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[11px] text-[#64748B] font-medium">
            <span>Showing {registrations.length} record{registrations.length !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1.5">
              <ArrowUpRight className="w-3 h-3" />
              Codex 4.0 · Sept 24, 2026 · GPREC
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
