'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Users,
  Building2,
  BarChart3,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  XCircle,
  CheckSquare,
  Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Offer, Report } from '@/types';

interface Stats {
  pendingOffers: number;
  pendingReports: number;
  totalGyms: number;
  totalTrainers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    pendingOffers: 0,
    pendingReports: 0,
    totalGyms: 0,
    totalTrainers: 0,
  });
  const [pendingOffers, setPendingOffers] = useState<Offer[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [offersRes, reportsRes, gymsRes, ptsRes] = await Promise.all([
        api.admin.getPendingOffers({ page: 0, size: 5 }),
        api.admin.getPendingReports({ page: 0, size: 5 }),
        api.gyms.getAll({ page: 0, size: 1 }),
        api.ptUsers.getAll(),
      ]);

      if (offersRes.success && offersRes.data) {
        setPendingOffers(offersRes.data.content);
        setStats(prev => ({ ...prev, pendingOffers: offersRes.data!.totalElements }));
      }

      if (reportsRes.success && reportsRes.data) {
        setPendingReports(reportsRes.data.content);
        setStats(prev => ({ ...prev, pendingReports: reportsRes.data!.totalElements }));
      }

      if (gymsRes.success && gymsRes.data) {
        setStats(prev => ({ ...prev, totalGyms: gymsRes.data!.totalElements }));
      }

      if (ptsRes.success && ptsRes.data) {
        setStats(prev => ({ ...prev, totalTrainers: Array.isArray(ptsRes.data) ? ptsRes.data.length : 0 }));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateOffer = async (offerId: number, decision: 'approve' | 'reject') => {
    setActionLoading(`offer-${offerId}`);
    try {
      const result = await api.admin.moderateOffer(offerId, { decision });
      if (result.success) {
        setPendingOffers(prev => prev.filter(o => o.id !== offerId));
        setStats(prev => ({ ...prev, pendingOffers: prev.pendingOffers - 1 }));
      } else {
        alert(result.error || 'Failed to moderate offer');
      }
    } catch (error) {
      console.error('Failed to moderate offer:', error);
      alert('Failed to moderate offer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolveReport = async (reportId: number) => {
    setActionLoading(`report-${reportId}`);
    try {
      const result = await api.admin.resolveReport(reportId);
      if (result.success) {
        setPendingReports(prev => prev.filter(r => r.id !== reportId));
        setStats(prev => ({ ...prev, pendingReports: prev.pendingReports - 1 }));
      } else {
        alert(result.error || 'Failed to resolve report');
      }
    } catch (error) {
      console.error('Failed to resolve report:', error);
      alert('Failed to resolve report');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismissReport = async (reportId: number) => {
    setActionLoading(`report-${reportId}`);
    try {
      const result = await api.admin.dismissReport(reportId);
      if (result.success) {
        setPendingReports(prev => prev.filter(r => r.id !== reportId));
        setStats(prev => ({ ...prev, pendingReports: prev.pendingReports - 1 }));
      } else {
        alert(result.error || 'Failed to dismiss report');
      }
    } catch (error) {
      console.error('Failed to dismiss report:', error);
      alert('Failed to dismiss report');
    } finally {
      setActionLoading(null);
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/4 rounded-full blur-[80px]" />

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                ADMIN <span className="text-gradient">CONTROL CENTER</span>
              </h1>
              <p className="text-gray-400 text-lg">Manage the platform and oversee all operations</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Offers */}
          <div>
            <div className="glass-card rounded-2xl p-6 border border-red-600/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                {stats.pendingOffers > 0 && (
                  <Badge className="bg-red-600/20 text-red-400 border-red-600/30 font-bold">URGENT</Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Offers</p>
                <p className="text-4xl font-black text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.pendingOffers}
                </p>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div>
            <div className="glass-card rounded-2xl p-6 border border-yellow-600/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <Activity className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Reports</p>
                <p className="text-4xl font-black text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.pendingReports}
                </p>
              </div>
            </div>
          </div>

          {/* Total Gyms */}
          <div>
            <div className="glass-card rounded-2xl p-6 border border-green-600/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Gyms</p>
                <p className="text-4xl font-black text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalGyms}
                </p>
              </div>
            </div>
          </div>

          {/* Total Trainers */}
          <div>
            <div className="glass-card rounded-2xl p-6 border border-blue-600/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Trainers</p>
                <p className="text-4xl font-black text-white">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalTrainers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals Section */}
          <div className="glass-card rounded-3xl p-8 border border-primary-600/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-black text-white">PENDING APPROVALS</h2>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
              ) : pendingOffers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No pending offers to review
                </div>
              ) : (
                pendingOffers.map((offer) => (
                  <div key={offer.id} className="glass-card p-4 rounded-xl border border-yellow-600/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-base font-bold text-white mb-1">{offer.title}</p>
                        <p className="text-sm text-gray-400">
                          {offer.offerType === 'GYM_OFFER' ? `Gym: ${offer.gymName || 'Unknown'}` : `Trainer: ${offer.ptUserName || 'Unknown'}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(offer.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModerateOffer(offer.id, 'approve')}
                          disabled={actionLoading === `offer-${offer.id}`}
                          className="w-8 h-8 bg-green-600/20 hover:bg-green-600/40 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          {actionLoading === `offer-${offer.id}` ? (
                            <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                          ) : (
                            <CheckSquare className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleModerateOffer(offer.id, 'reject')}
                          disabled={actionLoading === `offer-${offer.id}`}
                          className="w-8 h-8 bg-red-600/20 hover:bg-red-600/40 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button className="btn-outline w-full mt-6">
              <Eye className="w-4 h-4 mr-2" />
              <span className="font-bold">View All Pending Approvals</span>
            </Button>
          </div>

          {/* Moderation Flags Section */}
          <div className="glass-card rounded-3xl p-8 border border-primary-600/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white">MODERATION FLAGS</h2>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
              ) : pendingReports.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No pending reports to review
                </div>
              ) : (
                pendingReports.map((report) => (
                  <div key={report.id} className="glass-card p-4 rounded-xl border border-red-600/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-base font-bold text-white mb-1">{report.reason}</p>
                        <p className="text-sm text-gray-400">
                          {report.details || 'No additional details'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reported by: {report.reporter?.firstName} {report.reporter?.lastName} • {formatTimeAgo(report.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          disabled={actionLoading === `report-${report.id}`}
                          className="btn-primary px-4 py-2 text-sm font-bold disabled:opacity-50"
                        >
                          {actionLoading === `report-${report.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Resolve'
                          )}
                        </button>
                        <button
                          onClick={() => handleDismissReport(report.id)}
                          disabled={actionLoading === `report-${report.id}`}
                          className="btn-outline px-4 py-2 text-sm font-bold disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button className="btn-outline w-full mt-6">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="font-bold">View All Flags</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="glass-card rounded-3xl p-8 border border-primary-600/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-white">PLATFORM OVERVIEW</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl border border-primary-600/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Gyms</p>
                  <p className="text-2xl font-black text-white">{stats.totalGyms}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl border border-primary-600/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Personal Trainers</p>
                  <p className="text-2xl font-black text-white">{stats.totalTrainers}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl border border-primary-600/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Actions</p>
                  <p className="text-2xl font-black text-white">{stats.pendingOffers + stats.pendingReports}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
