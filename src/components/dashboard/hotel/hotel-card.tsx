'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/lib/components/ui/collapsible';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { ChevronDown, ChevronUp, MapPin, Building2, Globe, Currency, X } from 'lucide-react';
import { HotelsDetailOutput } from '@/server/api/routers/hotels';
import HotelForm from '@/components/dashboard/hotel/create-form';

interface HotelCardProps {
  hotel: HotelsDetailOutput;
  id?: string;
}

export default function HotelCard({ hotel, id }: HotelCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Edit Hotel</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <HotelForm initialData={hotel} id={id} onSuccess={() => setIsEditing(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">{hotel.name}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {hotel.address}
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={hotel.active ? 'default' : 'secondary'} className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {hotel.active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {hotel.city}, {hotel.country}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Currency className="h-3 w-3" />
              {hotel.currencyCode}
            </Badge>
            {hotel.assigned && <Badge variant="outline">Assigned</Badge>}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Age Ranges</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Adult:</span> {hotel.adultAgeRange.join(' - ')} years
                  </div>
                  <div>
                    <span className="font-medium">Child with Bed:</span> {hotel.childWithBedAgeRange.join(' - ')} years
                  </div>
                  <div>
                    <span className="font-medium">Child without Bed:</span> {hotel.childWithoutBedAgeRange.join(' - ')}{' '}
                    years
                  </div>
                  <div>
                    <span className="font-medium">Infant:</span> {hotel.infantAgeRange.join(' - ')} years
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Occupancy Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Maximum Adults:</span> {hotel.maxAdult}
                  </div>
                  <div>
                    <span className="font-medium">Maximum Adult Extra Bed:</span> {hotel.maxAdultExtraBed}
                  </div>
                  <div>
                    <span className="font-medium">Child with Bed:</span> {hotel.maxChildWithBed}
                  </div>
                  <div>
                    <span className="font-medium">Child without Bed:</span> {hotel.maxChildWithoutBed}
                  </div>
                  <div>
                    <span className="font-medium">Maximum Infant:</span> {hotel.maxInfant}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <Button variant="outline" onClick={handleEditClick} className="flex items-center gap-2">
                  Edit Hotel
                </Button>
                <Button variant="destructive" className="flex items-center gap-2">
                  Delete Hotel
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
