import { Container } from "./container"
import { Logo } from "./navbar/logo"
import { Search } from "./navbar/search"
import { UserMenu } from "./navbar/user-menu"

interface NavbarProps {
    currentUser?: any | null
}

export const Navbar = ({currentUser}: NavbarProps) => {
    
    return(
        <nav className="w-full fixed bg-white z-10 shadow-sm">
            <div className="p-4 border-b">
                <Container>
                    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                        <Logo />
                        <Search />
                        <UserMenu currentUser={currentUser} />
                    </div>
                </Container>
            </div>
        </nav>
    )
}