"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";


interface CategoryBoxProps {
    label: string,
    icon: IconType,
    selected?: boolean
}

const CategoryBox = ({label, icon: Icon, selected}: CategoryBoxProps) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        const currentQuery: Record<string, string> = params
            ? (qs.parse(params.toString()) as Record<string, string>)
            : {}

        const updatedQuery: Record<string, string | undefined> = {
            ...currentQuery,
            category:
                params?.get("category") === label
                    ? undefined
                    : label,
        }

        const url = qs.stringifyUrl(
            {
                url: "/",
                query: updatedQuery,
            },
            { skipNull: true }
        )

        router.push(url)
    }, [label, params, router])

    return(
        <div
            onClick={handleClick} 
            className={cn(
                "flex flex-col items-center justify-between gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer",
                selected ? "border-b-neutral-800" : "border-transparent",
                selected ? "text-neutral-800" : "text-neutral-500"
            )}>
                <Icon size={26}/>
                <div  className="font-medium text-sm">
                    {label}
                </div>
        </div>
    )
}
export default CategoryBox;