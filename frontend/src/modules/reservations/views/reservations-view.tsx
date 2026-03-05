"use client";

import { EmptyState } from "@/modules/home/components/empty-state";
import { ReservationType } from "@/modules/listing/types";
import { useAuthStore } from "@/modules/store/auth-store";
import { useEffect, useState } from "react";
import { ReservationsListing } from "../components/reservations-listing";

export const ReservationView = () => {
    const customUser = useAuthStore(state => state.user)
    const [reservations, setReservations] = useState<ReservationType[]>([])

    useEffect(() => {
        if (!customUser) return

        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/author/${customUser.id}/`, {
                        headers: {
                        Authorization: `Token ${token}`,
                    },
                }
                )

                if (!response.ok) {
                    throw new Error("Error al obtener reservas")
                }

                const data = await response.json()
                setReservations(data) //Array.isArray(data) ? data : []
            } catch (err) {
                console.error(err)
                setReservations([])
            }
        }

        fetchReservations()
    }, [customUser])

    if (!customUser) {
        return(
            <EmptyState 
                title="Sin autorizacion"
                subTitle="Por favor, tienes que hacer login"
                showReset
            />
        )
    }
    if (reservations.length === 0) {
        return(
            <EmptyState
                title="No se encontraron reservas"
                subTitle="Todavía no tienes reservas, de tus propiedades"
                showReset
            />
        )
    }
    return(
        <ReservationsListing 
            reservations={reservations}
            currenUser={customUser}
        />
    )
}