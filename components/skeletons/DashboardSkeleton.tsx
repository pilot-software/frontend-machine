import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatsCardSkeleton, SearchBarSkeleton, TableRowSkeleton, AvatarSkeleton } from "./CommonSkeletons";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SearchBarSkeleton />
        <div className="mt-6">
          <table className="w-full">
            <thead>
              <tr>
                {Array.from({ length: 8 }).map((_, i) => (
                  <th key={i} className="p-4 text-left">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function PatientRowSkeleton() {
  return (
    <tr>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <AvatarSkeleton />
          <div className="space-y-1">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <div className="h-3 w-36 bg-muted animate-pulse rounded" />
          <div className="h-3 w-28 bg-muted animate-pulse rounded" />
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </td>
      <td className="p-4">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </td>
      <td className="p-4">
        <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
      </td>
      <td className="p-4">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </td>
      <td className="p-4">
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        </div>
      </td>
    </tr>
  );
}