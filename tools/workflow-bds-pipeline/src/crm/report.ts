import type { CrmLead, CrmReport } from './types.js';

export function buildReport(leads: CrmLead[]): CrmReport {
  const report: CrmReport = {
    total: leads.length,
    byInterest: { hot: 0, warm: 0, cold: 0 },
    byStatus: {},
    byNeed: {},
    hotLeads: [],
  };
  for (const lead of leads) {
    report.byInterest[lead.interestLevel] += 1;
    report.byStatus[lead.status] = (report.byStatus[lead.status] ?? 0) + 1;
    report.byNeed[lead.need] = (report.byNeed[lead.need] ?? 0) + 1;
    if (lead.interestLevel === 'hot') {
      report.hotLeads.push({ phone: lead.phone, name: lead.name, nextAction: lead.nextAction });
    }
  }
  return report;
}

export function renderReport(report: CrmReport): string {
  const lines = [
    '===== BÁO CÁO CRM =====',
    `Tổng Lead: ${report.total}`,
    `Mức quan tâm: hot=${report.byInterest.hot}, warm=${report.byInterest.warm}, cold=${report.byInterest.cold}`,
    `Theo trạng thái: ${formatMap(report.byStatus)}`,
    `Theo nhu cầu: ${formatMap(report.byNeed)}`,
    '',
    `Lead NÓNG cần ưu tiên (${report.hotLeads.length}):`,
    ...report.hotLeads.map((l) => `  - ${l.name || l.phone} (${l.phone}): ${l.nextAction}`),
  ];
  return lines.join('\n');
}

function formatMap(map: Record<string, number>): string {
  const entries = Object.entries(map);
  return entries.length > 0 ? entries.map(([k, v]) => `${k}=${v}`).join(', ') : '-';
}
