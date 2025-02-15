'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { Button } from '@/lib/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/lib/components/ui/form';
import { Input } from '@/lib/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Switch } from '@/lib/components/ui/switch';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/lib/components/ui/calendar';

// Occupant Limits Schema
const occupantLimitsSchema = z.object({
  adult: z.object({
    min: z.number().int().min(1),
    max: z.number().int().positive(),
  }),
  childWithBed: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  childWithoutBed: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  infant: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0),
  }),
  extraBed: z.object({
    max: z.number().int().min(0),
  }),
  paxPerRoom: z.number().int().min(1),
});

// Pricing Schema
const pricingItemSchema = z.object({
  buyingPrice: z.number().positive(),
  costPrice: z.number().positive(),
  normalOnlinePrice: z.number().positive(),
  preLaunchRate: z.number().positive(),
  normalStartDate: z.date(),
  normalEndDate: z.date(),
  preLaunchStartDate: z.date(),
  preLaunchEndDate: z.date(),
  roomTypeDescription: z.string().optional(),
});

const pricingSchema = z.object({
  adult: pricingItemSchema,
  childWithBed: pricingItemSchema,
  childWithoutBed: pricingItemSchema,
  infant: pricingItemSchema,
});

const schema = z.object({
  hotelId: z.string().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  photo: z.string().url().optional(),
  sleeps: z.number().int().positive(),
  sleepDescription: z.string().optional(),
  inventory: z.number().int().positive(),

  // Configuration
  bedConfiguration: z.string().optional(),
  displayOrder: z.number().int().positive(),
  addOn: z.string().optional(),
  extraBedAllowed: z.boolean().default(false).optional(),
  isTwinNoRoommate: z.boolean().default(false).optional(),
  openForOnlineRegistration: z.boolean().default(true).optional(),
  specialArrangement: z.boolean().default(false).optional(),

  // Occupancy limits
  occupantLimits: occupantLimitsSchema,

  // RTB configuration
  minCoupleRTB: z.number().int().min(1).max(3),
  minFamilyRTB: z.number().int().min(1).max(5),

  // Pricing
  pricing: pricingSchema,
});

type FormData = z.infer<typeof schema>;

interface RoomFormProps {
  initialData?: FormData;
  id?: string;
  hotelId: string;
  onSuccess?: () => void;
}

const defaultValues: FormData = {
  hotelId: '',
  name: '',
  description: '',
  photo: '',
  sleeps: 1,
  sleepDescription: '',
  inventory: 1,
  bedConfiguration: '',
  displayOrder: 1,
  addOn: '',
  extraBedAllowed: false,
  isTwinNoRoommate: false,
  openForOnlineRegistration: true,
  specialArrangement: false,
  occupantLimits: {
    adult: { min: 1, max: 2 },
    childWithBed: { min: 0, max: 2 },
    childWithoutBed: { min: 0, max: 2 },
    infant: { min: 0, max: 1 },
    extraBed: { max: 1 },
    paxPerRoom: 1,
  },
  minCoupleRTB: 1,
  minFamilyRTB: 1,
  pricing: {
    adult: {
      buyingPrice: 0,
      costPrice: 0,
      normalOnlinePrice: 0,
      preLaunchRate: 0,
      normalStartDate: new Date(),
      normalEndDate: new Date(),
      preLaunchStartDate: new Date(),
      preLaunchEndDate: new Date(),
      roomTypeDescription: '',
    },
    childWithBed: {
      buyingPrice: 0,
      costPrice: 0,
      normalOnlinePrice: 0,
      preLaunchRate: 0,
      normalStartDate: new Date(),
      normalEndDate: new Date(),
      preLaunchStartDate: new Date(),
      preLaunchEndDate: new Date(),
      roomTypeDescription: '',
    },
    childWithoutBed: {
      buyingPrice: 0,
      costPrice: 0,
      normalOnlinePrice: 0,
      preLaunchRate: 0,
      normalStartDate: new Date(),
      normalEndDate: new Date(),
      preLaunchStartDate: new Date(),
      preLaunchEndDate: new Date(),
      roomTypeDescription: '',
    },
    infant: {
      buyingPrice: 0,
      costPrice: 0,
      normalOnlinePrice: 0,
      preLaunchRate: 0,
      normalStartDate: new Date(),
      normalEndDate: new Date(),
      preLaunchStartDate: new Date(),
      preLaunchEndDate: new Date(),
      roomTypeDescription: '',
    },
  },
};

export default function RoomForm({ initialData, id, hotelId, onSuccess }: RoomFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          ...initialData,
          pricing: {
            adult: {
              ...initialData.pricing.adult,
              normalStartDate: new Date(initialData.pricing.adult.normalStartDate),
              normalEndDate: new Date(initialData.pricing.adult.normalEndDate),
              preLaunchStartDate: new Date(initialData.pricing.adult.preLaunchStartDate),
              preLaunchEndDate: new Date(initialData.pricing.adult.preLaunchEndDate),
            },
            childWithBed: {
              ...initialData.pricing.childWithBed,
              normalStartDate: new Date(initialData.pricing.childWithBed.normalStartDate),
              normalEndDate: new Date(initialData.pricing.childWithBed.normalEndDate),
              preLaunchStartDate: new Date(initialData.pricing.childWithBed.preLaunchStartDate),
              preLaunchEndDate: new Date(initialData.pricing.childWithBed.preLaunchEndDate),
            },
            childWithoutBed: {
              ...initialData.pricing.childWithoutBed,
              normalStartDate: new Date(initialData.pricing.childWithoutBed.normalStartDate),
              normalEndDate: new Date(initialData.pricing.childWithoutBed.normalEndDate),
              preLaunchStartDate: new Date(initialData.pricing.childWithoutBed.preLaunchStartDate),
              preLaunchEndDate: new Date(initialData.pricing.childWithoutBed.preLaunchEndDate),
            },
            infant: {
              ...initialData.pricing.infant,
              normalStartDate: new Date(initialData.pricing.infant.normalStartDate),
              normalEndDate: new Date(initialData.pricing.infant.normalEndDate),
              preLaunchStartDate: new Date(initialData.pricing.infant.preLaunchStartDate),
              preLaunchEndDate: new Date(initialData.pricing.infant.preLaunchEndDate),
            },
          },
        }
      : { ...defaultValues, hotelId },
  });

  const apiUtils = api.useUtils();

  const invalidateOnSuccess = async () => {
    await apiUtils.rooms.invalidate();
    onSuccess?.();
    router.refresh();
  };

  const onError = () => {
    setIsSubmitting(false);
  };

  const handleFormCancel = () => {
    if (!id) {
      router.back();
    } else {
      onSuccess?.();
    }
  };

  const createMutation = api.rooms.create.useMutation({
    onSuccess: invalidateOnSuccess,
    onError,
  });

  const updateMutation = api.rooms.update.useMutation({
    onSuccess: invalidateOnSuccess,
    onError,
  });

  function onSubmit(data: FormData) {
    setIsSubmitting(true);
    if (id) {
      updateMutation.mutate({ id, body: data });
    } else {
      createMutation.mutate({
        ...data,
        hotelId: id || '',
        sleeps: data.sleeps || 1,
        inventory: data.inventory || 1,
        displayOrder: data.displayOrder || 1,
      });
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? 'Edit Room' : 'Add New Room'}</CardTitle>
        <CardDescription>{id ? 'Update the room details' : 'Enter the room details'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Room Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Room name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter room description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Photo URL */}
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter photo URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sleeps */}
                  <FormField
                    control={form.control}
                    name="sleeps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sleeps</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Number of sleeps"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sleep Description */}
                  <FormField
                    control={form.control}
                    name="sleepDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sleep Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter sleep description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Inventory */}
                  <FormField
                    control={form.control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Room inventory"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bed Configuration */}
                  <FormField
                    control={form.control}
                    name="bedConfiguration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bed Configuration</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bed configuration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Display Order */}
                  <FormField
                    control={form.control}
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Display order"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Add On */}
                  <FormField
                    control={form.control}
                    name="addOn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Add On</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter add-on details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="configuration" className="space-y-4">
                {/* Extra Bed Allowed */}
                <FormField
                  control={form.control}
                  name="extraBedAllowed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Extra Bed Allowed</FormLabel>
                        <FormDescription>Allow extra beds in this room</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Twin No Roommate */}
                <FormField
                  control={form.control}
                  name="isTwinNoRoommate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Twin No Roommate</FormLabel>
                        <FormDescription>Twin room without roommate option</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Open For Online Registration */}
                <FormField
                  control={form.control}
                  name="openForOnlineRegistration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Open For Online Registration</FormLabel>
                        <FormDescription>Allow online registration for this room</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Special Arrangement */}
                <FormField
                  control={form.control}
                  name="specialArrangement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Special Arrangement</FormLabel>
                        <FormDescription>Room requires special arrangement</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="occupancy" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Adult Occupancy */}
                  <FormField
                    control={form.control}
                    name="occupantLimits.adult.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Adults</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupantLimits.adult.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Adults</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Child with Bed Occupancy */}
                  <FormField
                    control={form.control}
                    name="occupantLimits.childWithBed.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Children with Bed</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupantLimits.childWithBed.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Children with Bed</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Child without Bed Occupancy */}
                  <FormField
                    control={form.control}
                    name="occupantLimits.childWithoutBed.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Children without Bed</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupantLimits.childWithoutBed.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Children without Bed</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Infant Occupancy */}
                  <FormField
                    control={form.control}
                    name="occupantLimits.infant.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Infants</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupantLimits.infant.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Infants</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Extra Bed */}
                  <FormField
                    control={form.control}
                    name="occupantLimits.extraBed.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Extra Beds</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupantLimits.paxPerRoom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passengers per Room</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-4">
                {/* Adult Pricing */}
                <div className="space-y-4">
                  <h4 className="font-medium">Adult Pricing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing.adult.buyingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buying Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.adult.costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.adult.normalOnlinePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Normal Online Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.adult.preLaunchRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pre-Launch Rate</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.adult.normalStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.adult.normalEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.adult.preLaunchStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.adult.preLaunchEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Child With Bed Pricing */}
                <div className="space-y-4">
                  <h4 className="font-medium">Child With Bed Pricing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.buyingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buying Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.normalOnlinePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Normal Online Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.preLaunchRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pre-Launch Rate</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.normalStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.normalEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.preLaunchStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.childWithBed.preLaunchEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Child Without Bed Pricing */}
                <div className="space-y-4">
                  <h4 className="font-medium">Child Without Bed Pricing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.buyingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buying Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.normalOnlinePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Normal Online Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.preLaunchRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pre-Launch Rate</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.normalStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.normalEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.preLaunchStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.childWithoutBed.preLaunchEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Infant Pricing */}
                <div className="space-y-4">
                  <h4 className="font-medium">Infant Pricing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pricing.infant.buyingPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buying Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.infant.costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.infant.normalOnlinePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Normal Online Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.infant.preLaunchRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pre-Launch Rate</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricing.infant.normalStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.infant.normalEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Normal Rate End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.infant.preLaunchStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricing.infant.preLaunchEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Pre-Launch End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} className="w-full justify-start text-left">
                                  {field.value ? format(field.value, 'yyyy-MM-dd') : 'Pick a date'}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Configuration Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minCoupleRTB"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Couple RTB</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minFamilyRTB"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Family RTB</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleFormCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : id ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
