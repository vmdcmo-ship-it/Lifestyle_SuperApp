'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { pricingTablesService } from '@/lib/pricing-tables.service';
import { toast } from '@/lib/toast';
import type {
  PricingTable,
  PricingParam,
  DeliveryPricingParam,
  DeliverySizeTier,
} from '@/lib/pricing-tables.service';
import { authService } from '@/lib/auth.service';

const VEHICLE_OPTIONS = [
  { value: 'BIKE', label: 'Xe máy' },
  { value: 'CAR_4_SEATS', label: 'Xe 4 chỗ' },
  { value: 'CAR_7_SEATS', label: 'Xe 7 chỗ' },
  { value: 'TRUCK', label: 'Xe tải' },
];

const VEHICLE_LABELS: Record<string, string> = {
  BIKE: 'Xe máy',
  CAR_4_SEATS: 'Xe 4 chỗ',
  CAR_7_SEATS: 'Xe 7 chỗ',
  TRUCK: 'Xe tải',
};

const SIZE_TIER_OPTIONS: { value: DeliverySizeTier; label: string }[] = [
  { value: 'S', label: 'Size S' },
  { value: 'M', label: 'Size M' },
  { value: 'L', label: 'Size L' },
  { value: 'XL', label: 'Size XL' },
  { value: 'BULKY', label: 'Hàng cồng kềnh' },
];

const SIZE_TIER_LABELS: Record<string, string> = {
  S: 'Size S',
  M: 'Size M',
  L: 'Size L',
  XL: 'Size XL',
  BULKY: 'Hàng cồng kềnh',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
}

export default function PricingTableDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const user = authService.getStoredUser();
  const isCEO = user?.role === 'ADMIN';

  const [table, setTable] = useState<PricingTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingParamId, setTogglingParamId] = useState<string | null>(null);
  const [togglingDeliveryParamId, setTogglingDeliveryParamId] = useState<string | null>(null);
  const [showAddParam, setShowAddParam] = useState(false);
  const [showAddDeliveryParam, setShowAddDeliveryParam] = useState(false);
  const [newDeliveryParam, setNewDeliveryParam] = useState({
    sizeTier: 'M' as DeliverySizeTier,
    baseFee: 15000,
    perKg: 5000,
    cbmDivisor: 6000,
    surgeEnabled: false,
    weatherEnabled: false,
    trafficEnabled: false,
  });
  const [addingDeliveryParam, setAddingDeliveryParam] = useState(false);
  const [newParam, setNewParam] = useState({
    vehicleType: 'BIKE',
    baseFare: 12000,
    perKm: 4200,
    perMin: 300,
    minFare: 12000,
    surgeEnabled: false,
    surgeMax: 2.0,
    weatherEnabled: false,
    trafficEnabled: false,
  });
  const [addingParam, setAddingParam] = useState(false);

  const load = () => {
    if (!id) return;
    pricingTablesService
      .getById(id)
      .then(setTable)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAddParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setAddingParam(true);
    pricingTablesService
      .addParam(id, {
        vehicleType: newParam.vehicleType,
        baseFare: newParam.baseFare,
        perKm: newParam.perKm,
        perMin: newParam.perMin,
        minFare: newParam.minFare,
        factors: {
          surgeEnabled: newParam.surgeEnabled,
          surgeMax: newParam.surgeMax,
          weatherEnabled: newParam.weatherEnabled,
          trafficEnabled: newParam.trafficEnabled,
        },
      })
      .then(() => {
        toast.success('Đã thêm tham số định giá');
        load();
        setShowAddParam(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        toast.error((err as Error).message);
      })
      .finally(() => setAddingParam(false));
  };

  const handleToggle = (
    param: PricingParam,
    key: 'surgeEnabled' | 'weatherEnabled' | 'trafficEnabled',
  ) => {
    if (!id) return;
    const current = param.factors?.[key] ?? false;
    setTogglingParamId(param.id);
    pricingTablesService
      .updateParamToggles(id, param.id, { [key]: !current })
      .then(() => load())
      .catch((err) => setError((err as Error).message))
      .finally(() => setTogglingParamId(null));
  };

  const handleAddDeliveryParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setAddingDeliveryParam(true);
    pricingTablesService
      .addDeliveryParam(id, {
        sizeTier: newDeliveryParam.sizeTier,
        baseFee: newDeliveryParam.baseFee,
        perKg: newDeliveryParam.perKg,
        cbmDivisor: newDeliveryParam.cbmDivisor,
        factors: {
          surgeEnabled: newDeliveryParam.surgeEnabled,
          weatherEnabled: newDeliveryParam.weatherEnabled,
          trafficEnabled: newDeliveryParam.trafficEnabled,
        },
        isActive: true,
      })
      .then(() => {
        toast.success('Đã thêm tham số giao hàng');
        load();
        setShowAddDeliveryParam(false);
      })
      .catch((err) => {
        setError((err as Error).message);
        toast.error((err as Error).message);
      })
      .finally(() => setAddingDeliveryParam(false));
  };

  const handleDeliveryToggle = (
    param: DeliveryPricingParam,
    key: 'surgeEnabled' | 'weatherEnabled' | 'trafficEnabled',
  ) => {
    if (!id) return;
    const current = param.factors?.[key] ?? false;
    setTogglingDeliveryParamId(param.id);
    pricingTablesService
      .updateDeliveryParamToggles(id, param.id, { [key]: !current })
      .then(() => load())
      .catch((err) => setError((err as Error).message))
      .finally(() => setTogglingDeliveryParamId(null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error || !table) {
    return (
      <div>
        <Link href="/pricing" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy bảng giá'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/pricing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>
      <h1 className="mb-6 text-2xl font-bold">{table.name}</h1>

      <div className="space-y-6">
        <section className="rounded-lg border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Thông tin bảng giá</h2>
            {isCEO && (
              <Link
                href={`/pricing/tables/${id}/edit`}
                className="text-sm text-primary hover:underline"
              >
                Chỉnh sửa
              </Link>
            )}
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Mã</dt>
            <dd className="font-mono">{table.code}</dd>
            <dt className="text-muted-foreground">Loại dịch vụ</dt>
            <dd>{table.serviceType === 'TRANSPORT' ? 'Gọi xe' : 'Giao hàng'}</dd>
            <dt className="text-muted-foreground">Vùng áp dụng</dt>
            <dd>{table.regions.map((r) => r.name).join(', ') || '—'}</dd>
            <dt className="text-muted-foreground">Hiệu lực</dt>
            <dd>
              {formatDate(table.effectiveFrom)}
              {table.effectiveTo && ` → ${formatDate(table.effectiveTo)}`}
            </dd>
            <dt className="text-muted-foreground">Trạng thái</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  table.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {table.isActive ? 'Bật' : 'Tắt'}
              </span>
            </dd>
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Tham số định giá</h2>

          {table.serviceType === 'DELIVERY' ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Định giá theo kích thước kiện (S/M/L/XL/Hàng cồng kềnh), trọng lượng (kg) và thể
                tích CBM. Công thức: CBM = (D × R × C) / {6000} (cm³).
              </p>
              {isCEO && (
                <div className="mb-4">
                  {!showAddDeliveryParam ? (
                    <button
                      type="button"
                      onClick={() => setShowAddDeliveryParam(true)}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Thêm tham số kích thước
                    </button>
                  ) : (
                    <form
                      onSubmit={handleAddDeliveryParam}
                      className="space-y-3 rounded border p-4"
                    >
                      <h4 className="font-medium">Thêm tham số định giá giao hàng</h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-xs">Kích thước kiện</label>
                          <select
                            value={newDeliveryParam.sizeTier}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({
                                ...p,
                                sizeTier: e.target.value as DeliverySizeTier,
                              }))
                            }
                            className="w-full rounded border px-2 py-1 text-sm"
                          >
                            {SIZE_TIER_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">Phí cơ bản (đ)</label>
                          <input
                            type="number"
                            value={newDeliveryParam.baseFee}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({ ...p, baseFee: +e.target.value }))
                            }
                            min={0}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">Đơn giá/kg (đ)</label>
                          <input
                            type="number"
                            value={newDeliveryParam.perKg}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({ ...p, perKg: +e.target.value }))
                            }
                            min={0}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">CBM divisor</label>
                          <input
                            type="number"
                            value={newDeliveryParam.cbmDivisor}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({
                                ...p,
                                cbmDivisor: Math.max(100, +e.target.value),
                              }))
                            }
                            min={100}
                            className="w-full rounded border px-2 py-1 text-sm"
                            title="CBM = (D×R×C) / divisor"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newDeliveryParam.surgeEnabled}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({
                                ...p,
                                surgeEnabled: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-sm">Surge</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newDeliveryParam.weatherEnabled}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({
                                ...p,
                                weatherEnabled: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-sm">Thời tiết</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newDeliveryParam.trafficEnabled}
                            onChange={(e) =>
                              setNewDeliveryParam((p) => ({
                                ...p,
                                trafficEnabled: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-sm">Giao thông</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={addingDeliveryParam}
                          className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
                        >
                          {addingDeliveryParam ? 'Đang thêm...' : 'Thêm'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddDeliveryParam(false)}
                          className="rounded border px-3 py-1 text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {(table.deliveryParams?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có tham số kích thước. {isCEO && 'Nhấn Thêm tham số kích thước để tạo.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {(table.deliveryParams ?? []).map((param) => (
                    <div key={param.id} className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">
                        {SIZE_TIER_LABELS[param.sizeTier] ?? param.sizeTier}
                      </h3>
                      {isCEO && (
                        <div className="mb-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                          <div>
                            <span className="text-muted-foreground">Phí cơ bản:</span>{' '}
                            {formatCurrency(param.baseFee)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">/kg:</span>{' '}
                            {formatCurrency(param.perKg)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">CBM divisor:</span>{' '}
                            {param.cbmDivisor}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Surge:</span>
                          <button
                            type="button"
                            disabled={togglingDeliveryParamId !== null}
                            onClick={() => handleDeliveryToggle(param, 'surgeEnabled')}
                            className={`rounded px-2 py-1 text-xs ${
                              param.factors?.surgeEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {param.factors?.surgeEnabled ? 'Bật' : 'Tắt'}
                          </button>
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Thời tiết:</span>
                          <button
                            type="button"
                            disabled={togglingDeliveryParamId !== null}
                            onClick={() => handleDeliveryToggle(param, 'weatherEnabled')}
                            className={`rounded px-2 py-1 text-xs ${
                              param.factors?.weatherEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {param.factors?.weatherEnabled ? 'Bật' : 'Tắt'}
                          </button>
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Giao thông:</span>
                          <button
                            type="button"
                            disabled={togglingDeliveryParamId !== null}
                            onClick={() => handleDeliveryToggle(param, 'trafficEnabled')}
                            className={`rounded px-2 py-1 text-xs ${
                              param.factors?.trafficEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {param.factors?.trafficEnabled ? 'Bật' : 'Tắt'}
                          </button>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {isCEO
                  ? 'Công thức đầy đủ. Chỉ CEO có quyền chỉnh sửa giá trị.'
                  : 'Bạn có thể bật/tắt các công tắc Surge, Thời tiết, Giao thông. Không xem được giá trị công thức.'}
              </p>

              {isCEO && (
                <div className="mb-4">
                  {!showAddParam ? (
                    <button
                      type="button"
                      onClick={() => setShowAddParam(true)}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Thêm tham số
                    </button>
                  ) : (
                    <form onSubmit={handleAddParam} className="space-y-3 rounded border p-4">
                      <h4 className="font-medium">Thêm tham số định giá</h4>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-xs">Loại xe</label>
                          <select
                            value={newParam.vehicleType}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, vehicleType: e.target.value }))
                            }
                            className="w-full rounded border px-2 py-1 text-sm"
                          >
                            {VEHICLE_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">Cước cơ bản</label>
                          <input
                            type="number"
                            value={newParam.baseFare}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, baseFare: +e.target.value }))
                            }
                            min={0}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">Đ/km</label>
                          <input
                            type="number"
                            value={newParam.perKm}
                            onChange={(e) => setNewParam((p) => ({ ...p, perKm: +e.target.value }))}
                            min={0}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">Đ/phút</label>
                          <input
                            type="number"
                            value={newParam.perMin}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, perMin: +e.target.value }))
                            }
                            min={0}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs">Cước tối thiểu</label>
                          <input
                            type="number"
                            value={newParam.minFare}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, minFare: +e.target.value }))
                            }
                            min={0}
                            className="w-full rounded border px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newParam.surgeEnabled}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, surgeEnabled: e.target.checked }))
                            }
                          />
                          <span className="text-sm">Surge</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Surge max:</span>
                          <input
                            type="number"
                            step="0.1"
                            value={newParam.surgeMax}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, surgeMax: +e.target.value }))
                            }
                            className="w-16 rounded border px-1 py-0.5 text-sm"
                          />
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newParam.weatherEnabled}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, weatherEnabled: e.target.checked }))
                            }
                          />
                          <span className="text-sm">Thời tiết</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newParam.trafficEnabled}
                            onChange={(e) =>
                              setNewParam((p) => ({ ...p, trafficEnabled: e.target.checked }))
                            }
                          />
                          <span className="text-sm">Giao thông</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={addingParam}
                          className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
                        >
                          {addingParam ? 'Đang thêm...' : 'Thêm'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddParam(false)}
                          className="rounded border px-3 py-1 text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {table.params.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có tham số. {isCEO && 'Nhấn Thêm tham số để tạo.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {table.params.map((param) => (
                    <div key={param.id} className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">
                        {VEHICLE_LABELS[param.vehicleType] ?? param.vehicleType}
                      </h3>
                      {isCEO && (
                        <div className="mb-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                          <div>
                            <span className="text-muted-foreground">Cước cơ bản:</span>{' '}
                            {formatCurrency(param.baseFare)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">/km:</span>{' '}
                            {formatCurrency(param.perKm)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">/phút:</span>{' '}
                            {formatCurrency(param.perMin)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tối thiểu:</span>{' '}
                            {formatCurrency(param.minFare)}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Surge:</span>
                          <button
                            type="button"
                            disabled={togglingParamId !== null}
                            onClick={() => handleToggle(param, 'surgeEnabled')}
                            className={`rounded px-2 py-1 text-xs ${
                              param.factors?.surgeEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {param.factors?.surgeEnabled ? 'Bật' : 'Tắt'}
                          </button>
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Thời tiết:</span>
                          <button
                            type="button"
                            disabled={togglingParamId !== null}
                            onClick={() => handleToggle(param, 'weatherEnabled')}
                            className={`rounded px-2 py-1 text-xs ${
                              param.factors?.weatherEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {param.factors?.weatherEnabled ? 'Bật' : 'Tắt'}
                          </button>
                        </label>
                        <label className="flex items-center gap-2">
                          <span className="text-sm">Giao thông:</span>
                          <button
                            type="button"
                            disabled={togglingParamId !== null}
                            onClick={() => handleToggle(param, 'trafficEnabled')}
                            className={`rounded px-2 py-1 text-xs ${
                              param.factors?.trafficEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {param.factors?.trafficEnabled ? 'Bật' : 'Tắt'}
                          </button>
                        </label>
                      </div>
                      {isCEO && param.factors && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Hệ số: Surge max={param.factors.surgeMax ?? '—'}, Weather=
                          {param.factors.weatherMultiplier ?? '—'}, Traffic=
                          {param.factors.trafficMultiplier ?? '—'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
