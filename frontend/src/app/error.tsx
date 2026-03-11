"use client";

import { EmptyState } from "@/modules/home/components/empty-state";
import { useEffect } from "react";

interface ErrorStateProps {
    error: Error,    
}

const ErrorState = ({error}: ErrorStateProps) => {
    useEffect(() => {
        console.error(error)
    }, [error])

    return(
        <EmptyState 
            title="uhhhh ohhhhhh"
            subTitle="Algo fue mal"
            showReset
        />
    )
}
export default ErrorState;

