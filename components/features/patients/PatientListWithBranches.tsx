'use client';

import { useTranslations } from 'next-intl';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {BranchBadge} from '@/components/shared/navigation/BranchBadge';
import {usePatients} from '@/lib/hooks/useBranchData';
import {Skeleton} from '@/components/ui/skeleton';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    branchId: string;
}

export function PatientListWithBranches() {
  const t = useTranslations('common');
    const {data: patients, isLoading, error} = usePatients();

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full"/>
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
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>Branch</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients?.map((patient: Patient) => (
                    <TableRow key={patient.id}>
                        <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                            <BranchBadge branchId={patient.branchId}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
