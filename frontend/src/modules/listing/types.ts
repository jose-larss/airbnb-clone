import { UserType } from "../auth/types"

export type ListingsType = {
    id: string,
    title: string, 
    description: string, 
    image: string, 
    category: string, 
    room_count: number, 
    bathroom_count: number, 
    guest_count: number, 
    location_value: string, 
    price: number, 
    user: UserType,
    created_at: string, 
    updated_at: string,
}