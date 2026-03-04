'use client';

import { useState, useEffect } from 'react';
import { PartnerRegistrationForm } from './PartnerRegistrationForm';
import { PartnerGuideSection } from './PartnerGuideSection';
import type { BusinessGroupId } from '@/lib/config/partner-registration';

interface PartnerRegistrationContentProps {
  defaultGroup?: BusinessGroupId;
  source?: string;
  apiPath?: string;
  appStoreUrl: string;
  googlePlayUrl: string;
}

/** Layout form + hướng dẫn chi tiết, hướng dẫn cập nhật theo nhóm chọn trong form */
export function PartnerRegistrationContent({
  defaultGroup,
  source = 'partner_web',
  apiPath = '/api/partner/seller-registration',
  appStoreUrl,
  googlePlayUrl,
}: PartnerRegistrationContentProps): JSX.Element {
  const [selectedGroup, setSelectedGroup] = useState<BusinessGroupId>(
    defaultGroup || 'SHOPPING_MALL'
  );

  useEffect(() => {
    if (defaultGroup) setSelectedGroup(defaultGroup);
  }, [defaultGroup]);

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-serif text-xl font-medium text-slate-800">
          Form đăng ký
        </h2>
        <PartnerRegistrationForm
          defaultGroup={defaultGroup}
          source={source}
          apiPath={apiPath}
          onBusinessGroupChange={setSelectedGroup}
        />
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl font-medium text-slate-800">
          Hướng dẫn chi tiết
        </h2>
        <PartnerGuideSection
          groupId={selectedGroup}
          appStoreUrl={appStoreUrl}
          googlePlayUrl={googlePlayUrl}
        />
      </section>
    </div>
  );
}
