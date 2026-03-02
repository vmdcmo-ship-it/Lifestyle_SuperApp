/**
 * Upload ảnh lên API — Tối ưu cho Expo Go.
 *
 * FormData + fetch có lỗi trên Expo Go (Network Error, Unsupported FormDataPart).
 * FileSystem.uploadAsync là cách ổn định nhất.
 */
import * as FileSystem from 'expo-file-system/legacy';
import { BASE_URL, tokenStorage, tryRefreshToken } from './api';

/** Chuẩn hóa URI và copy vào cache nếu cần (tránh lỗi đọc file). */
async function ensureUploadableUri(uri: string): Promise<string> {
  if (!uri) return uri;
  let fileUri = uri;
  if (!uri.startsWith('file://') && !uri.startsWith('content://') && uri.startsWith('/')) {
    fileUri = `file://${uri}`;
  }
  // content:// trên Android thường không upload được — copy sang file://
  if (uri.startsWith('content://')) {
    const cacheDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
    if (cacheDir) {
      const dest = `${cacheDir}upload_${Date.now()}.jpg`;
      try {
        await FileSystem.copyAsync({ from: uri, to: dest });
        return dest;
      } catch (e) {
        if (__DEV__) console.warn('[Upload] copy content:// failed:', e);
        return fileUri; // fallback
      }
    }
  }
  return fileUri;
}

/** Đảm bảo file tồn tại trước khi upload. */
async function ensureFileExists(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri, { size: false });
    if (!info.exists) {
      throw new Error(`File không tồn tại: ${uri?.slice?.(0, 50)}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('không tồn tại')) throw e;
    throw new Error(`Không đọc được file. Thử chụp/chọn ảnh lại.`);
  }
}

/** Parse lỗi từ response. */
function parseError(status: number, body: string): string {
  if (!body) return `HTTP ${status}`;
  try {
    const j = JSON.parse(body);
    return j.message ?? j.error ?? body.slice(0, 300);
  } catch {
    return body.slice(0, 300);
  }
}

/**
 * Upload bằng FileSystem.uploadAsync — ổn định trên Expo Go.
 * Retry 1 lần khi 401 (sau refresh token).
 */
async function upload(
  uri: string,
  endpoint: string,
  fieldName: string,
  fileName: string,
): Promise<{ url: string }> {
  const token = await tokenStorage.getAccess();
  if (!token) {
    throw new Error('SESSION_EXPIRED');
  }

  const url = `${BASE_URL}${endpoint}`;
  const fileUri = await ensureUploadableUri(uri);
  await ensureFileExists(fileUri);

  const doUpload = async (): Promise<{ status: number; body: string }> => {
    const t = await tokenStorage.getAccess();
    if (!t) throw new Error('SESSION_EXPIRED');

    const result = await FileSystem.uploadAsync(url, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName,
      mimeType: 'image/jpeg',
      headers: { Authorization: `Bearer ${t}` },
      parameters: {},
    });
    return { status: result.status, body: result.body };
  };

  let result = await doUpload();

  if (result.status === 401 && (await tryRefreshToken())) {
    result = await doUpload();
  }

  const { status, body } = result;

  if (status === 0) {
    throw new Error(
      '[0] Lỗi mạng: Không kết nối được API. Kiểm tra WiFi/4G và đảm bảo ' + BASE_URL.replace('/api/v1', '') + ' có thể truy cập.',
    );
  }

  if (status >= 200 && status < 300) {
    try {
      const data = JSON.parse(body) as { url?: string };
      if (data?.url) return { url: data.url };
    } catch {
      throw new Error(parseError(status, body));
    }
  }

  const errMsg = `[${status}] ${parseError(status, body)}`;
  if (__DEV__) {
    console.warn('[Upload]', endpoint, 'status:', status, 'body:', body?.slice(0, 300));
  }
  throw new Error(errMsg);
}

export const uploadService = {
  uploadFace: (uri: string) =>
    upload(uri, '/drivers/upload/face', 'file', 'face.jpg'),
  uploadAvatar: (uri: string) =>
    upload(uri, '/drivers/upload/avatar', 'file', 'avatar.jpg'),
  /**
   * Upload ảnh giấy tờ.
   * Truyền documentType để backend OCR xác thực loại giấy tờ (chống gian lận).
   * Nếu sai loại → backend trả 422 → hiện thông báo yêu cầu chụp lại.
   */
  uploadDocument: (uri: string, fileName = 'document.jpg', documentType?: string) => {
    const query = documentType ? `?type=${encodeURIComponent(documentType)}` : '';
    return upload(uri, `/drivers/upload/document${query}`, 'file', fileName);
  },
};
