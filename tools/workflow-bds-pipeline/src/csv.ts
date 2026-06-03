/**
 * CSV tối giản hỗ trợ field có dấu phẩy/xuống dòng trong dấu nháy kép.
 * Đủ dùng cho pipeline; có thể thay bằng Google Sheets API ở P2.
 */
export function parseCsv(content: string): Array<Record<string, string>> {
  const rows = tokenizeRows(content);
  if (rows.length === 0) {
    return [];
  }
  const header = rows[0];
  if (!header) {
    return [];
  }
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = cells[idx] ?? '';
    });
    return record;
  });
}

export function toCsv(headers: string[], rows: Array<Record<string, string>>): string {
  const lines = [headers.map(escapeCell).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCell(row[h] ?? '')).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function tokenizeRows(content: string): string[][] {
  const rows: string[][] = [];
  let cells: string[] = [];
  let field = '';
  let inQuotes = false;
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(field);
      field = '';
    } else if (ch === '\n') {
      cells.push(field);
      rows.push(cells);
      cells = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || cells.length > 0) {
    cells.push(field);
    rows.push(cells);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}
