"use client";

import useSearchModal from "@/modules/auth/hooks/useSearchModal";
import { BiSearch } from "react-icons/bi";
import { useListingFilters } from "../../hooks/use-listing-filter"
import { useMemo } from "react";
import { differenceInDays } from "date-fns";

export const Search = () => {
    const searchModal = useSearchModal()
    const [filters] = useListingFilters()

    const location_value = filters.city
    const startDate = filters.startDate
    const endDate = filters.endDate
    const guestCount = filters.guest
    
    const locationLabel = useMemo(() => {
        if (location_value) {
            //return getByValue(location_value as string)?.label
            return location_value
        }
        return "Cualquier lugar"
    }, [location_value])
    
    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            let diff = differenceInDays(endDate, startDate)

            if (diff === 0) {
            diff = 1
            }

            return `${diff} días`
        }

        return "Cualquier semana"
    }, [startDate, endDate])

    const guestLabel = useMemo(() => {
        if (guestCount) {
            return `${guestCount} invitados`
        }
        return "Agregar Invitado"
    }, [guestCount])

    return(
        <div 
            onClick={searchModal.onOpen}
            className="border w-full md:w-auto py-2 rounded-full shadow-sm 
                        hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold px-6">
                    {locationLabel}
                </div>

                <div className="hidden sm:block text-sm font-semibold px-6 border-x flex-1 text-center">
                    {durationLabel}
                </div>

                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">
                        {guestLabel}
                    </div>
                    <div className="p-2 bg-rose-500 rounded-full text-white">
                        <BiSearch size={20}/>
                    </div>
                </div>
            </div>
        </div>
    )
}