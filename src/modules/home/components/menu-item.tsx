"use client";

interface MenuItemProps {
    onclick: () => void;
    label: string
}

export const MenuItem = ({onclick, label}: MenuItemProps) => {
    return(
        <div
            onClick={onclick} 
            className="px-4 py-3 hover:bg-neutral-100 transition font-semibold">
            {label}
        </div>
    )
} 