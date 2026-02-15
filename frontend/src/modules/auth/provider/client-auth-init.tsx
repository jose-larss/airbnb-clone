"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/modules/store/auth-store"

export default function ClientAuthInit() {
    const refreshUser = useAuthStore((state) => state.refreshUser)

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    return null
}