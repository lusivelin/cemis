'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/lib/components/ui/collapsible';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { ChevronDown, ChevronUp, Users, Bed, DollarSign, X } from 'lucide-react';
import { RoomsDetailOutput, RoomsCreateInput } from '@/server/api/routers/rooms';
import RoomForm from '@/components/dashboard/room/create-form';

interface RoomCardsProps {
  rooms: RoomsDetailOutput[];
  hotelId: string;
}

export default function RoomCards({ rooms, hotelId }: RoomCardsProps) {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditClick = (roomId: string) => {
    setEditingRoom(roomId);
    setOpenItems((prev) => ({
      ...prev,
      [roomId]: false,
    }));
  };

  const handleCancelEdit = () => {
    setEditingRoom(null);
  };

  const formatPrice = (price: number | bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        if (editingRoom === room.id) {
          return (
            <Card key={room.id} className="w-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Edit Room</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RoomForm
                  initialData={room as RoomsCreateInput}
                  id={room.id}
                  hotelId={hotelId}
                  onSuccess={() => setEditingRoom(null)}
                />
              </CardContent>
            </Card>
          );
        }

        return (
          <Card key={room.id} className="w-full">
            <Collapsible open={openItems[room.id]} onOpenChange={() => toggleItem(room.id)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
                    <CardDescription className="mt-1">{room.description || 'No description available'}</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {openItems[room.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Sleeps {room.sleeps}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Bed className="h-3 w-3" />
                    {room.bedConfiguration || 'Standard'}
                  </Badge>
                  {room.extraBedAllowed && <Badge variant="outline">Extra Bed Available</Badge>}
                </div>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="pt-4">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Occupancy Limits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Adults:</span> {room.occupantLimits.adult.min} -{' '}
                          {room.occupantLimits.adult.max}
                        </div>
                        <div>
                          <span className="font-medium">Children (with bed):</span>{' '}
                          {room.occupantLimits.childWithBed.min} - {room.occupantLimits.childWithBed.max}
                        </div>
                        <div>
                          <span className="font-medium">Children (no bed):</span>{' '}
                          {room.occupantLimits.childWithoutBed.min} - {room.occupantLimits.childWithoutBed.max}
                        </div>
                        <div>
                          <span className="font-medium">Infants:</span> {room.occupantLimits.infant.min} -{' '}
                          {room.occupantLimits.infant.max}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Pricing</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">Adult:</span>{' '}
                          {formatPrice(room.pricing.adult.normalOnlinePrice)}
                        </div>
                        <div>
                          <span className="font-medium">Child (with bed):</span>{' '}
                          {formatPrice(room.pricing.childWithBed.normalOnlinePrice)}
                        </div>
                        <div>
                          <span className="font-medium">Child (no bed):</span>{' '}
                          {formatPrice(room.pricing.childWithoutBed.normalOnlinePrice)}
                        </div>
                        <div>
                          <span className="font-medium">Infant:</span>{' '}
                          {formatPrice(room.pricing.infant.normalOnlinePrice)}
                        </div>
                      </div>
                    </div>

                    {room.specialArrangement && (
                      <div className="mt-2">
                        <Badge variant="destructive">Special Arrangement Required</Badge>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditClick(room.id)}
                        className="flex items-center gap-2"
                      >
                        Edit Room
                      </Button>
                      <Button variant="destructive" className="flex items-center gap-2">
                        Delete Room
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}
