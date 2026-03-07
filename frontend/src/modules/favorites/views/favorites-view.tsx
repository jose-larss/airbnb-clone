"use client";

import { useAuthStore } from "@/modules/store/auth-store"
import { FavoritesListing } from "../components/favorites-listing";
import { useEffect, useState } from "react";
import { EmptyState } from "@/modules/home/components/empty-state";

export const FavoritesView = () => {
    const customUser = useAuthStore(state => state.user)
    const [listings, setListings] = useState<[]>([])

    useEffect(() => {
        if (!customUser) return

        const fetchListings = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/listings/`, {
                        headers: {
                        Authorization: `Token ${token}`,
                    },
                }
                )

                if (!response.ok) {
                    throw new Error("Error al obtener reservas")
                }

                const data = await response.json()
                setListings(data) //Array.isArray(data) ? data : []
            } catch (err) {
                console.error(err)
                setListings([])
            }
        }

        fetchListings()
    }, [customUser])

    if (listings.length === 0) {
        return(
            <EmptyState
                title="No se encontraron favoritos"
                subTitle="Parece que no tienes listados ningún favorito"
                showReset
            />
        )
    }
    return(
        <FavoritesListing 
            currentUser={customUser}
            listings={listings}
        />
    )
}