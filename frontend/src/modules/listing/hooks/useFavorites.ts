// hooks/useFavorite.ts
import { useCallback, useEffect, useState } from "react";
import useLoginModal from "@/modules/auth/hooks/useLoginModal";
import { toast } from "sonner";
import { UserType } from "@/modules/auth/types";

interface UseFavoriteProps {
    listingId: string;
    currentUser?: UserType | null;
}

const useFavorite = ({ listingId, currentUser }: UseFavoriteProps) => {
    const loginModal = useLoginModal();
    const [hasFavorited, setHasFavorited] = useState<boolean>(false);

    useEffect(() => {
        setHasFavorited(
            currentUser?.favorite_ids?.includes(listingId) ?? false
        )
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (!currentUser) {
            return loginModal.onOpen();
        }

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
                const data = await response.json()
                setHasFavorited(data.favorited); // 🔥 UI inmediata
            } else {
                // POST
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/`, {
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
                const data = await response.json()
                setHasFavorited(data.favorited); // 🔥 UI inmediata
            }
            toast.success('Correcto!');
        } catch (error) {
            console.error(error);
            toast.error('Algo fue mal!');
        }
    },[currentUser, hasFavorited, listingId, loginModal]);

    return {
        hasFavorited,
        toggleFavorite,
    };
};

export default useFavorite;