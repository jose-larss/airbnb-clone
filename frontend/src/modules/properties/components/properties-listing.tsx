"use client";

import { UserType } from "@/modules/auth/types";
import { ListingCard } from "@/modules/listing/components/listing-card";
import { ListingsType } from "@/modules/listing/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface PropertiesListingProps {
    currentUser: UserType | null
    listings: ListingsType[]
}

export const PropertiesListing = ({currentUser, listings}: PropertiesListingProps) => {
    const router = useRouter()

    const [deletingId, setDeletingId] = useState("")
    const [localListings, setLocalListing] = useState(listings)

    const onCancel = useCallback(async (id: string) => {
        setDeletingId(id)
        //llamar a api de borrar reserva
        const token = localStorage.getItem('token');
        try {    
            // DELETE
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}/remove/`, {
                method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                throw new Error("Cancelar propiedad");
            }           
            toast.success("Propiedad borrada")
            setLocalListing((prev) =>
                prev.filter((listing) => listing.id !== id)
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
                    Propiedades
                </div>

                <div className="font-light text-neutral-500 mt-2">
                   Lista de todas las propiedades que tienes
                </div>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {localListings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onCancel}  
                        disabled={deletingId === listing.id}         
                        actionLabel="Borrar propiedad"            
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    )
}