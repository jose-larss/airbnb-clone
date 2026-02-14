"use client"

import { useEffect, useState } from "react"
import { Navbar } from "../components/navbar/navbar"
import { CustomUser } from "@/modules/types"


interface ProviderProps {
    children: React.ReactNode
}


export const Providers = ({children}: ProviderProps) => {
    const [currentUser, setCurrentUser] = useState<CustomUser | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
                headers: { Authorization: `Token ${token}` },
            }
        )

        if (!res.ok) {
            localStorage.removeItem("token")
            setCurrentUser(null)
            return
        }

        const data = await res.json()
        setCurrentUser(data)
        }

        fetchUser()
    }, [])

    return (
        <>
            <Navbar 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser} 
            />
            {children}
        </>
    )
}
