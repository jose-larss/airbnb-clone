"use client";

import { useAuthStore } from "@/modules/store/auth-store";
import { ListingsType } from "../types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/modules/home/components/navbar/categories";
import { ListingHead } from "../components/listing-head";
import { ListingInfo } from "../components/listing-info";
import { useRouter } from "next/navigation";
import useLoginModal from "@/modules/auth/hooks/useLoginModal";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { ListingReservation } from "../components/listing-reservation";
import { DateRange } from "react-day-picker"
import { iso } from "zod";


interface ListingDetailViewProps {
    reservations?: Reservation[];
    listing: ListingsType;
}

export const ListingDetailView = ({listing, reservations=[]}: ListingDetailViewProps) => {
    const router = useRouter()
    const loginModal = useLoginModal()

    const customUser = useAuthStore(state => state.user);

    const disabledDates = useMemo(() => {
        let dates: Date[] = []

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            })
            dates = [...dates, ...range]
        })
        return dates
    }, [reservations])

    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })
    
    const onCreateReservation = useCallback(() => {
        if (!customUser) {
            return loginModal.onOpen()
        }
        setIsLoading(true)
        //LLAMADA A L API
        console.log("on create reservation LLEGA")
        console.log("dateRange es", dateRange)
        console.log(dateRange?.from, dateRange?.to)
        const isoDateStart = dateRange?.from?.toISOString();
        const isoDateEnd = dateRange?.to?.toISOString()
        console.log("IsoDates es", isoDateStart, isoDateEnd)
    }, [totalPrice, dateRange, listing.id, router, loginModal, customUser])

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            const dayCount = differenceInCalendarDays(
                dateRange.to,
                dateRange.from
            )

            setTotalPrice(dayCount > 0 ? dayCount * listing.price : listing.price)
        }
    }, [dateRange, listing.price])
    
    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category)
    }, [listing.category])

    return(
        <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead 
                        title={listing.title}
                        id={listing.id}
                        imageSrc={listing.image}
                        locationValue={listing.location_value}
                        currentUser={customUser}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                    <ListingInfo 
                        user={listing.user}
                        category={category}
                        description={listing.description}
                        roomCount={listing.room_count}
                        bathCount={listing.bathroom_count}
                        guestCount={listing.guest_count}
                        locationValue={listing.location_value}
                    />
                    <div className="order-first mb-10 md:order-last md:col-span-3">
                        <ListingReservation 
                            price={listing.price}
                            totalPrice={totalPrice}
                            dateRange={dateRange}
                            onChangeDate={setDateRange}
                            onSubmit={onCreateReservation}
                            disabled={isLoading}
                            disabledDates={disabledDates}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}