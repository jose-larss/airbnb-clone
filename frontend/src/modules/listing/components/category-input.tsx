import { cn } from "@/lib/utils"
import { IconType } from "react-icons"


interface CategoryInputProps {
    onClick: (value: string) => void
    selected: boolean
    label: string
    icon: IconType
}

export const CategoryInput = ({onClick, selected, label, icon: Icon}: CategoryInputProps) => {
    return(
        <div
            onClick={() => onClick(label)}
            className={cn(
                `rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer`,
                selected ? "border-black" : "border-neutral-200"
            )}
        >
            <Icon size={18} />
            <div className="font-semibold">
                {label}
            </div>
        </div>
    )
}