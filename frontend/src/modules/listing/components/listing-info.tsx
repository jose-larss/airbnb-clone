import { IconType } from "react-icons";
import useCountries from "../hooks/useCountries";
import Image from "next/image";
import { ListingCategory } from "./listing-category";
import dynamic from "next/dynamic";
import { UserType } from "@/modules/auth/types";

interface ListingInfoProps {
    user: UserType;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined;
    description: string;
    roomCount: number;
    bathCount: number;
    guestCount: number;
    locationValue: string;
}

export const ListingInfo = ({user, category, description, roomCount, bathCount, guestCount, locationValue}: ListingInfoProps) => {
    const {getByValue} = useCountries()
  
    const coordinates = getByValue(locationValue)

    const Maps = dynamic(() => import('./modal/maps'), { ssr: false });

    const center =
        coordinates?.latlng && coordinates.latlng.length === 2
            ? (coordinates.latlng as [number, number])
            : undefined


    return(
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex flex-row items-center gap-2">
                    <div>Alojado por {user.username}</div>
                    <div className="hidden md:block">
                        <Image src={"/images/placeholder.png"} className="rounded-full" height={30} width={30} alt="Avatar" />
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                <div>
                    {guestCount} invitados
                </div>
                <div>
                    {roomCount} habitaciones
                </div>
                <div>
                    {bathCount} baños
                </div>
            </div>
            <hr/>
            {category && (
                <ListingCategory 
                    icon={category.icon}
                    label={category.label}
                    description={category.description}
                />
            )}
            <hr/>
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
            <hr/>
            <Maps center={center}/>
        </div>
    )
}