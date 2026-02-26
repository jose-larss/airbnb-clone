"use client";

import { cn } from "@/lib/utils";
import { UserType } from "@/modules/auth/types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtomProps {
    listingId: string,
    currentUser?: UserType | null
}

export const HeartButtom = ({listingId, currentUser}: HeartButtomProps) => {
    const hasFavorited = false
    const toogleFavorited = () => {}

    return(
        <div
            onClick={toogleFavorited} 
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