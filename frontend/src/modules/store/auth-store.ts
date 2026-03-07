import { create } from "zustand"
import { UserType } from "../auth/types"


interface AuthState {
    user: UserType | null
    loading: boolean
    refreshUser: () => Promise<void>
    //login: (token: string) => Promise<void>
    logout: () => Promise<void>
    updateFavorites: (listingId: string, favorited: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    refreshUser: async () => {
        const token = localStorage.getItem("token")            

        if (!token) {
            set({ user: null, loading: false })
            return
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
                headers: { 
                    Authorization: `Token ${token}` 
                },
            })
            if (!res.ok) throw new Error("No auth")

            const data = await res.json()
            set({ user: data, loading: false })
        } catch {
            set({ user: null, loading: false })
        }
    },
    /*
    login: async (token: string) => {
        //localStorage.setItem("token", token)
        await useAuthStore.getState().refreshUser()
    },
    */
    updateFavorites: (listingId, favorited) =>
        set((state) => {
            if (!state.user) return state

            let newFavorites = [...(state.user.favorite_ids || [])]

            if (favorited) {
                newFavorites.push(listingId)
            } else {
                newFavorites = newFavorites.filter((id) => id !== listingId)
            }

            return {
                user: {
                    ...state.user,
                    favorite_ids: newFavorites,
                },
            }
        }),

    logout: async () => {
        try {
            const token = localStorage.getItem("token")
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/logout/`, {
                    method: "POST",
                    headers: { 
                        Authorization: `Token ${token}` 
                    },
                })
            }
        } finally {
            localStorage.removeItem("token")
            set({ user: null })
        }
    },
}))
