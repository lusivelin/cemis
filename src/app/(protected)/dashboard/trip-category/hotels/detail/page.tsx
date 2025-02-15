import HotelCard from '@/components/dashboard/hotel/hotel-card';
import RoomCards from '@/components/dashboard/room/room-cards';
import { RoomsOccupantLimits, RoomsPricing } from '@/server/api/routers/rooms';
import { api } from '@/trpc/server';
import { notFound } from 'next/navigation';

export default async function HotelFormPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const hotelData = await api.hotels.detail.query({ id });

  if (!hotelData) {
    notFound();
  }
  const roomsData = await api.rooms.list
    .query({ hotelId: id })
    .then((res) =>
      res.data.map((room) => ({
        ...room,
        occupantLimits: room.occupantLimits as RoomsOccupantLimits,
        pricing: room.pricing as RoomsPricing,
      }))
    )
    .catch(() => []);

  return (
    <div className="container mx-auto">
      <div className="py-10">
        <HotelCard hotel={hotelData} id={id} />
      </div>
      <RoomCards rooms={roomsData} hotelId={id} />
    </div>
  );
}
