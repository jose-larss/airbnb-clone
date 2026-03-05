"use client";

import { UserType } from "@/modules/auth/types"
import { ListingCard } from "@/modules/listing/components/listing-card";
import { ReservationType } from "@/modules/listing/types"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react";

interface TripsListingProps {
    reservations: ReservationType[]
    currenUser: UserType | null
}

export const TripsListing = ({reservations, currenUser}: TripsListingProps) => {
    const router = useRouter()

    const [deletingId, setDeletingId] = useState("")

    const onCancel = useCallback((id: string) => {
        setDeletingId(id)
        //llamar a api de borrar reserva
        /*
        const token = localStorage.getItem('token');
        try {    
            // DELETE
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${listingId}/remove/`, {
                method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                throw new Error("Error al eliminar favorito");
            }   
            const data = await response.json()
            //toast
            //router.refresh()
            //setHasFavorited(data.favorited); // 🔥 UI inmediata
        } catch (error) {
            console.error(error);
            //toast.error('Algo fue mal!');
        } finally {
            setDeletingId("")
        }
        */
    }, [router])

    return(
        <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    Viajes
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    Dónde has estado y hacia dónde vas
                </div>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        reservation={reservation}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancelar reserva"
                        actionId={reservation.id}
                        data={reservation?.listing}
                        currentUser={currenUser}
                    />
                ))}
            </div>
        </div>
    )
}