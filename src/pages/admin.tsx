import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth, authFetch } from '@/lib/useAuth';
import {
  Users, ShieldCheck, BarChart3, Activity,
  Search, Trash2, ChevronLeft, ChevronRight, AlertCircle, Crown,
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  bot_mode: string;
  target_acos: number;
  role: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  activeAccounts: number;
  totalCampaigns: number;
  totalActions: number;
}

const CARD: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  borderRadius: '0.875rem',
  boxShadow: 'var(--card-shadow)',
};

export default function AdminPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const af = authFetch(token);

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'' | 'admin' | 'user'>('');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await af('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
  }, [token]);

  const fetchUsers = useCallback(async () => {
    setLoadingData(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await af(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to load users');
      }
    } catch {
      setError('Failed to load users');
    } finally {
      setLoadingData(false);
    }
  }, [token, page, search, roleFilter]);

  useEffect(() => { if (token && user?.role === 'admin') fetchStats(); }, [token, user, fetchStats]);
  useEffect(() => { if (token && user?.role === 'admin') fetchUsers(); }, [token, user, fetchUsers]);

  const toggleRole = async (u: AdminUser) => {
    if (u.id === user?.id) return;
    setActionLoading(u.id);
    try {
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      const res = await af(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update role');
      }
    } catch {
      setError('Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (u: AdminUser) => {
    if (u.id === user?.id) return;
    if (!confirm(`Delete user "${u.email}"? This cannot be undone.`)) return;
    setActionLoading(u.id);
    try {
      const res = await af(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(usr => usr.id !== u.id));
        setTotal(prev => prev - 1);
        fetchStats();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch {
      setError('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'var(--accent)' },
    { label: 'Active Accounts', value: stats?.activeAccounts ?? '—', icon: ShieldCheck, color: 'var(--warning)' },
    { label: 'Total Campaigns', value: stats?.totalCampaigns ?? '—', icon: BarChart3, color: 'var(--success)' },
    { label: 'Actions Logged', value: stats?.totalActions ?? '—', icon: Activity, color: '#a78bfa' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage users and monitor platform activity</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-4" style={CARD}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="p-5" style={CARD}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>User Management</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 flex-1 sm:flex-initial sm:w-56"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search email or name..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="bg-transparent border-none outline-none text-sm w-full"
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value as '' | 'admin' | 'user'); setPage(1); }}
              className="px-3 py-1.5 rounded-lg text-sm outline-none"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-secondary)' }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
            style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-dim)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    {['User', 'Email', 'Role', 'Bot Mode', 'Target ACOS', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left pb-3 font-medium text-xs" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="tr-hover" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: u.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'var(--accent-bg-strong)', border: `1px solid ${u.role === 'admin' ? 'rgba(245,158,11,0.3)' : 'var(--accent-border)'}` }}>
                            {u.role === 'admin' ? <Crown className="w-3 h-3" style={{ color: 'var(--warning)' }} /> : <Users className="w-3 h-3" style={{ color: 'var(--accent)' }} />}
                          </div>
                          <span className="font-medium truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
                            {u.full_name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={u.role === 'admin'
                            ? { background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.25)' }
                            : { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                          }>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 capitalize" style={{ color: 'var(--text-muted)' }}>{u.bot_mode}</td>
                      <td className="py-3" style={{ color: 'var(--text-muted)' }}>{u.target_acos}%</td>
                      <td className="py-3 text-xs" style={{ color: 'var(--text-dim)' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {u.id === user?.id ? (
                          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>You</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleRole(u)}
                              disabled={actionLoading === u.id}
                              className="px-2 py-1 rounded text-xs font-medium transition-all"
                              title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                              style={{
                                background: u.role === 'admin' ? 'var(--accent-bg)' : 'rgba(245,158,11,0.1)',
                                color: u.role === 'admin' ? 'var(--accent)' : 'var(--warning)',
                                border: `1px solid ${u.role === 'admin' ? 'var(--accent-border)' : 'rgba(245,158,11,0.25)'}`,
                                opacity: actionLoading === u.id ? 0.5 : 1,
                              }}
                            >
                              {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                            <button
                              onClick={() => deleteUser(u)}
                              disabled={actionLoading === u.id}
                              className="p-1 rounded transition-all"
                              title="Delete user"
                              style={{ color: 'var(--error)', opacity: actionLoading === u.id ? 0.5 : 1 }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: page === 1 ? 'var(--text-dim)' : 'var(--accent)', background: 'var(--card-bg)' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs px-2" style={{ color: 'var(--text-muted)' }}>
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: page === totalPages ? 'var(--text-dim)' : 'var(--accent)', background: 'var(--card-bg)' }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
