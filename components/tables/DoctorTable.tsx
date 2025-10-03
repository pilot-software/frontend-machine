import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import {Avatar, AvatarFallback, AvatarImage} from '../ui/avatar';
import {Badge} from '../ui/badge';
import {Button} from '../ui/button';
import {Card, CardContent} from '../ui/card';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '../ui/dropdown-menu';
import {Edit, ExternalLink, Eye, Mail, MoreHorizontal, Phone, Printer} from 'lucide-react';
import {useAuth} from '../AuthContext';
import {printService} from '@/lib/utils/printService';
import {useIsMobile} from '../ui/use-mobile';

interface DoctorTableProps {
  doctors: any[];
  onViewDoctor: (doctorId: string, origin: { x: number; y: number }) => void;
  onEditDoctor: (doctorId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800";
    case "busy":
      return "bg-yellow-100 text-yellow-800";
    case "off-duty":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

export function DoctorTable({ doctors, onViewDoctor, onEditDoctor }: DoctorTableProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleOpenInNewTab = (doctorId: string) => {
    window.open(`/doctor/${doctorId}`, '_blank', 'noopener,noreferrer');
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    <Badge className={`${getStatusColor(doctor.availability)} text-xs mt-1`}>
                      {doctor.availability}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 touch-target"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onViewDoctor(doctor.id, {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                      });
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {user?.role === "admin" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-target">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenInNewTab(doctor.id)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditDoctor(doctor.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Doctor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => printService.printDoctor(doctor)}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Info
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="truncate ml-2">{doctor.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Patients:</span>
                  <span>{doctor.patients}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center text-xs mb-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <span className="truncate">{doctor.email}</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto px-6 pt-0 pb-6">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Patients</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={doctor.avatar} alt={doctor.name} />
                  <AvatarFallback>
                    {doctor.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{doctor.name}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{doctor.specialization}</TableCell>
            <TableCell>{doctor.department}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Mail className="h-3 w-3 mr-1" />
                  {doctor.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-3 w-3 mr-1" />
                  {doctor.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>{doctor.patients}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(doctor.availability)}>
                {doctor.availability}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-200 hover:scale-110 hover:bg-accent group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    onViewDoctor(doctor.id, {
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2
                    });
                  }}
                  aria-label="View doctor details"
                >
                  <Eye className="h-4 w-4 transition-all duration-200 group-hover:text-blue-600 group-hover:scale-125" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-200 hover:scale-110 hover:bg-accent group"
                  onClick={() => handleOpenInNewTab(doctor.id)}
                  aria-label="Open doctor in new tab"
                >
                  <ExternalLink className="h-4 w-4 transition-all duration-200 group-hover:text-green-600 group-hover:scale-125" aria-hidden="true" />
                </Button>
                {user?.role === "admin" && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-110 hover:bg-accent group"
                      onClick={() => onEditDoctor(doctor.id)}
                      aria-label="Edit doctor"
                    >
                      <Edit className="h-4 w-4 transition-all duration-200 group-hover:text-orange-600 group-hover:scale-125" aria-hidden="true" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="sm" aria-label="More actions">
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => printService.printDoctor(doctor)}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Info
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </div>
  );
}
