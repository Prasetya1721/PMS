import React, { lazy, Suspense } from 'react';
import { PMSProvider, usePMS } from './context/PMSContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { UrgencyBanner } from './components/layout/UrgencyBanner';
import { SubscriptionRunningBanner } from './components/subscription/SubscriptionRunningBanner';
import { SubscriptionLockOverlay } from './components/subscription/SubscriptionLockOverlay';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { CheckCircle, AlertTriangle, Info, ShieldAlert, Loader2 } from 'lucide-react';
import { hasAccessWithOverrides, ROLE_DEFINITIONS } from './utils/rbac';

// Lazy-loaded modules — hanya didownload saat pertama kali dibuka
const FleetOverview          = lazy(() => import('./components/dashboard/FleetOverview').then(m => ({ default: m.FleetOverview })));
const VesselDashboard        = lazy(() => import('./components/dashboard/VesselDashboard').then(m => ({ default: m.VesselDashboard })));
const VesselList             = lazy(() => import('./components/vessels/VesselList').then(m => ({ default: m.VesselList })));
const EquipmentList          = lazy(() => import('./components/equipment/EquipmentList').then(m => ({ default: m.EquipmentList })));
const MaintenanceList        = lazy(() => import('./components/maintenance/MaintenanceList').then(m => ({ default: m.MaintenanceList })));
const InventoryList          = lazy(() => import('./components/sparepart/InventoryList').then(m => ({ default: m.InventoryList })));
const CostOverview           = lazy(() => import('./components/cost/CostOverview').then(m => ({ default: m.CostOverview })));
const CrewManager            = lazy(() => import('./components/crew/CrewManager').then(m => ({ default: m.CrewManager })));
const DocumentTracker        = lazy(() => import('./components/documents/DocumentTracker').then(m => ({ default: m.DocumentTracker })));
const NotificationCenter     = lazy(() => import('./components/notification/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const ReportGenerator        = lazy(() => import('./components/reports/ReportGenerator').then(m => ({ default: m.ReportGenerator })));
const MasterDataAdmin        = lazy(() => import('./components/admin/MasterDataAdmin').then(m => ({ default: m.MasterDataAdmin })));
const SiteSettingsAdmin      = lazy(() => import('./components/admin/SiteSettingsAdmin').then(m => ({ default: m.SiteSettingsAdmin })));
const SidebarManagementAdmin = lazy(() => import('./components/admin/SidebarManagementAdmin').then(m => ({ default: m.SidebarManagementAdmin })));
const DeveloperApiKeyAdmin    = lazy(() => import('./components/developer/DeveloperApiKeyAdmin').then(m => ({ default: m.DeveloperApiKeyAdmin })));
const AuditManager           = lazy(() => import('./components/audit/AuditManager').then(m => ({ default: m.AuditManager })));

// Spinner saat modul sedang didownload
const ModuleLoader = () => (
  <div style={{
    minHeight: '40vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '0.75rem',
    color: 'var(--text-muted)'
  }}>
    <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
    <span style={{ fontSize: '0.85rem' }}>Memuat modul...</span>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PMS Cockpit Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '520px', textAlign: 'center', padding: '2rem' }}>
            <AlertTriangle size={44} color="#f87171" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>
              Terjadi Kendala Memuat Modul Ini
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {this.state.error?.message || 'Sistem menemukan ketidaksesuaian data pada modul.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn btn-primary"
              style={{ marginTop: '1.25rem' }}
            >
              Segarkan Tampilan (Reload)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { activeTab, setActiveTab, currentRole, selectedVesselId, toastMessage, sidebarOverrides,
          confirmQueue, resolveConfirm } = usePMS();

  const renderContent = () => {
    // Role-based Module Access Guard (with sidebar overrides)
    if (!hasAccessWithOverrides(currentRole, activeTab, sidebarOverrides)) {
      const roleDef = ROLE_DEFINITIONS[currentRole] || {};
      return (
        <div style={{
          minHeight: '55vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '540px', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#f87171'
            }}>
              <ShieldAlert size={36} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171', marginBottom: '0.5rem' }}>
              Akses Modul Dibatasi Sesuai Peran
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Peran aktif Anda sebagai <strong style={{ color: roleDef.color || '#38bdf8' }}>{roleDef.label || currentRole}</strong> tidak memiliki otorisasi untuk mengakses modul ini (<span className="mono">{activeTab}</span>).
            </p>
            <div style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                Cakupan Otoritas Peran:
              </span>
              {roleDef.description || 'Hubungi Super Admin atau Fleet Manager untuk penyesuaian hak akses operasional.'}
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem' }}
            >
              Kembali ke Dashboard Utama
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return selectedVesselId === 'all' ? <FleetOverview /> : <VesselDashboard />;
      case 'fleet':
        return <VesselList />;
      case 'equipment':
        return <EquipmentList />;
      case 'maintenance':
        return <MaintenanceList />;
      case 'spareparts':
        return <InventoryList />;
      case 'costs':
        return <CostOverview />;
      case 'crew':
        return <CrewManager />;
      case 'documents':
        return <DocumentTracker />;
      case 'audit':
        return <AuditManager />;
      case 'audit_smc':
        return <AuditManager initialStandard="SMC" />;
      case 'audit_doc':
        return <AuditManager initialStandard="DOC" />;
      case 'notifications':
        return <NotificationCenter />;
      case 'reports':
        return <ReportGenerator />;
      case 'master':
        return <MasterDataAdmin />;
      case 'settings':
        return <SiteSettingsAdmin />;
      case 'sidebar_management':
        return <SidebarManagementAdmin />;
      case 'developer_api':
        return <DeveloperApiKeyAdmin />;
      default:
        return <FleetOverview />;
    }
  };

  return (
    <div className="app-container">
      {/* Maritime Cockpit Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <ErrorBoundary>
        <div className="main-content">
          <SubscriptionRunningBanner />
          <Header />
          <UrgencyBanner />

          <main className="page-body">
            <Suspense fallback={<ModuleLoader />}>
              {renderContent()}
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>

      {/* Subscription Lock Overlay (jika lisensi expired & dikunci) */}
      <SubscriptionLockOverlay />

      {/* Thumb-friendly Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Dialog konfirmasi in-app — pengganti window.confirm(). Hanya yang paling
          depan dirender; sisanya menunggu, jadi tidak ada dua dialog bertumpuk. */}
      <ConfirmDialog
        request={confirmQueue && confirmQueue.length > 0 ? confirmQueue[0] : null}
        onResolve={(value) => resolveConfirm(confirmQueue[0].id, value)}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          background: toastMessage.type === 'success' ? '#065f46' : toastMessage.type === 'warning' ? '#78350f' : '#1e293b',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 2000,
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toastMessage.type === 'success' && <CheckCircle size={18} color="#34d399" />}
          {toastMessage.type === 'warning' && <AlertTriangle size={18} color="#fbbf24" />}
          {toastMessage.type === 'info' && <Info size={18} color="#38bdf8" />}
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
};

// Root Router guarding authentication
const AppRoot = () => {
  const { currentUser } = usePMS();

  if (!currentUser) {
    return <LoginPage />;
  }

  return <AppContent />;
};

export default function App() {
  return (
    <PMSProvider>
      <AppRoot />
    </PMSProvider>
  );
}
