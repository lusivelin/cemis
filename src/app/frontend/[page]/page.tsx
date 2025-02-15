'use client';

import BookSecondPage from '@/components/frontend/book-second-page';
import React from 'react';

const Page = () => {
  // const searchParams = useSearchParams();
  // const eventCode = searchParams.get('code');
  return (
    <div>
      <BookSecondPage bookingCode="DIAMOND" />
    </div>
  );
};

export default Page;
