/**
 * Xuất mảng object thành file CSV, tải về trình duyệt
 */
export function exportToCsv(
  data: Record<string, unknown>[],
  filename: string,
  columns: { key: string; header: string }[],
): void {
  if (data.length === 0) return;

  const headerRow = columns.map((c) => escapeCsvCell(c.header)).join(',');
  const rows = data.map((row) =>
    columns.map((c) => escapeCsvCell(String(row[c.key] ?? ''))).join(','),
  );
  const csv = '\uFEFF' + [headerRow, ...rows].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeCsvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
