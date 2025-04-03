'use client';

import { ICONS } from '@/resource/constant';
import { Icon } from '@iconify-icon/react';

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary">
      <Icon width={70} className="text-primary" icon={ICONS.loading} />
    </main>
  );
}
