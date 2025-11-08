"use client";

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRegisterModal from "../../hooks/useRegisterModal";
import { Modal } from "./modal";
import { Heading } from "../heading";
import { Input } from "../inputs/Input";
import toast from "react-hot-toast";
import { Button } from "../button";

export const RegisterModal = () => {
    const registerModal = useRegisterModal() // hook de registro
    const [isLoading, setIsLoading] = useState(false)

    const {register, handleSubmit, formState: {errors,}} = useForm<FieldValues>({defaultValues: {
        name: "",
        email: "",
        password: "",
    }})

    const fetchRegister = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/`, {
                method: 'POST',
                credentials: 'include', // 👈 Esto es lo importante
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                const errorData = await response.json();
                console.error('Error en el backend:', errorData);
                return;
            }
            // Si la respuesta es exitosa
            registerModal.onClose()
            return response.json();
            
        } catch (error) {
            // Manejo de errores de red o conexión
            console.error('Error al enviar datos:', error);
            toast.error('Error al enviar datos:')
        } finally {
            setIsLoading(false)
        }
    }
    

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        console.log(data)
        //llamada a api de registro
        fetchRegister()
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to AirBnb"
                subtitle="Create an Account!"
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
                id="name"
                label="Name"
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
                        Already have an account?.
                    </div>

                    <div
                        onClick={registerModal.onClose} 
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Log in.
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal 
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}