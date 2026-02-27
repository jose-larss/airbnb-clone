import { UserType } from "@/modules/auth/types"
import { ListingsType } from "../types"
import { useRouter } from "next/navigation"
import useCountries from "../hooks/useCountries"
import { useCallback, useMemo } from "react"
import {format} from "date-fns";
import Image from "next/image"
import { HeartButtom } from "./heart-buttom"
import { Button } from "@/components/ui/button"

interface ListingCardProp {
    reservation?: string // de la tavbla reservation 
    onAction?: (id: string) => void
    disabled?: boolean
    actionLabel?: string,
    actionId?: string
    data: ListingsType,
    currentUser?: UserType | null
}

export const ListingCard = ({reservation, onAction, disabled, actionLabel, actionId="", data, currentUser}: ListingCardProp) => {
    const router = useRouter()
    //obtenemos el objeto de la propiedad
    const {getByValue} = useCountries()
    const location = getByValue(data.location_value)

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()

        if (disabled) {
            return
        }

        onAction?.(actionId)
    }, [onAction, actionId, disabled])

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice
        }
        return data.price
    }, [reservation, data.price])

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null
        }        
        const start = new Date(reservation.startdate)
        const end = new Date(reservation.enddate)

        return `${format(start, 'pp')} - ${format(end, 'pp')}`
    }, [reservation])

    return(
        <div 
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <Image 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        alt="listing"
                        src={data.image}
                        className="object-cover group-hover:scale-110 w-full h-full transition"
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButtom 
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        {price}€
                    </div>
                    {!reservation && (
                        <div className="font-light">noche</div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button 
                        size={"sm"}
                        
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    )
}