import Image from "next/image"

export const Avatar = () => {
    return(
        <Image src={"/images/placeholder.png"} className="rounded-full" height={30} width={30} alt="Avatar" />
    )
}