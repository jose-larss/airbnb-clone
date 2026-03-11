"use client";

import { UserType } from "@/modules/auth/types";
import { ListingCard } from "@/modules/listing/components/listing-card";
import { ListingsType } from "@/modules/listing/types";

interface FavoritesListingProps {
    currentUser: UserType | null
    listings: ListingsType[]
}

export const FavoritesListing = ({currentUser, listings}: FavoritesListingProps) => {
    return(
        <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-28">
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    Favoritos
                </div>

                <div className="font-light text-neutral-500 mt-2">
                   Lista de los sitios que tienes favoritos
                </div>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        data={listing}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    )
}