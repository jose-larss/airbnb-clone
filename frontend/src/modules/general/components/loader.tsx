"use client";

import { Spinner } from "@/components/ui/spinner";

export const Loader = () => {
    return(
        <div className="h-[70vh] flex flex-col justify-center items-center">
            <Spinner className="w-24 h-24 text-red-500" />
        </div>
    )
}