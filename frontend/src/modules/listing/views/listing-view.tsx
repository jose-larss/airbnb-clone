"use client"

import { ListingsType } from "../types";
import { ListingCard } from "../components/listing-card";
import { useAuthStore } from "@/modules/store/auth-store";

interface ListingViewClientProps {
    listings: ListingsType[]
}

export default function ListingView({listings}: ListingViewClientProps) {
    const customUser = useAuthStore(state => state.user);
    
    return (
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing) => {
                    return(
                        <ListingCard 
                            key={listing.id}
                            data={listing}
                            currentUser={customUser}
                        />
                    )
                })}         
            </div>
        </div>
    );
}