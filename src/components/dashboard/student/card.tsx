'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/lib/components/ui/collapsible';
import { Button } from '@/lib/components/ui/button';
import { Badge } from '@/lib/components/ui/badge';
import { ChevronDown, ChevronUp, Mail, Phone, BookOpen, GraduationCap, Users, Calendar, X } from 'lucide-react';
import { api } from '@/trpc/react';
import StudentForm from '@/components/dashboard/student/create-edit-form';
import { format } from 'date-fns';
import { StudentDetail } from '@/server/api/requests/student';
import { StudentDetailOutput } from '@/server/api/routers/student-router';

interface StudentCardProps {
  student: StudentDetailOutput;
  id?: string;
}

export default function StudentCard({ student, id }: StudentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const utils = api.useUtils();
  const deleteMutation = api.students.delete.useMutation({
    onSuccess: () => {
      utils.students.invalidate();
    },
  });

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteMutation.mutate({ id: student.id });
    } else {
      setShowDeleteConfirm(true);
    }
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Edit Student</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StudentForm initialData={student} id={id} onSuccess={() => setIsEditing(false)} />
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
              <CardTitle className="text-xl font-bold">{student.displayName || `${student.firstName} ${student.lastName}`}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {student.email}
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="default" className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {student.program}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Batch {student.batch}
            </Badge>
            {student.phone && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {student.phone}
              </Badge>
            )}
            {student.nationality && (
              <Badge variant="outline">{student.nationality}</Badge>
            )}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-4">
            <div className="grid gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Full Name:</span> {student.firstName} {student.lastName}
                  </div>
                  {student.gender && (
                    <div>
                      <span className="font-medium">Gender:</span> {student.gender}
                    </div>
                  )}
                  {student.dateOfBirth && (
                    <div>
                      <span className="font-medium">Date of Birth:</span> {format(new Date(student.dateOfBirth), 'PPP')}
                    </div>
                  )}
                  {student.placeOfBirth && (
                    <div>
                      <span className="font-medium">Place of Birth:</span> {student.placeOfBirth}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Email:</span> {student.email}
                  </div>
                  {student.phone && (
                    <div>
                      <span className="font-medium">Phone:</span> {student.phone}
                    </div>
                  )}
                  {student.currentAddress && (
                    <div className="col-span-2">
                      <span className="font-medium">Current Address:</span> {student.currentAddress}
                    </div>
                  )}
                  {student.permanentAddress && (
                    <div className="col-span-2">
                      <span className="font-medium">Permanent Address:</span> {student.permanentAddress}
                    </div>
                  )}
                </div>
              </div>

              {(student.guardianName || student.guardianPhone || student.guardianEmail) && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Guardian Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {student.guardianName && (
                      <div>
                        <span className="font-medium">Name:</span> {student.guardianName}
                      </div>
                    )}
                    {student.guardianRelationship && (
                      <div>
                        <span className="font-medium">Relationship:</span> {student.guardianRelationship}
                      </div>
                    )}
                    {student.guardianPhone && (
                      <div>
                        <span className="font-medium">Phone:</span> {student.guardianPhone}
                      </div>
                    )}
                    {student.guardianEmail && (
                      <div>
                        <span className="font-medium">Email:</span> {student.guardianEmail}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Program:</span> {student.program}
                  </div>
                  <div>
                    <span className="font-medium">Batch:</span> {student.batch}
                  </div>
                  <div>
                    <span className="font-medium">Joined:</span> {format(new Date(student.createdAt || ''), 'PP')}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-2">
                <Button variant="outline" onClick={handleEditClick} className="flex items-center gap-2">
                  Edit Student
                </Button>
                {/* <Button 
                  variant="destructive" 
                  onClick={handleDelete} 
                  className="flex items-center gap-2"
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading 
                    ? 'Deleting...' 
                    : showDeleteConfirm 
                      ? 'Confirm Delete' 
                      : 'Delete Student'
                  }
                </Button> */}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}