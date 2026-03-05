"use client";

import { UserType } from "@/modules/auth/types";
import { ListingCard } from "@/modules/listing/components/listing-card";
import { ReservationType } from "@/modules/listing/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ReservationsListingProps {
    reservations: ReservationType[]
    currenUser: UserType | null
}

export const ReservationsListing = ({reservations, currenUser}: ReservationsListingProps) => {
    const router = useRouter()

    const [deletingId, setDeletingId] = useState("")
    const [localReservations, setLocalReservations] = useState(reservations)

    const onCancel = useCallback(async (id: string) => {
        setDeletingId(id)
        //llamar a api de borrar reserva
        const token = localStorage.getItem('token');
        try {    
            // DELETE
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservation/${id}/remove/`, {
                method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                throw new Error("Cancelar reserva");
            }           
            toast.success("reserva cancelada")
            setLocalReservations((prev) =>
                prev.filter((reservation) => reservation.id !== id)
            )
        } catch (error) {
            console.error(error);
            //toast.error('Algo fue mal!');
        } finally {
            setDeletingId("")
        }
        
    }, [router])

    return(
        <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    Reservas
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    Reservas en sus propiedades
                </div>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {localReservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        reservation={reservation}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancelar reservas de invitados"
                        actionId={reservation.id}
                        data={reservation?.listing}
                        currentUser={currenUser}
                    />
                ))}
            </div>
        </div>
    )
}