"use client";

import { EmptyState } from "@/modules/home/components/empty-state";
import { useAuthStore } from "@/modules/store/auth-store";
import { useEffect, useState } from "react";
import { PropertiesListing } from "../components/properties-listing";

export const PropertiesView = () => {
    const customUser = useAuthStore(state => state.user)
    const [properties, setProperties] = useState<[]>([])

    useEffect(() => {
        if (!customUser) return

        const fetchProperties = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${customUser.id}/`, {
                        headers: {
                        Authorization: `Token ${token}`,
                    },
                }
                )

                if (!response.ok) {
                    throw new Error("Error al obtener reservas")
                }

                const data = await response.json()
                setProperties(data) //Array.isArray(data) ? data : []
            } catch (err) {
                console.error(err)
                setProperties([])
            }
        }

        fetchProperties()
    }, [customUser])

    if (!customUser) {
        return (
            <EmptyState
                title="Sin autorización."
                subTitle="Por favor, haz login."
                showReset
            />
        )
    }

    if (properties.length === 0) {
        return(
            <EmptyState
                title="No se encontraron propiedades"
                subTitle="Parece que no eres propietario de ninguna propiedad"
                showReset
            />
        )
    }
    return(
        <PropertiesListing 
            currentUser={customUser}
            listings={properties}
        />
    )
}