import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay } from "date-fns";

interface CalendarRangeProps {
    value: DateRange | undefined;
    onChange: (value: DateRange | undefined) => void;
    disabledDates?: Date[];
}

export function CalendarRange({value, onChange, disabledDates = []}: CalendarRangeProps) {
    return (
        <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            disabled={[
                ...disabledDates,
                { before: startOfDay(new Date()) },
            ]}
            className="rounded-lg border w-full"
            captionLayout="dropdown"
        />
    );
}