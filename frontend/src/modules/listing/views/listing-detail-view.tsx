"use client";

import { useAuthStore } from "@/modules/store/auth-store";
import { ListingsType } from "../types";
import { useMemo } from "react";
import { categories } from "@/modules/home/components/navbar/categories";
import { ListingHead } from "../components/listing-head";
import { ListingInfo } from "../components/listing-info";

interface ListingDetailViewProps {
    reservations?: Reservation[];
    listing: ListingsType;
}

export const ListingDetailView = ({listing}: ListingDetailViewProps) => {
    const customUser = useAuthStore(state => state.user);
    
    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category)
    }, [listing.category])
    console.log(category)
    return(
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
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
                </div>
            </div>
        </div>
    )
}