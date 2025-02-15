'use client';
import React from 'react';
import Card from '../card';
import { Button } from '@/lib/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Image from 'next/image';

interface BookSecondPageProps {
  bookingCode?: any;
}

const images: any[] = ['/assets/frontend/dummy1.jpg', '/assets/frontend/dummy2.jpg', '/assets/frontend/dummy3.jpg'];

const BookSecondPage: React.FC<BookSecondPageProps> = ({ bookingCode }) => {
  return (
    <div id="BookSecondPage">
      <div className="wrappers">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image src={image} alt={`Tour Image ${index + 1}`} className="swiper-image" width={500} height={500} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Card>
          <h1 className="tour-subtitle">Code: {bookingCode}</h1>
          <h3 className="tour-title">Diamond Tour</h3>
          <div className="tour-info">
            <div className="info-item">
              <strong>Start Date:</strong> <span>30-Jul-2025</span>
            </div>
            <div className="info-item">
              <strong>Start Time:</strong> <span>12:00 PM</span>
            </div>
            <div className="info-item">
              <strong>End Date:</strong> <span>06-Aug-2025</span>
            </div>
            <div className="info-item">
              <strong>End Time:</strong> <span>06:00 PM</span>
            </div>
          </div>
          <h4 className="accommodation-title">Accommodation</h4>
          <p className="accommodation">Diamond Hotel</p>
          <p className="accommodation">Test 123 (copy)</p>
        </Card>
        <div className="flex justify-center md:justify-end items-center gap-4 py-5">
          <Button variant="outline" className="text-lg text-primary border-primary p-5">
            Start Over
          </Button>
          <Button className="text-lg p-5">Book Now</Button>
        </div>
      </div>
    </div>
  );
};

export default BookSecondPage;
