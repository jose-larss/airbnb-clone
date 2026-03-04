import { UserType } from "../auth/types"


export type ReservationType = {
    id: string,
    listing: string, 
    user: string, 
    start_date: string,
    end_date: string,
    created_at: string,
    updated_at: string,
    total_price: number,
}


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