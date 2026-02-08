import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/modules/home/components/navbar";
import { RegisterModal } from "@/modules/home/components/modals/register-modal";
import { Toaster } from "react-hot-toast";
import { LoginModal } from "@/modules/home/components/modals/login-modal";
import { getAuthenticatedUser } from "@/lib/actions";
import { ModalProvider } from "@/provider/modal-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRF + NextJs AirBnb Clone",
  description: "version mejorada de stein con componentes shadCn, tanstack",
};

export default async function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {

  const currentUser = await getAuthenticatedUser()
  
  return (
    <html lang="es">
      <body className={inter.className}>

        <Toaster />
        <ModalProvider />

        <LoginModal />
        <Navbar currentUser = {currentUser}/>

        <div className="pt-24">
          {children}
        </div>
      </body>
    </html>
  );
}
