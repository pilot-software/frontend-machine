import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  enableScroll?: boolean;
}

export function ResponsiveGrid({ 
  children, 
  cols = 4, 
  className,
  enableScroll = true 
}: ResponsiveGridProps) {
  const gridClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
  };

  const minWidth = {
    2: "min-w-[300px]",
    3: "min-w-[450px]",
    4: "min-w-[600px]",
    5: "min-w-[750px]",
    6: "min-w-[900px]"
  };

  if (enableScroll) {
    return (
      <div className="overflow-x-auto">
        <div className={cn("grid gap-4", gridClasses[cols], `${minWidth[cols]} sm:min-w-0`, className)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridClasses[cols], className)}>
      {children}
    </div>
  );
}
