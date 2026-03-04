"use client";

import { Button } from "@/components/ui/button";
import { CalendarRange } from "./calendar-range";
import { DateRange } from "react-day-picker"

interface ListingReservationProps {
    price: number
    totalPrice: number
    onChangeDate: (value: DateRange | undefined) => void
    dateRange: DateRange | undefined
    onSubmit: () => void
    disabled: boolean
    disabledDates: Date[]
}

export const ListingReservation = ({price, totalPrice, onChangeDate, dateRange, onSubmit, disabled, disabledDates}: ListingReservationProps) => {
    return (
        <div className="bg-white rounded-xl border border-neutral-200">
            <div className="flex flex-row items-center gap-1 p-4">
                <div className="text-2xl font-semibold">{price}€</div>
                <div className="font-light text-neutral-600">noche</div>
            </div>
            <hr />
            <CalendarRange
                value={dateRange}
                disabledDates={disabledDates}
                onChange={onChangeDate}
            />
            <hr/>
            <div className="p-4">
                <Button 
                    onClick={onSubmit}
                    size={"lg"}
                    variant={"airBnb"}
                    className="w-full cursor-pointer"
                >
                    Reserva
                </Button>
            </div>
            <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
                <div>
                    Total:
                </div>
                <div>
                    {totalPrice}€
                </div>
            </div>
        </div>
    )
}