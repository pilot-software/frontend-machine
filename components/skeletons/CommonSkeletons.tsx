import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

// Avatar Skeleton
export function AvatarSkeleton({size = "md"}: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-10 w-10",
        lg: "h-16 w-16"
    };

    return <Skeleton className={`${sizeClasses[size]} rounded-full`}/>;
}

// Table Row Skeleton
export function TableRowSkeleton({columns = 8}: { columns?: number }) {
    return (
        <tr>
            {Array.from({length: columns}).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4 w-full"/>
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
                    <Skeleton className="h-6 w-3/4"/>
                    <Skeleton className="h-4 w-1/2"/>
                </CardHeader>
            )}
            <CardContent className="space-y-3">
                {Array.from({length: contentLines}).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full"/>
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
                        <Skeleton className="h-4 w-20"/>
                        <Skeleton className="h-8 w-16"/>
                        <Skeleton className="h-3 w-24"/>
                    </div>
                    <Skeleton className="h-8 w-8 rounded"/>
                </div>
            </CardContent>
        </Card>
    );
}

// Button Skeleton
export function ButtonSkeleton({size = "default"}: { size?: "sm" | "default" | "lg" }) {
    const sizeClasses = {
        sm: "h-8 w-16",
        default: "h-10 w-20",
        lg: "h-12 w-24"
    };

    return <Skeleton className={`${sizeClasses[size]} rounded-md`}/>;
}

// Badge Skeleton
export function BadgeSkeleton() {
    return <Skeleton className="h-5 w-16 rounded-full"/>;
}

// Search Bar Skeleton
export function SearchBarSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-md"/>
            <div className="flex space-x-2">
                <ButtonSkeleton size="sm"/>
                <ButtonSkeleton size="sm"/>
                <ButtonSkeleton size="sm"/>
            </div>
        </div>
    );
}

// Dashboard Stats Skeleton
export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />
                    <CardContent className="p-6 relative">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-3 sm:h-4 w-24" />
                                <Skeleton className="h-6 sm:h-8 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Dashboard Table Skeleton
export function DashboardTableSkeleton() {
    return (
        <div className="spacing-responsive">
            {/* Search Card Skeleton */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <Skeleton className="h-6 w-64" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-96 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <div className="flex space-x-2">
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card Skeleton */}
            <Card className="overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-96 mt-2" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-6 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
