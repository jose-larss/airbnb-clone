// hooks/useFavorite.ts
import { useCallback, useMemo } from "react";
import useLoginModal from "@/modules/auth/hooks/useLoginModal";
import { toast } from "sonner";
import { useAuthStore } from "@/modules/store/auth-store";

interface UseFavoriteProps {
    listingId: string;
}

const useFavorite = ({ listingId }: UseFavoriteProps) => {
    const hasFavorited =
        useAuthStore((state) =>
        state.user?.favorite_ids?.includes(listingId)
        ) ?? false;
    
    //const user = useAuthStore((state) => state.user);
    const updateFavorites = useAuthStore((state) => state.updateFavorites)

    const loginModal = useLoginModal();
    /*
    const hasFavorited = useMemo(() => {
        return user?.favorite_ids?.includes(listingId) ?? false;
    }, [user, listingId]);
    */
   
    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        //if (!user) {
        //    return loginModal.onOpen();
        //}

        const currentUser = useAuthStore.getState().user;
        if (!currentUser) return loginModal.onOpen();

        const token = localStorage.getItem('token');
        try {
            if (hasFavorited) {
                // DELETE
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${listingId}/remove/`, {
                    method: 'DELETE',
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    // Manejo de errores si el backend devuelve un estado no exitoso
                    throw new Error("Error al eliminar favorito");
                }   
                updateFavorites(listingId, false)
            } else {
                // POST
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/add/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({listing_id: listingId}),
                });

                if (!response.ok) {
                    // Manejo de errores si el backend devuelve un estado no exitoso  
                    throw new Error("Error al actualizar favorito");
                }
                updateFavorites(listingId, true)
            }
            toast.success('Correcto!');

        } catch (error) {
            console.error(error);
            toast.error('Algo fue mal!');
        }
    },[hasFavorited, listingId, loginModal, updateFavorites]); //user

    return {
        hasFavorited,
        toggleFavorite,
    };
};

export default useFavorite;