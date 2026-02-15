import Image from "next/image"
import { Search } from "./search"
import { UserMenu } from "./user-menu"
import Link from "next/link"
import { Categories } from "./categories"



export const Navbar = () => {
    
    return(
        <nav className="w-full fixed bg-white z-10 shadow-sm">
            <div className="p-4 border-b">
                <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Link href={"/"}>
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                width={120}
                                height={40}
                                loading="eager"
                                style={{ width: "100px", height: "auto" }} // mantiene proporción
                            />
                        </Link>
                        <Search />
                        <UserMenu />
                    </div>
                </div>
            </div>
            <Categories />
        </nav>
    )
}