import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {AvatarSkeleton, BadgeSkeleton} from "./CommonSkeletons";

export function AppointmentCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <AvatarSkeleton/>
                        <div className="space-y-1">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded"/>
                            <div className="h-3 w-24 bg-muted animate-pulse rounded"/>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="h-4 w-16 bg-muted animate-pulse rounded"/>
                        <BadgeSkeleton/>
                    </div>
                </div>
                <div className="mt-3 space-y-2">
                    <div className="h-3 w-48 bg-muted animate-pulse rounded"/>
                    <div className="h-3 w-36 bg-muted animate-pulse rounded"/>
                </div>
            </CardContent>
        </Card>
    );
}

export function AppointmentListSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({length: 6}).map((_, i) => (
                <AppointmentCardSkeleton key={i}/>
            ))}
        </div>
    );
}

export function CalendarSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded"/>
                    <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-muted animate-pulse rounded"/>
                        <div className="h-8 w-8 bg-muted animate-pulse rounded"/>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {Array.from({length: 7}).map((_, i) => (
                        <div key={i} className="h-8 bg-muted animate-pulse rounded"/>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({length: 35}).map((_, i) => (
                        <div key={i} className="h-12 bg-muted animate-pulse rounded"/>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
