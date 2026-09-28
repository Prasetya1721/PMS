import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Framework
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'canvas-confetti'],
          // Domain chunks — dipecah per modul besar
          'chunk-audit':    [
            './src/components/audit/AuditManager',
            './src/components/audit/AuditReportModal',
            './src/components/audit/AuditFindingModal',
            './src/components/audit/AuditSessionModal',
            './src/components/audit/AuditRoleFlowModal',
            './src/components/audit/AuditNotificationModal',
            './src/components/audit/AuditInstitutionHeader',
            './src/components/audit/BkiDocChecklistReport',
            './src/components/audit/BkiShipboardChecklistReport',
            './src/components/audit/DocSessionModal',
            './src/components/audit/SmcSessionModal',
            './src/components/audit/SubmitEvidenceModal',
            './src/data/auditMasterData',
          ],
          'chunk-admin':    [
            './src/components/admin/MasterDataAdmin',
            './src/components/admin/SiteSettingsAdmin',
            './src/components/admin/SidebarManagementAdmin',
            './src/components/admin/DataSyncModal',
            './src/components/admin/ProfileSettingsModal',
          ],
          'chunk-notify':   ['./src/components/notification/NotificationCenter'],
          'chunk-documents':['./src/components/documents/DocumentTracker', './src/components/documents/DocumentFormModal', './src/components/documents/DocumentPreviewModal'],
          'chunk-dashboard':['./src/components/dashboard/VesselDashboard', './src/components/dashboard/FleetOverview'],
          'chunk-ops':      [
            './src/components/maintenance/MaintenanceList',
            './src/components/maintenance/WorkOrderModal',
            './src/components/maintenance/TechnicalWorkOrderModal',
            './src/components/equipment/EquipmentList',
            './src/components/equipment/EquipmentFormModal',
            './src/components/equipment/CriticalEquipmentView',
            './src/components/equipment/DailyMachineryLogModal',
            './src/components/equipment/RunningHoursModal',
            './src/components/sparepart/InventoryList',
          ],
          'chunk-crew':     ['./src/components/crew/CrewManager', './src/components/crew/SafeManningMatrixModal'],
          'chunk-reports':  ['./src/components/reports/ReportGenerator'],
          'chunk-data':     ['./src/data/sampleSeedData'],
        }
      }
    }
  }
});
