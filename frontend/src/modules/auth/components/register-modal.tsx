"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdClose } from "react-icons/io";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useRegisterModal from "../hooks/useRegisterModal";
import useLoginModal from "../../home/hooks/useLoginModal";

import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { registerSchema } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


export const RegisterModal = () => {
    const registerModal = useRegisterModal() // hook de registro
    const loginModal = useLoginModal()

    const [isLoading, setIsLoading] = useState(false)

    // Animación de apertura/cierre
    const [showModal, setShowModal] = useState(registerModal.isOpen);

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        }
    })

    useEffect(() => {
        setShowModal(registerModal.isOpen);
    }, [registerModal.isOpen]);

    const handleClose = useCallback(() => {
        if (isLoading) return;

        setShowModal(false);
        setTimeout(() => {
            registerModal.onClose();
        }, 300);
    }, [isLoading, registerModal]);
    
    const handleCambio = () => {
        registerModal.onClose()
        loginModal.onOpen()
    }

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        fetchRegister(values)
    }

    const fetchRegister = async (data: z.infer<typeof registerSchema>) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),                
            });
            
            if (!response.ok) {
                // Manejo de errores si el backend devuelve un estado no exitoso
                const errorData = await response.json();
                //console.error('Error en el backend:', errorData);
                // Extrae los mensajes de error en un array
                const messages = Object.values(errorData)
                    .flat() // por si hay arrays dentro (como ["Enter a valid email address."])
                    .join("\n");  // cada mensaje en una línea

                toast.error(messages || "Error desconocido en el servidor", 
                    {style: { whiteSpace: "pre-line" } // importante para que respete los \n}
                });
                return;
                
            }
            // Si la respuesta es exitosa
            registerModal.onClose()
            toast.success('Registro de usuario realizado correctamente')
            //se limpia el formulario
            form.reset()
            //return response.json();
            
        } catch (error) {
            // Manejo de errores de red o conexión
            console.error('Error al enviar datos:', error);
            toast.error('Error al enviar datos:')
        } finally {
            setIsLoading(false)
        }
    }

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
            <Button 
                className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full"
                variant={"airBnbOutline"}
                size={"airBnbDefault"}
                onClick={() => {}}
            >
                <FcGoogle className="h-14 w-14 absolute left-4 top-4"/> Continue with Google
            </Button>
            <Button 
                className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full"
                variant={"airBnbOutline"}
                size={"airBnbDefault"}
                onClick={() => {}}
            >
                <AiFillGithub className="h-14 w-14 absolute left-4 top-4"/> Continue with GitHub
            </Button>
            <div className="text-neutral-500 items-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div >
                        Ya tienes una cuenta?.
                    </div>

                    <div
                        onClick={() => handleCambio()} 
                        className="text-neutral-800 cursor-pointer hover:underline">
                        Log in.
                    </div>
                </div>
            </div>
        </div>
    )

    // 🔴 EXACTAMENTE IGUAL QUE Modal.tsx
    if (!registerModal.isOpen) {
        return null;
    }

    return (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
            <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
                <div
                    className={cn(
                        "translate duration-300 h-full",
                        showModal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    )}
                >
                    <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* HEADER */}
                        <div className="flex items-center p-6 rounded-t justify-center relative border-b">
                            <button
                                onClick={handleClose}
                                className="p-1 border-0 hover:opacity-70 transition absolute left-9 cursor-pointer"
                            >
                                <IoMdClose size={18} />
                            </button>
                            <div className="text-lg font-semibold">Registro</div>
                        </div>
                        {/* BODY */}

                        <Form {...form}>
                            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="relative p-6 flex-auto">
                                    
                                    <div className="flex flex-col gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">
                                                Bienvenido a AirBnb
                                            </div>

                                            <div className="font-light text-neutral-500 mt-2">
                                                Crea una cuenta!
                                            </div>
                                        </div>            

                                        <div className="w-full relative space-y-4">
                                            <FormField
                                                name="email"
                                                rules={{ required: "este campo es obligatorio" }}
                                                render={({ field, fieldState }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative w-full">

                                                            <Input
                                                                {...field}
                                                                type="email"
                                                                disabled={isLoading}
                                                                placeholder=" "
                                                                className={cn("peer h-14 pt-6 font-light",
                                                            
                                                                fieldState.error
                                                                    ? "border-rose-500 focus-visible:ring-rose-500"
                                                                    : "border-neutral-300 focus-visible:ring-black"
                                                                )}
                                                            />

                                                            <label
                                                                className={cn(
                                                                    "absolute top-4 z-10 origin-left text-sm text-zinc-400",
                                                                    "left-4 transform transition-all",
                                                                    "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100",
                                                                    "peer-focus:top-2 peer-focus:scale-75",
                                                            
                                                                    fieldState.error && "text-rose-500"
                                                                    )}
                                                            >
                                                                Email
                                                            </label>
                                                        </div>
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                                                
                                            <FormField
                                                name="username"
                                                rules={{ required: "este campo es obligatorio" }}
                                                render={({ field, fieldState }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative w-full">

                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                disabled={isLoading}
                                                                placeholder=" "
                                                                className={cn("peer h-14 pt-6 font-light",
                                                            
                                                                fieldState.error
                                                                    ? "border-rose-500 focus-visible:ring-rose-500"
                                                                    : "border-neutral-300 focus-visible:ring-black"
                                                                )}
                                                            />

                                                            <label
                                                                className={cn(
                                                                    "absolute top-4 z-10 origin-left text-sm text-zinc-400",
                                                                    "left-4 transform transition-all",
                                                                    "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100",
                                                                    "peer-focus:top-2 peer-focus:scale-75",
                                                            
                                                                fieldState.error && "text-rose-500"
                                                                )}
                                                            >
                                                                Username
                                                            </label>
                                                        </div>
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />

                                            <FormField
                                                name="password"
                                                rules={{ required: "este campo es obligatorio" }}
                                                render={({ field, fieldState }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative w-full">

                                                            <Input
                                                                {...field}
                                                                type="password"
                                                                disabled={isLoading}
                                                                placeholder=" "
                                                                className={cn("peer h-14 pt-6 font-light",
                                                            
                                                                fieldState.error
                                                                    ? "border-rose-500 focus-visible:ring-rose-500"
                                                                    : "border-neutral-300 focus-visible:ring-black"
                                                                )}
                                                            />

                                                            <label
                                                                className={cn(
                                                                    "absolute top-4 z-10 origin-left text-sm text-zinc-400",
                                                                    "left-4 transform transition-all",
                                                                    "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100",
                                                                    "peer-focus:top-2 peer-focus:scale-75",
                                                            
                                                                    fieldState.error && "text-rose-500"
                                                                    )}
                                                            >
                                                                Password
                                                            </label>
                                                        </div>
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />                   
                                        </div>
                                    </div>
                                </div>
                                {/* FOOTER */}
                                <div className="flex flex-col gap-2 p-6">
                                    <div className="flex flex-row items-center gap-4 w-full">
                                        {/*secondaryAction && secondaryActionLabel && (
                                            <Button outline disabled={disabled} label={secondaryActionLabel} onclick={handleSecondaryAction}/>
                                        )*/}
                                        
                                        <Button
                                            type="submit"
                                            className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full cursor-pointer" 
                                            variant="airBnb"
                                            size="airBnbDefault"
                                            disabled={isLoading} 
                                        >
                                            Continuar
                                        </Button>
                                    </div>
                                    {footerContent}
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}