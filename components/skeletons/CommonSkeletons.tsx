import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Avatar Skeleton
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10", 
    lg: "h-16 w-16"
  };
  
  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 8 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Card Skeleton
export function CardSkeleton({ 
  showHeader = true, 
  contentLines = 3 
}: { 
  showHeader?: boolean; 
  contentLines?: number; 
}) {
  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: contentLines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Button Skeleton
export function ButtonSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-16",
    default: "h-10 w-20",
    lg: "h-12 w-24"
  };
  
  return <Skeleton className={`${sizeClasses[size]} rounded-md`} />;
}

// Badge Skeleton
export function BadgeSkeleton() {
  return <Skeleton className="h-5 w-16 rounded-full" />;
}

// Search Bar Skeleton
export function SearchBarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex space-x-2">
        <ButtonSkeleton size="sm" />
        <ButtonSkeleton size="sm" />
        <ButtonSkeleton size="sm" />
      </div>
    </div>
  );
}