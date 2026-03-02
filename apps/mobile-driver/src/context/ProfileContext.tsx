/**
 * ProfileContext — nguồn dữ liệu duy nhất (single source of truth) cho hồ sơ tài xế.
 *
 * Tất cả màn hình (ProfileScreen, AccountInfoScreen, DashboardScreen, UpdateDocumentsScreen…)
 * đều đọc từ đây thay vì tự gọi driverService.getProfile() riêng lẻ.
 *
 * Cách dùng:
 *   const { profile, loading, refreshProfile, updateProfileCache } = useProfile();
 *
 * - refreshProfile()              → gọi API lấy profile mới nhất từ server
 * - updateProfileCache(patch)     → cập nhật lạc quan (instant), không cần chờ API
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { driverService } from '../services/driver.service';
import { useAuth } from './AuthContext';

// ── Kiểu dữ liệu profile đầy đủ dùng chung toàn app ───────────────────────

export interface DriverProfileVehicle {
  id: string;
  is_primary?: boolean;
  front_image?: string;
  back_image?: string;
  left_image?: string;
  right_image?: string;
  plate_closeup_image?: string;
  registration_image?: string;
  insurance_image?: string;
  vehicle_class?: string;
  [key: string]: unknown;
}

export interface DriverProfileIdentity {
  citizenIdFrontImage?: string;
  citizenIdBackImage?: string;
  faceImage?: string;
  driverLicenseImage?: string;
  criminalRecordImage?: string;
  [key: string]: unknown;
}

export interface DriverProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar_url?: string;
  driverNumber?: string;
  status?: string;
  /** Lý do từ chối khi status = INACTIVE */
  rejectionReason?: string;
  rating?: number;
  totalTrips?: number;
  memberSince?: string;
  createdAt?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  identity?: DriverProfileIdentity;
  vehicles?: DriverProfileVehicle[];
  [key: string]: unknown;
}

// ── Context interface ───────────────────────────────────────────────────────

interface ProfileContextValue {
  profile: DriverProfile | null;
  loading: boolean;
  /** Tải lại profile từ API — hiện spinner nếu chưa có data, ẩn nếu đã có. */
  refreshProfile: () => Promise<void>;
  /**
   * Cập nhật lạc quan (optimistic update): cập nhật state ngay lập tức
   * mà không cần chờ API. Dùng sau khi lưu avatar, giấy tờ, v.v.
   */
  updateProfileCache: (patch: Partial<DriverProfile>) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────────────────────

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  // Bắt đầu true để màn hình không hiện nội dung trống trước khi fetch xong
  const [loading, setLoading] = useState(true);
  // Tránh fetch đồng thời khi nhiều màn hình mount cùng lúc
  const fetchingRef = useRef(false);

  const fetchProfile = useCallback(async (silent = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    // Chỉ hiện spinner khi chưa có data (lần đầu load); refresh trong nền không gây flicker
    if (!silent) setLoading(true);
    try {
      const res = await driverService.getProfile();
      const p = (res as any) ?? null;
      if (p) {
        setProfile({
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phoneNumber: p.phoneNumber ?? p.phone,
          // avatar_url nằm ở top level của response (được flatten từ user bởi backend)
          avatar_url: p.avatar_url ?? p.user?.avatar_url,
          driverNumber: p.driverNumber,
          status: p.status,
          rejectionReason: p.rejectionReason ?? p.rejection_reason,
          rating: p.rating != null ? Number(p.rating) : undefined,
          totalTrips: p.totalTrips,
          memberSince: p.memberSince ?? p.createdAt,
          createdAt: p.createdAt,
          vehicleType: p.vehicleType,
          vehiclePlate: p.vehiclePlate,
          identity: p.identity ?? null,
          vehicles: p.vehicles ?? [],
        });
      }
    } catch {
      // Giữ cache cũ nếu API lỗi — không xóa profile
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  // Tự động fetch khi đăng nhập; xóa khi đăng xuất
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile(false);
    } else {
      setProfile(null);
    }
  }, [isLoggedIn, fetchProfile]);

  // refreshProfile: nếu đã có profile thì fetch trong nền (không hiện spinner)
  const refreshProfile = useCallback(async () => {
    await fetchProfile(true);
  }, [fetchProfile]);

  const updateProfileCache = useCallback((patch: Partial<DriverProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : (patch as DriverProfile)));
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile, updateProfileCache }}>
      {children}
    </ProfileContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
