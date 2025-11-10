"use client";

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";
import { handlelogin } from "@/lib/actions";
import { Modal } from "./modal";
import { Heading } from "../heading";
import { Input } from "../inputs/Input";
import toast from "react-hot-toast";
import { Button } from "../button";
import { useRouter } from "next/navigation";


export const LoginModal = () => {
    const registerModal = useRegisterModal() // hook de registro
    const loginModal = useLoginModal()

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {register, handleSubmit, formState: {errors,}} = useForm<FieldValues>({defaultValues: {
        email: "",
        password: "",
    }})

    const fetchLogin = async (data: FieldValues) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),                
            });
            
            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                const errorData = await response.json();
                console.error('Error en el backend:', errorData);
                // Extrae los mensajes de error en un array
                const messages = Object.values(errorData)
                    .flat() // por si hay arrays dentro (como ["Enter a valid email address."])
                    .join("\n");  // cada mensaje en una línea

                toast.error(messages || "Error desconocido en el servidor", 
                    {style: { whiteSpace: "pre-line" } // importante para que respete los \n}
                });
                return;
            }
            const dataBack = await response.json();
            console.log("dataBack es", dataBack)
            // Si la respuesta es exitosa
            loginModal.onClose()
            toast.success('Login realizado correctamente')
            
            //se setean las cookies
            handlelogin(dataBack.access, dataBack.refresh)
            router.refresh()
            //return response.json();
            
        } catch (error) {
            // Manejo de errores de red o conexión
            console.error('Error al enviar datos:', error);
            toast.error('Error al enviar datos:')
        } finally {
            setIsLoading(false)
        }
    }
    
    const onSubmit = async (data: FieldValues) => {
        setIsLoading(true)
  
        //llamada a api de registro
        fetchLogin(data)
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome back"
                subtitle="Login to your account!"
            />
            <Input 
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            <Button 
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onclick={() => {}}
            />
            <Button 
                outline
                label="Continue with GitHub"
                icon={AiFillGithub}
                onclick={() => {}}
            />
            <div className="text-neutral-500 items-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div >
                        Already do not have an account?.
                    </div>

                    <div
                        onClick={registerModal.onOpen} 
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Register.
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal 
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}