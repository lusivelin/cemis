'use client';

import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <div className="py-4 bg-white wrappers flex flex-row justify-between items-center">
      <Image src="/assets/frontend/logoactx.png" alt="logo" width={224} height={40} />
      <div className="font-bold flex flex-row gap-4">
        <div>FAQ</div>
        <div>Contact</div>
      </div>
    </div>
  );
};

export default Header;
