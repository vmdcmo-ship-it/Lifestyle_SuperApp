import { google, type sheets_v4 } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class GoogleSheetsClient {
  private readonly sheets: sheets_v4.Sheets;

  private readonly spreadsheetId: string;

  constructor(serviceAccountJsonPath: string, spreadsheetId: string) {
    const auth = new google.auth.GoogleAuth({ keyFile: serviceAccountJsonPath, scopes: SCOPES });
    this.sheets = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = spreadsheetId;
  }

  /** Đọc 1 tab thành mảng record theo header hàng đầu. */
  async readTab(tabName: string): Promise<Array<Record<string, string>>> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: tabName,
    });
    const values = res.data.values ?? [];
    return valuesToRecords(values);
  }

  /** Ghi đè toàn bộ 1 tab bằng headers + rows (clear trước khi ghi). */
  async overwriteTab(tabName: string, headers: string[], rows: Array<Record<string, string>>): Promise<void> {
    await this.sheets.spreadsheets.values.clear({ spreadsheetId: this.spreadsheetId, range: tabName });
    const matrix = [headers, ...rows.map((row) => headers.map((h) => row[h] ?? ''))];
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: matrix },
    });
  }

  /** Thêm các dòng vào cuối tab (không xóa dữ liệu cũ). */
  async appendRows(tabName: string, headers: string[], rows: Array<Record<string, string>>): Promise<void> {
    if (rows.length === 0) {
      return;
    }
    const matrix = rows.map((row) => headers.map((h) => row[h] ?? ''));
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: matrix },
    });
  }
}

function valuesToRecords(values: string[][]): Array<Record<string, string>> {
  const header = values[0];
  if (!header) {
    return [];
  }
  return values.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = cells[idx] ?? '';
    });
    return record;
  });
}
