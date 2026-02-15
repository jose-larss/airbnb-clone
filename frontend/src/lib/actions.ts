"use client";

import { useRouter } from "next/navigation";


export const getAuthenticatedUser = async () => {
    const router = useRouter()

    try {
        const token = localStorage.getItem("token"); // token de Djoser
        if (!token) {
            router.push("/sign-in");
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`, // Djoser TokenAuthentication
            },
        });

        if (!response.ok) {
            // token inválido o sesión expirada
            localStorage.removeItem("token"); // limpiar token inválido
            router.push("/sign-in");
            return;
        }

        const data = await response.json();
        return data
    } catch (err) {
        console.error("Error al obtener usuario:", err);
        router.push("/sign-in");
    } 
};
    



