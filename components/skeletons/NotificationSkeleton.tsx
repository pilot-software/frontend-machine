import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BadgeSkeleton, SearchBarSkeleton } from "./CommonSkeletons";

export function NotificationItemSkeleton() {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="h-5 w-5 bg-muted animate-pulse rounded mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="flex items-center space-x-2">
                <BadgeSkeleton />
                <div className="h-2 w-2 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
            <div className="h-3 w-full bg-muted animate-pulse rounded" />
            <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              <div className="flex space-x-1">
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <BadgeSkeleton />
          </div>
        </CardHeader>
        <CardContent>
          <SearchBarSkeleton />
          <div className="mt-4">
            <div className="flex space-x-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 w-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}