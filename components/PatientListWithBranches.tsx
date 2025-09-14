'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BranchBadge } from './BranchBadge';
import { usePatients } from '@/lib/hooks/useBranchData';
import { Skeleton } from './ui/skeleton';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  branchId: string;
}

export function PatientListWithBranches() {
  const { data: patients, isLoading, error } = usePatients();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Branch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients?.map((patient: Patient) => (
          <TableRow key={patient.id}>
            <TableCell>{patient.firstName} {patient.lastName}</TableCell>
            <TableCell>{patient.email}</TableCell>
            <TableCell>
              <BranchBadge branchId={patient.branchId} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}