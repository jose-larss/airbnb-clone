import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";

import { Navbar } from "@/modules/home/components/navbar/navbar";
import { RegisterModal } from "@/modules/auth/components/register-modal";
import { Toaster } from "@/components/ui/sonner";
import { LoginModal } from "@/modules/auth/components/login-modal";
import { getAuthenticatedUser } from "@/lib/actions";

import { Providers } from "@/modules/home/provider/provider";


const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRF + NextJs AirBnb Clone antonio",
  description: "version mejorada de antonio con componentes shadCn, tanstack",
};

export default async function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">
      <body className={nunito.className}>

        <Toaster
          position="top-right"      // posición global por defecto
          richColors                 // usa colores automáticos según tipo
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: "18px",
              padding: "12px 20px",
              maxWidth: "350px",
            },
          }}
        />

        <LoginModal />
        <RegisterModal/>

        <Providers>
            <div className="pt-24">
                {children}
            </div>
        </Providers>
      </body>
    </html>
  );
}
