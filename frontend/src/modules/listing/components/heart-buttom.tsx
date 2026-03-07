"use client";

import { cn } from "@/lib/utils";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "../hooks/useFavorites";

interface HeartButtomProps {
    listingId: string,
}

export const HeartButtom = ({listingId}: HeartButtomProps) => {
    const {hasFavorited, toggleFavorite} = useFavorite({listingId})
    //onst hasFavorited = false
    //const toogleFavorited = () => {}

    return(
        <div
            onClick={toggleFavorite} 
            className="relative hover:opacity-80 transition cursor-pointer"
        >
            <AiOutlineHeart 
                size={28} 
                className="fill-white absolute -top-0.5 -right-0.5"
            />
            <AiFillHeart 
                size={24}
                className={cn(hasFavorited ? "fill-rose-500" : "fill-neutral-500/70")}
            />
        </div>
    )
}