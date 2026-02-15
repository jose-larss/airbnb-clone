"use client"

import { AiOutlineMenu } from "react-icons/ai"
import { useCallback, useState } from "react"
import { MenuItem } from "./menu-item"

import useRegisterModal from "../../../auth/hooks/useRegisterModal"
import useLoginModal from "../../../auth/hooks/useLoginModal"
import { useAuthStore } from "@/modules/store/auth-store"
import Image from "next/image"


export const UserMenu = () => {
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);

    const [isOpen, setIsOpen] = useState(false)
    
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])


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
                        {user ? (
                            <>
                                <MenuItem onclick={() => {}} label="My trips"/>
                                <MenuItem onclick={() => {}} label="My favorites"/>
                                <MenuItem onclick={() => {}} label="My reservations"/>
                                <MenuItem onclick={() => {}} label="My properties"/>
                                <MenuItem onclick={() => {}} label="AirBnb my home"/>
                                <hr/>
                                <MenuItem onclick={logout} label="Logout"/>
                            </>                           
                        ):(
                            <>
                                <MenuItem 
                                    onclick={loginModal.onOpen} 
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