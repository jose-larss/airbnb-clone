"use client";

import {TbBeach, TbMountain, TbPool} from "react-icons/tb";
import {GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill} from "react-icons/gi";
import {MdOutlineVilla} from "react-icons/md";
import {FaSkiing} from "react-icons/fa";
import {BsSnow} from "react-icons/bs";
import {IoDiamond} from "react-icons/io5";
import CategoryBox from "../category-box";
import { usePathname, useSearchParams } from "next/navigation";


export const categories = [
    {
        label: "Playa",
        icon: TbBeach,
        description: "Esta propiedad esta cerca de la playa",
    },
    {
        label: "Molinos",
        icon: GiWindmill,
        description: "Esta propiedad tiene molinos de viento",
    },
    {
        label: "Moderno",
        icon: MdOutlineVilla,
        description: "Esta propiedad es moderna",
    },
    {
        label: "Campo",
        icon: TbMountain,
        description: "Esta propiedad esta en el campo",
    },
    {
        label: "Piscina",
        icon: TbPool,
        description: "Esta propiedad tiene una piscina",
    },
    {
        label: "Islas",
        icon: GiIsland,
        description: "Esta propiedad esta en una isla",
    },
    {
        label: "Lago",
        icon: GiBoatFishing,
        description: "Esta propiedad esta cerca de una isla",
    },
    {
        label: "Esquiar",
        icon: FaSkiing,
        description: "Esta propiedad tiene actividades de esqui",
    },
    {
        label: "Castillo",
        icon: GiCastle,
        description: "Esta propiedad esta en un castillo",
    },
    {
        label: "Camping",
        icon: GiForestCamp,
        description: "Esta propiedad tiene actividades de campo",
    },
    {
        label: "Arctic",
        icon: BsSnow,
        description: "Esta propiedad tiene actividades articas",
    },
    {
        label: "Cueva",
        icon: GiCaveEntrance,
        description: "Esta propiedad tiene actividades de cueva",
    },
    {
        label: "Desierto",
        icon: GiCactus,
        description: "Esta propiedad esta cerca de un desierto",
    },
    {
        label: "Graneros",
        icon: GiBarn,
        description: "Esta propiedad esta cerca de un granero",
    },
    {
        label: "Lujo",
        icon: IoDiamond,
        description: "Esta propiedad es lujosa",
    },
]


export const Categories = () => {
    const params = useSearchParams();
    const category = params.get("category");
    const pathName = usePathname();

    const isMainPage = pathName == '/'
    if (!isMainPage)  {
        return null
    }

    return(
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox 
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        selected={category == item.label}
                    />
                ))}
            </div>
        </div>
    )
}