"use server";

import { cookies } from "next/headers";
import toast from "react-hot-toast";


/**
 * Obtiene el usuario actualmente autenticado desde el backend Django,
 * usando el access token guardado en cookies HttpOnly.
 */
export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("session_access_token")?.value;

  if (!accessToken) {
    return null; // No hay token, no hay usuario autenticado
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // evita respuestas cacheadas
    });

    if (!res.ok) {
        // Si el token expiró o es inválido, podrías aquí refrescarlo si quieres
        // Manejo de errores si el backend devuelve un estado no exitoso
        console.error("Error al obtener el usuario:", res.status);
        return null;
    }

    const user = await res.json();
    return user;

  } catch (error) {
    console.error("Fallo al conectar con el backend:", error);
    toast.error('Fallo al conectar con el backend')
    return null;
  }
}


export async function handlelogin( accessToken: string, refreshToken: string) { //userId: string,
    /*
    cookies().set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, //One week
        path: '/'
    })
    */
    const cookieStore = await cookies();

    cookieStore.set("session_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hora
        path: "/",
    });

    cookieStore.set("session_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: "/",
    });

}

export async function ressetAuthCookies () {
    const cookieStore = await cookies();

    //cookieStore.set('session_userid', '');
    cookieStore.set('session_access_token', '');
    cookieStore.set('session_refresh_token', '');
}