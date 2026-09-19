/**
 * Maritime ISM Code Audit Time Range Utilities
 * PT. Pelayaran Baharimas Kalimantan
 */

/**
 * Format date string (YYYY-MM-DD) into Indonesian readable format
 * e.g. "2026-08-15" -> "15 Agt 2026"
 */
export const formatIndoDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parts[0];
      return `${day} ${months[monthIdx] || ''} ${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

/**
 * Calculate detailed time range and metrics for an audit finding (NC Open or NC Close)
 */
export const calculateNCRange = (finding, refDate = new Date()) => {
  if (!finding) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const now = new Date(refDate);
  // Strip time for clean day comparison
  now.setHours(0, 0, 0, 0);

  const openDate = finding.dateIdentified ? new Date(finding.dateIdentified) : new Date(now);
  openDate.setHours(0, 0, 0, 0);

  const dueDate = finding.dueDate ? new Date(finding.dueDate) : new Date(openDate.getTime() + 30 * msPerDay);
  dueDate.setHours(0, 0, 0, 0);

  const closedDateStr = finding.evidence?.closedDate || (finding.status === 'NC Close' ? finding.evidence?.submissionDate : null);
  const closedDate = closedDateStr ? new Date(closedDateStr) : null;
  if (closedDate) closedDate.setHours(0, 0, 0, 0);

  const isClosed = finding.status === 'NC Close';
  const isSubmitted = finding.status === 'Eviden Submitted';
  const isOpen = finding.status === 'NC Open';

  // Total allocated duration from identified to due date
  const totalAllocatedDays = Math.max(1, Math.round((dueDate - openDate) / msPerDay));

  if (isClosed) {
    const end = closedDate || now;
    const resolutionDays = Math.max(1, Math.round((end - openDate) / msPerDay));
    const isAheadOfSchedule = end <= dueDate;
    const varianceDays = Math.round(Math.abs((dueDate - end) / msPerDay));

    let varianceText = '';
    if (isAheadOfSchedule) {
      varianceText = varianceDays === 0 ? 'Tepat pada batas waktu' : `${varianceDays} hari lebih cepat dari target`;
    } else {
      varianceText = `Terlambat ${varianceDays} hari dari target awal`;
    }

    return {
      status: 'NC Close',
      isClosed: true,
      isOpen: false,
      isSubmitted: false,
      openDateStr: formatIndoDate(finding.dateIdentified),
      dueDateStr: formatIndoDate(finding.dueDate),
      closedDateStr: formatIndoDate(closedDateStr || finding.dueDate),
      resolutionDays,
      totalAllocatedDays,
      isAheadOfSchedule,
      varianceDays,
      varianceText,
      percentUsed: 100,
      badgeText: `✓ Tuntas ${resolutionDays} Hari`,
      badgeClass: 'badge-success',
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      timelineSummary: `Rentang Penutupan: ${formatIndoDate(finding.dateIdentified)} s/d ${formatIndoDate(closedDateStr || finding.dueDate)} (${resolutionDays} Hari) • ${varianceText}`
    };
  } else {
    // NC Open or Eviden Submitted
    const activeDays = Math.max(0, Math.round((now - openDate) / msPerDay));
    const remainingDays = Math.round((dueDate - now) / msPerDay);
    const isOverdue = remainingDays < 0;

    let percentUsed = 0;
    if (totalAllocatedDays > 0) {
      percentUsed = Math.min(100, Math.max(0, Math.round((activeDays / totalAllocatedDays) * 100)));
      if (isOverdue) percentUsed = 100;
    }

    let urgencyLevel = 'normal'; // 'normal' | 'due-soon' | 'overdue'
    let badgeText = '';
    let badgeClass = 'badge-info';
    let color = '#0284c7';
    let bgLight = 'rgba(2, 132, 199, 0.12)';
    let borderColor = 'rgba(2, 132, 199, 0.35)';

    if (isOverdue) {
      urgencyLevel = 'overdue';
      const lateDays = Math.abs(remainingDays);
      badgeText = `🚨 Terlambat ${lateDays} Hari!`;
      badgeClass = 'badge-danger-pulse';
      color = '#ef4444';
      bgLight = 'rgba(239, 68, 68, 0.15)';
      borderColor = 'rgba(239, 68, 68, 0.45)';
    } else if (remainingDays === 0) {
      urgencyLevel = 'due-soon';
      badgeText = `⚠️ Batas Hari Ini!`;
      badgeClass = 'badge-danger';
      color = '#ef4444';
      bgLight = 'rgba(239, 68, 68, 0.15)';
      borderColor = 'rgba(239, 68, 68, 0.4)';
    } else if (remainingDays <= 7) {
      urgencyLevel = 'due-soon';
      badgeText = `⏳ Sisa ${remainingDays} Hari`;
      badgeClass = 'badge-warning';
      color = '#f59e0b';
      bgLight = 'rgba(245, 158, 11, 0.15)';
      borderColor = 'rgba(245, 158, 11, 0.4)';
    } else {
      urgencyLevel = 'normal';
      badgeText = `⏳ Sisa ${remainingDays} Hari`;
      badgeClass = isSubmitted ? 'badge-warning' : 'badge-info';
      color = isSubmitted ? '#f59e0b' : '#0284c7';
      bgLight = isSubmitted ? 'rgba(245, 158, 11, 0.12)' : 'rgba(2, 132, 199, 0.12)';
      borderColor = isSubmitted ? 'rgba(245, 158, 11, 0.35)' : 'rgba(2, 132, 199, 0.35)';
    }

    const stateLabel = isSubmitted ? 'Eviden Sedang Ditinjau' : 'NC Terbuka (Open)';

    return {
      status: finding.status,
      isClosed: false,
      isOpen,
      isSubmitted,
      openDateStr: formatIndoDate(finding.dateIdentified),
      dueDateStr: formatIndoDate(finding.dueDate),
      activeDays,
      remainingDays,
      isOverdue,
      urgencyLevel,
      totalAllocatedDays,
      percentUsed,
      badgeText,
      badgeClass,
      color,
      bgLight,
      borderColor,
      stateLabel,
      timelineSummary: isOverdue
        ? `🚨 Melewati Batas Waktu! Telah terbuka ${activeDays} hari sejak ${formatIndoDate(finding.dateIdentified)} (Target Close: ${formatIndoDate(finding.dueDate)})`
        : `Rentang Waktu: ${formatIndoDate(finding.dateIdentified)} s/d ${formatIndoDate(finding.dueDate)} • Berjalan ${activeDays} hari, sisa ${remainingDays} hari lagi`
    };
  }
};

/**
 * Calculate aggregate time stats for a list of findings (e.g. for a vessel)
 */
export const calculateFleetTargetTimeStats = (findings = []) => {
  const openFindings = findings.filter(f => f.status === 'NC Open' || f.status === 'Eviden Submitted');
  const closedFindings = findings.filter(f => f.status === 'NC Close');

  let mostUrgent = null;
  let minDaysLeft = Infinity;
  let overdueCount = 0;

  openFindings.forEach(f => {
    const range = calculateNCRange(f);
    if (range) {
      if (range.isOverdue) overdueCount++;
      if (range.remainingDays < minDaysLeft) {
        minDaysLeft = range.remainingDays;
        mostUrgent = { finding: f, range };
      }
    }
  });

  // Calculate average resolution time for closed findings
  let totalClosedDays = 0;
  closedFindings.forEach(f => {
    const range = calculateNCRange(f);
    if (range?.resolutionDays) {
      totalClosedDays += range.resolutionDays;
    }
  });

  const avgResolutionDays = closedFindings.length > 0 ? Math.round(totalClosedDays / closedFindings.length) : 0;

  return {
    openCount: openFindings.length,
    closedCount: closedFindings.length,
    overdueCount,
    mostUrgent,
    minDaysLeft: minDaysLeft === Infinity ? null : minDaysLeft,
    avgResolutionDays
  };
};
