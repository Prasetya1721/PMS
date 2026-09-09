import React from 'react';
import { PMSProvider, usePMS } from './context/PMSContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { UrgencyBanner } from './components/layout/UrgencyBanner';
import { FleetOverview } from './components/dashboard/FleetOverview';
import { VesselDashboard } from './components/dashboard/VesselDashboard';
import { VesselList } from './components/vessels/VesselList';
import { EquipmentList } from './components/equipment/EquipmentList';
import { MaintenanceList } from './components/maintenance/MaintenanceList';
import { InventoryList } from './components/sparepart/InventoryList';
import { CostOverview } from './components/cost/CostOverview';
import { CrewManager } from './components/crew/CrewManager';
import { DocumentTracker } from './components/documents/DocumentTracker';
import { NotificationCenter } from './components/notification/NotificationCenter';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

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
  const { activeTab, selectedVesselId, toastMessage } = usePMS();

  const renderContent = () => {
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
      case 'notifications':
        return <NotificationCenter />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return <FleetOverview />;
    }
  };

  return (
    <div className="app-container">
      {/* Maritime Cockpit Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Header />
        <UrgencyBanner />

        <main className="page-body">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>

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
