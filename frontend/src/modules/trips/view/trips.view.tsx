"use client"

import { EmptyState } from "@/modules/home/components/empty-state"
import { ReservationType } from "@/modules/listing/types"
import { useAuthStore } from "@/modules/store/auth-store"
import { useEffect, useState } from "react"
import { TripsListing } from "../components/trips-listing"
import { useRouter } from "next/navigation"
import useLoginModal from "@/modules/auth/hooks/useLoginModal"

export const TripsView = () => {
    const router = useRouter()
    const loginModal = useLoginModal()

    const customUser = useAuthStore(state => state.user)
    const [reservations, setReservations] = useState<ReservationType[]>([])

    useEffect(() => {
        if (!customUser) return
        
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/user/${customUser.id}/`, {
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
    }, [customUser, loginModal])
    
    if (!customUser) {
        return (
            <EmptyState
                title="Sin autorización."
                subTitle="Por favor, haz login."
                showReset
            />
        )
    }
    
    if (reservations.length === 0) {
        return (
            <EmptyState
                title="No se encontraron viajes"
                subTitle="Parece que no has reservado ningún viaje."
                showReset
            />
        )
    }

    return (
        <TripsListing 
            reservations={reservations}
            currentUser={customUser}
        />
    )
}