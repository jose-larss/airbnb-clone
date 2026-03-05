"use client";

import {z} from "zod";
import {toast} from "sonner";
import { useAuthStore } from "@/modules/store/auth-store";
import { ListingsType, ReservationType } from "../types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/modules/home/components/navbar/categories";
import { ListingHead } from "../components/listing-head";
import { ListingInfo } from "../components/listing-info";
import { useRouter } from "next/navigation";
import useLoginModal from "@/modules/auth/hooks/useLoginModal";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { ListingReservation } from "../components/listing-reservation";
import { DateRange } from "react-day-picker"
import { reservationSchema } from "../schemas";


interface ListingDetailViewProps {
    listing: ListingsType;
}

export const ListingDetailView = ({listing}: ListingDetailViewProps) => {
    const router = useRouter()
    const loginModal = useLoginModal()

    const customUser = useAuthStore(state => state.user);
   
    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })
    const [reservations, setReservations] = useState<ReservationType[]>([])
  
    useEffect(() => {
        const getReservationsById = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/listing/${listing.id}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`, // 🔑 CLAVE
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json()
                    console.log(errorData)
                }
                const data = await response.json();
                setReservations(data)
                
            } catch (err) {
                console.error("Error al obtener listado:", err);
            } 
        };
        getReservationsById()
    }, [listing.id, dateRange])

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            const dayCount = differenceInCalendarDays(
                dateRange.to,
                dateRange.from
            )

            setTotalPrice(dayCount > 0 ? dayCount * listing.price : listing.price)
        }
    }, [dateRange, listing.price])

    
    const fetchReservationUser = async (data: z.infer<typeof reservationSchema>) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservation/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Token ${token}`, // 🔑 CLAVE
                },
                body: JSON.stringify(data),                
            });     
            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                const errorData = await response.json();
                //console.error('Error en el backend:', errorData);
                // Extrae los mensajes de error en un array
                const messages = Object.values(errorData)
                    .flat() // por si hay arrays dentro (como ["Enter a valid email address."])
                    .join("\n");  // cada mensaje en una línea
                toast.error(messages || "Error desconocido en el servidor", 
                    {style: { whiteSpace: "pre-line" } // importante para que respete los \n}
                });
                return;           
            }
            // Si la respuesta es exitosa
            toast.success("Reserva creada con exito")
            setDateRange(undefined)
            setTotalPrice(listing.price)
            router.push(`/trips`)
               
        } catch (error) {
            // Manejo de errores de red o conexión
            console.error('Error al enviar datos:', error);
            toast.error('Error al enviar datos:')
        } finally {
            setIsLoading(false)
        }
    }

    const disabledDates = useMemo(() => {
        let dates: Date[] = []

        reservations.forEach((reservation: ReservationType) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.start_date),
                end: new Date(reservation.end_date),
            })
            dates = [...dates, ...range]
        })
        return dates
    }, [reservations])

    const onCreateReservation = useCallback(() => {
        if (!customUser) {
            return loginModal.onOpen()
        }
        setIsLoading(true)
        //LLAMADA A L API
        
        const data = {
            totalPrice, 
            listingId: listing.id, 
            startDate: dateRange?.from?.toISOString(), 
            endDate: dateRange?.to?.toISOString()
        }
        
        const parsed = reservationSchema.safeParse(data);

        if (!parsed.success) {
            console.error(parsed.error.format());
            return;
        }

        // 🔥 SOLO aquí llamas al fetch
        fetchReservationUser(parsed.data);

    }, [totalPrice, dateRange, listing.id, router, loginModal, customUser])
    
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