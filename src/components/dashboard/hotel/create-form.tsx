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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/tabs';

// Age range validation
const ageRangeSchema = z
  .tuple([z.number().min(0).max(100), z.number().min(0).max(100)])
  .refine(([min, max]) => min <= max, {
    message: 'Minimum age must be less than or equal to maximum age',
  });

const formSchema = z.object({
  name: z.string().min(3),
  address: z.string().nonempty(),
  city: z.string().nonempty(),
  country: z.string().nonempty(),
  active: z.boolean().default(true),

  // Age ranges
  adultAgeRange: ageRangeSchema,
  childWithoutBedAgeRange: ageRangeSchema,
  childWithBedAgeRange: ageRangeSchema,
  infantAgeRange: ageRangeSchema,

  // Configuration
  currencyCode: z.string().length(3),
  assigned: z.boolean().default(false),

  // Maximum occupancy limits
  maxAdultExtraBed: z.number().int().min(0),
  maxAdult: z.number().int().min(1),
  maxInfant: z.number().int().min(0),
  maxChildWithoutBed: z.number().int().min(0),
  maxChildWithBed: z.number().int().min(0),
});

type FormData = z.infer<typeof formSchema>;

interface HotelFormProps {
  initialData?: FormData;
  id?: string;
  onSuccess?: () => void;
}

export default function HotelForm({ initialData, id, onSuccess }: HotelFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      address: '',
      city: '',
      country: '',
      active: true,
      assigned: false,
      adultAgeRange: [18, 65],
      childWithoutBedAgeRange: [2, 11],
      childWithBedAgeRange: [2, 11],
      infantAgeRange: [0, 1],
      currencyCode: 'USD',
      maxAdultExtraBed: 1,
      maxAdult: 2,
      maxInfant: 1,
      maxChildWithoutBed: 1,
      maxChildWithBed: 1,
    },
  });

  const apiUtils = api.useUtils();

  const invalidateOnSuccess = async () => {
    await apiUtils.hotels.invalidate();
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

  const createMutation = api.hotels.create.useMutation({
    onSuccess: invalidateOnSuccess,
    onError,
  });

  const updateMutation = api.hotels.update.useMutation({
    onSuccess: invalidateOnSuccess,
    onError,
  });

  function onSubmit(data: FormData) {
    setIsSubmitting(true);
    if (id) {
      updateMutation.mutate({ id, body: data });
    } else {
      createMutation.mutate(data);
    }
  }

  const renderAgeRangeFields = (name: keyof FormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-4">
            <FormControl>
              <Input
                type="number"
                placeholder="Min age"
                value={(field.value as [number, number])[0]}
                onChange={(e) => field.onChange([parseInt(e.target.value), (field.value as [number, number])[1]])}
                min={0}
                max={100}
              />
            </FormControl>
            <FormControl>
              <Input
                type="number"
                placeholder="Max age"
                value={(field.value as [number, number])[1]}
                onChange={(e) => field.onChange([(field.value as [number, number])[0], parseInt(e.target.value)])}
                min={0}
                max={100}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{id ? 'Edit Hotel' : 'Add New Hotel'}</CardTitle>
        <CardDescription>{id ? 'Update the hotel details' : 'Enter the hotel details'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="age">Age</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hotel name" {...field} />
                      </FormControl>
                      <FormDescription>Must be at least 3 characters long</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="age" className="space-y-4">
                {renderAgeRangeFields('adultAgeRange', 'Adult Age Range')}
                {renderAgeRangeFields('childWithBedAgeRange', 'Child with Bed Age Range')}
                {renderAgeRangeFields('childWithoutBedAgeRange', 'Child without Bed Age Range')}
                {renderAgeRangeFields('infantAgeRange', 'Infant Age Range')}
              </TabsContent>
              <TabsContent value="configuration" className="space-y-4">
                <FormField
                  control={form.control}
                  name="currencyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Code</FormLabel>
                      <FormControl>
                        <Input placeholder="USD" maxLength={3} {...field} />
                      </FormControl>
                      <FormDescription>3-letter currency code (e.g., USD, EUR)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>Whether this hotel is currently active</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assigned"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Assigned</FormLabel>
                        <FormDescription>Whether this hotel is assigned to any trips</FormDescription>
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
                  <FormField
                    control={form.control}
                    name="maxAdult"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Adults</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} onChange={(e) => field.onChange(+e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxAdultExtraBed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Adult Extra Beds</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(+e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxChildWithBed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Children with Bed</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(+e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxChildWithoutBed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Children without Bed</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(+e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxInfant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Infants</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} onChange={(e) => field.onChange(+e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleFormCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : id ? 'Update Hotel' : 'Create Hotel'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
