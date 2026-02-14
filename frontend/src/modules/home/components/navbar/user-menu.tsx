"use client"

import { AiOutlineMenu } from "react-icons/ai"
import { useCallback, useEffect, useState } from "react"
import { MenuItem } from "./menu-item"

import useRegisterModal from "../../../auth/hooks/useRegisterModal"
import { RegisterModal } from "../../../auth/components/register-modal"
import useLoginModal from "../../hooks/useLoginModal"
//import { ressetAuthCookies } from "@/lib/actions"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CustomUser } from "@/modules/types"

interface UserMenuProps {
    currentUser: CustomUser | null;
    setCurrentUser: (user: CustomUser | null) => void
}

export const UserMenu = ({currentUser, setCurrentUser}: UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()

    //const [currentUser, setCurrentUser] = useState(null)
    const router = useRouter()

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    const logoutUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
            
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/logout/`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Token ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error("Error en logout:", error);
            router.push("/");
        } finally {
            localStorage.removeItem("token");
            setCurrentUser(null) // 🔥 ESTO ES LO QUE FALTABA
            router.push("/")
        }
    }

    // 🔑 Login callback
    const handleLoginSuccess = async () => {
        // Traemos usuario después de login
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
                headers: { Authorization: `Token ${token}` },
            })
            if (!res.ok) return setCurrentUser(null)
            const data = await res.json()
            setCurrentUser(data)
        } catch {
            setCurrentUser(null)
        }
    }
 
    return(
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={() => {}} 
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full
                                 hover:bg-neutral-100 transition cursor-pointer">
                        Airbnb your Home
                </div>

                <div
                    onClick={toggleOpen} 
                    className="py-4 px-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3
                                rounded-full cursor-pointer hover:shadow-md transition"
                    >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Image src={"/images/placeholder.png"} className="rounded-full" height={30} width={30} alt="Avatar" />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem onclick={() => {}} label="My trips"/>
                                <MenuItem onclick={() => {}} label="My favorites"/>
                                <MenuItem onclick={() => {}} label="My reservations"/>
                                <MenuItem onclick={() => {}} label="My properties"/>
                                <MenuItem onclick={() => {}} label="AirBnb my home"/>
                                <hr/>
                                <MenuItem onclick={logoutUser} label="Logout"/>
                            </>                           
                        ):(
                            <>
                                <MenuItem 
                                    onclick={() => loginModal.onOpen(handleLoginSuccess)} 
                                    label="Login"
                                />
                                <MenuItem
                                    onclick={registerModal.onOpen}
                                    label="Sign Up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}