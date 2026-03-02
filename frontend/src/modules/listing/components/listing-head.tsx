"use client";

import { UserType } from "@/modules/auth/types";
import useCountries from "../hooks/useCountries";
import Image from "next/image";
import { HeartButtom } from "./heart-buttom";

interface ListingHeadProps {
    title: string;
    id: string;
    imageSrc: string;
    locationValue: string;
    currentUser: UserType | null
}

export const ListingHead = ({title, id, locationValue, imageSrc, currentUser}: ListingHeadProps) => {
    const {getByValue} = useCountries()

    const location = getByValue(locationValue)

    return(
        <>
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    {title}
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    {`${location?.region}, ${location?.label}`}
                </div>
            </div>
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                <Image 
                    alt="image"
                    src={imageSrc}
                    fill
                    className="object-cover w-full"
                />
                <div className="absolute top-5 right-5">
                    <HeartButtom 
                        listingId={id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </>
    )
}