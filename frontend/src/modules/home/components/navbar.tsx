import Image from "next/image"
import { Search } from "./navbar/search"
import { UserMenu } from "./navbar/user-menu"
import Link from "next/link"
import { Categories } from "./navbar/categories"

interface NavbarProps {
    currentUser?: any | null
}

export const Navbar = ({currentUser}: NavbarProps) => {
    
    return(
        <nav className="w-full fixed bg-white z-10 shadow-sm">
            <div className="p-4 border-b">
                <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Link href={"/"}>
                            <Image 
                                alt="Logo" 
                                className="hidden md:block cursor-pointer" 
                                height={100} 
                                width={100} 
                                src={"/images/logo.png"}
                            /> 
                        </Link>
                        <Search />
                        <UserMenu currentUser={currentUser} />
                    </div>
                </div>
            </div>
            <Categories />
        </nav>
    )
}