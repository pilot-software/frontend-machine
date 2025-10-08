import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatsCardSkeleton } from "./CommonSkeletons";
import { useTranslations } from "next-intl";

export function FinancialStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BillingTableSkeleton() {
  const t = useTranslations("common");
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr>
              {[
                t("patient"),
                "Case #",
                "Services",
                "Amount",
                "Insurance",
                "Patient Pays",
                "Status",
                "Due Date",
                "Actions",
              ].map((_, i) => (
                <th key={i} className="p-4 text-left">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <BillRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function BillRowSkeleton() {
  return (
    <tr>
      <td className="p-4">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
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
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </td>
      <td className="p-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </td>
      <td className="p-4">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
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
        </div>
      </td>
    </tr>
  );
}
