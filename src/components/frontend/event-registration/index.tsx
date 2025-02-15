'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';
import { useRouter } from 'next/navigation';

const EventRegistration = () => {
  const [eventCode, setEventCode] = useState('');
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventCode(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Event Code:', eventCode);
    router.push(`/frontend/event_registration?code=${eventCode}`);
  };
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[70vh]"
      style={{ backgroundImage: `url('/assets/frontend/mainbg.jpeg')`, backgroundSize: 'cover', width: '100%' }}
    >
      <h1 className="text-4xl text-white font-bold text-center mb-8">Register for an Event</h1>
      <form className="flex flex-col gap-[10px] max-w-[370px] w-full" onSubmit={handleSubmit}>
        <Input
          className="w-full placeholder:text-center text-center h-[60px] py-0 font-medium !text-lg"
          placeholder="Enter Event Code"
          value={eventCode}
          onChange={handleInputChange}
        />
        <Button variant="default" className="h-[60px] w-full font-medium !text-lg hover:!opacity-80/">
          Proceed
        </Button>
      </form>
    </div>
  );
};

export default EventRegistration;
