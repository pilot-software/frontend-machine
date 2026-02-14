"use client";

import * as React from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DayPicker} from "react-day-picker";

import {cn} from "./utils";
import {buttonVariants} from "./button";

function Calendar({
                      className,
                      classNames,
                      showOutsideDays = true,
                      ...props
                  }: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-4", className)}
            classNames={{
                months: "flex flex-col sm:flex-row gap-4",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-lg font-semibold text-gray-900",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({variant: "outline"}),
                    "h-8 w-8 bg-white border-gray-300 p-0 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex mb-2",
                head_cell:
                    "text-gray-600 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center",
                row: "flex w-full",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-50 [&:has([aria-selected].day-outside)]:bg-blue-50/50",
                day: cn(
                    "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 transition-colors rounded-md flex items-center justify-center"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 font-medium shadow-sm",
                day_today: "bg-blue-100 text-blue-900 font-semibold border border-blue-300",
                day_outside:
                    "text-gray-400 opacity-50 aria-selected:bg-blue-50/50 aria-selected:text-gray-400",
                day_disabled: "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent",
                day_range_middle:
                    "aria-selected:bg-blue-50 aria-selected:text-blue-900",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({orientation, ...props}) => {
                    const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
                    return <Icon className="h-4 w-4 text-gray-600" {...props} />;
                },
            }}
            {...props}
        />
    );
}

export {Calendar};
