"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
    title: string,
    subTitle: string,
    showReset: boolean,
}

export const EmptyState = ({
    title,
    subTitle,
    showReset,
}: EmptyStateProps) => {
    const router = useRouter();

    return(
        <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
            <div className={"text-center"}>
                <div className="text-2xl font-bold">
                    {title}
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    {subTitle}
                </div>
            </div>
            <div className="w-48 mt-4">
                {showReset && (
                    <Button 
                        onClick={() => router.push('/')}
                        variant={"airBnbOutline"}
                        size={"lg"}
                    >
                        Borrar todos los filtros
                    </Button>
                )}
            </div>
        </div>
    )
}