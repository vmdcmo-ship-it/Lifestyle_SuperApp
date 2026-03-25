'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadGoogleMapsPlaces } from '@/lib/load-google-maps';

export type WorkAddressValue = {
  workAddress: string;
  workPlaceId?: string;
  workLat?: number;
  workLng?: number;
};

type Props = {
  value: WorkAddressValue;
  onChange: (v: WorkAddressValue) => void;
  disabled?: boolean;
};

/** Autocomplete Places khi có `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; không thì ô nhập thường. */
export function WorkAddressField({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [mapsFailed, setMapsFailed] = useState(false);
  const hasKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());

  const bindAutocomplete = useCallback(() => {
    if (!hasKey || mapsFailed) {
      return;
    }
    void loadGoogleMapsPlaces()
      .then(() => {
        if (!inputRef.current) {
          return;
        }
        if (acRef.current) {
          return;
        }
        const ac = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'place_id', 'geometry'],
          types: ['address'],
          componentRestrictions: { country: 'vn' },
        });
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          const loc = place.geometry?.location;
          onChangeRef.current({
            workAddress: place.formatted_address ?? inputRef.current?.value ?? '',
            workPlaceId: place.place_id,
            workLat: loc ? loc.lat() : undefined,
            workLng: loc ? loc.lng() : undefined,
          });
        });
        acRef.current = ac;
      })
      .catch(() => setMapsFailed(true));
  }, [hasKey, mapsFailed]);

  useEffect(() => {
    bindAutocomplete();
    return () => {
      const ac = acRef.current;
      if (ac && typeof google !== 'undefined' && google.maps?.event) {
        google.maps.event.clearInstanceListeners(ac);
      }
      acRef.current = null;
    };
  }, [bindAutocomplete]);

  return (
    <input
      ref={inputRef}
      type="text"
      disabled={disabled}
      autoComplete="street-address"
      placeholder={hasKey && !mapsFailed ? 'Gõ địa chỉ, chọn gợi ý (Google Maps)' : 'Địa chỉ làm việc / nơi thường xuyên có mặt (tuỳ chọn)'}
      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
      value={value.workAddress}
      onChange={(e) => {
        const t = e.target.value;
        onChange({
          workAddress: t,
          workPlaceId: undefined,
          workLat: undefined,
          workLng: undefined,
        });
      }}
    />
  );
}
