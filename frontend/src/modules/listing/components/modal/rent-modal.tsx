"use client";

import {z} from "zod";
import { Modal } from "@/modules/home/components/modals/modal"
import useRentModal from "../../hooks/useRentModal"
import { useMemo, useState } from "react";
import { categories } from "@/modules/home/components/navbar/categories";
import { CategoryInput } from "./category-input";
import { FieldValues, useForm } from "react-hook-form";
import { listingSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import useCountries, { CountryType } from "../../hooks/useCountries";
import CountrySelect from "./country-select";
import { Counter } from "./Counter";
import { ImageUploads } from "./image-uploads";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { BiEuro } from "react-icons/bi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const fieldsByStep: Record<STEPS, (keyof z.infer<typeof listingSchema>)[]> = {
    [STEPS.CATEGORY]: ["category"],
    [STEPS.LOCATION]: ["location"],
    [STEPS.INFO]: ["guestCount", "roomCount", "bathroomCount"],
    [STEPS.IMAGES]: ["imagesrc"],
    [STEPS.DESCRIPTION]: ["title", "description"],
    [STEPS.PRICE]: ["price"],
};

export const RentModal = () => {    
    const router = useRouter()
    const rentModal = useRentModal()

    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof listingSchema>>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            category: "",      // 👈 CLAVE
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imagesrc: "",
            price: 1,
            title: "",
            description: "",
        },
        shouldUnregister: false,
    });

    const setCustomValue = (id: keyof z.infer<typeof listingSchema>,value: any) => {
        form.setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const fetchRentModal = async (data: z.infer<typeof listingSchema>) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Token ${token}`, // 🔑 CLAVE
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
            toast.success('listado creado!')
            router.refresh()
            //se limpia el formulario
            form.reset()   
            setStep(STEPS.CATEGORY)
            rentModal.onClose()  
        } catch (error) {
            // Manejo de errores de red o conexión
            console.error('Error al enviar datos:', error);
            toast.error('Error al enviar datos:')
        } finally {
            setIsLoading(false)
        }
    }

    const onFinalSubmit = form.handleSubmit((values) => {
        console.log("🔥 SUBMIT FINAL", values);
        fetchRentModal(values)
        setIsLoading(true)
    });

    //default londres
    const defaultCenter: [number, number] = [51.505, -0.09]; // Londres por ejemplo
    
    const category = form.watch("category")
    const location:  CountryType | null = form.watch("location")
    const center: [number, number] = location?.latlng as [number, number] ?? defaultCenter;
    const guestCount = form.watch("guestCount")
    const roomCount = form.watch("roomCount")
    const bathroomCount = form.watch("bathroomCount")
    const imagesrc = form.watch("imagesrc") ?? "";
    const title = form.watch("title") ?? "";
    const description = form.watch("description") ?? "";
    const price = form.watch("price")
   
    //console.log("category / location / guest / room / bath / image / title / description / price", 
    //        category, location, guestCount, roomCount, bathroomCount, imagesrc, title, description, price)

    const Maps = dynamic(() => import('./maps'), { ssr: false });
    //con esta funcion muestro los errores
    const getError = (field: keyof z.infer<typeof listingSchema>): string | null => {
        const error = form.formState.errors[field];
        if (!error) return null;

        // react-hook-form con Zod siempre tiene message como string, pero TypeScript no lo sabe
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
        return null;
    };

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomValue("title", val); // ✅ ACTUALIZA EL FORM

        if (!val.trim()) {
            setError("Este campo es obligatorio");
        } else {
            setError(null);
        }
    };

    const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);

        if (Number.isNaN(val)) return;

        if (val < 1) {
            //setCustomValue("price", 1); // o no setear nada
            return;
        } else {
            setError(null);
        }

        setCustomValue("price", val);
    };

    const onChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setCustomValue("description", val);

        if (!val.trim()) {
            setError("Este campo es obligatorio");
        } else {
            setError(null);
        }
    };

    const onBack = () => {
        setStep((value) => value - 1)
    }

    const onNext = async () => {
        const fields = fieldsByStep[step];
        const isValid = await form.trigger(fields);

        if (!isValid) {
            console.log("❌ Errores:", form.formState.errors);
            return;
        }

        setStep((value) => value + 1);
    };

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Crear"
        }
        return "Siguiente"
    }, [step])

    const secundaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return "Volver"
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    ¿Cuál de estas describe mejor tu lugar?
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    Elige una categoría
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
                {categories.map(item => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput 
                            onClick={(category) => setCustomValue('category', category)}
                            selected = {category === item.label}
                            label = {item.label}
                            icon = {item.icon}
                        />
                    </div>
                ))}
            </div>
            {getError("category") && <p className="mt-2 text-sm text-rose-500">{getError("category")}</p>}
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <div className={"text-start"}>
                    <div className="text-2xl font-bold">
                        ¿Donde esta tu lugar localizado?
                    </div>
                    <div className="font-light text-neutral-500 mt-2">
                        Ayuda a tus invitadas a encontrarte
                    </div>
                </div>

                <CountrySelect
                    value={location}
                    onChange={(country) => setCustomValue("location", country)}
                />
                {getError("location") && <p className="mt-2 text-sm text-rose-500">{getError("location")}</p>}
                {<Maps center={center} />} 
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <div className={"text-start"}>
                    <div className="text-2xl font-bold">
                        Comparte algunos conceptos básicos sobre tu lugar
                    </div>
                    <div className="font-light text-neutral-500 mt-2">
                        ¿Qué comodidades tienes?
                    </div>
                </div>
                <Counter 
                    title="Invitados"
                    subtitle="Cuantos invitados permites"
                    value={guestCount}
                    onChange={(value) => setCustomValue("guestCount", value)}
                />
                <hr/>
                <Counter 
                    title="Habitaciones"
                    subtitle="Cuantas habotaciones tienes"
                    value={roomCount}
                    onChange={(value) => setCustomValue("roomCount", value)}
                />
                <hr/>
                <Counter 
                    title="Baños"
                    subtitle="Cuantos baños tienes"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue("bathroomCount", value)}
                />
            </div>   
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <div className={"text-start"}>
                    <div className="text-2xl font-bold">
                        Añade una foto de tu lugar
                    </div>
                    <div className="font-light text-neutral-500 mt-2">
                        Mostrar al invitado cómo se ve tu lugar
                    </div>
                </div>
                <ImageUploads 
                    value={imagesrc}
                    onChange={(value) => setCustomValue("imagesrc", value)}
                />
                {getError("imagesrc") && <p className="mt-2 text-sm text-rose-500">{getError("imagesrc")}</p>}
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <div className={"text-start"}>
                    <div className="text-2xl font-bold">
                        Como describirias tu lugar?
                    </div>
                    <div className="font-light text-neutral-500 mt-2">
                        Trabajo corto y dulce, el mejor
                    </div>
                </div>

                <div className="w-full">
                    <div className="relative w-full">
                        <Input
                            value={title} // viene del form
                            onChange={onChangeTitle}
                            type="text"
                            disabled={isLoading}
                            placeholder=" "
                            required
                            className={cn(
                                "peer h-14 pt-6 font-light text-black dark:text-white",
                                getError("title")
                                ? "border-rose-500 focus-visible:ring-rose-500"
                                : "border-neutral-300 focus-visible:ring-black"
                            )}
                        />
                        
                        <label
                            className={cn(
                                "absolute left-4 top-4 z-10 origin-left text-sm text-zinc-400",
                                "transform transition-all",
                                "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100",
                                "peer-focus:top-2 peer-focus:scale-75",
                                getError("title") && "text-rose-500"
                            )}
                        >
                            Título
                        </label>
                    </div>
                   
                    {getError("title") && (
                        <p className="mt-1 text-sm text-rose-500">{getError("title")}</p>
                    )}
                </div>

                <div className="w-full">
                    <div className="relative w-full">
                        <Textarea
                            value={description} // viene del form
                            onChange={onChangeDescription}
                            disabled={isLoading}
                            placeholder=" "
                            rows={4}
                            className={cn(
                                "peer resize-none pt-6 font-light text-black dark:text-white",
                                "min-h-24", // altura cómoda
                                getError("description")
                                ? "border-rose-500 focus-visible:ring-rose-500"
                                : "border-neutral-300 focus-visible:ring-black"
                            )}
                        />
                        
                        <label
                            className={cn(
                                "absolute left-4 top-4 z-10 origin-left text-sm text-zinc-400",
                                "transform transition-all",
                                "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100",
                                "peer-focus:top-2 peer-focus:scale-75",
                                getError("description") && "text-rose-500"
                            )}
                        >
                            Descripción
                        </label>
                    </div>
                    
                    {getError("description") && (
                        <p className="mt-1 text-sm text-rose-500">{getError("description")}</p>
                    )}
                </div>

            </div>    
        )    
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <div className={"text-start"}>
                    <div className="text-2xl font-bold">
                        Ahora establece tu precio
                    </div>
                    <div className="font-light text-neutral-500 mt-2">
                        ¿Cuánto cobras por noche?
                    </div>
                </div>

                <div className="w-full">
                    <div className="relative w-full">
                        <BiEuro size={24} className="text-neutral-700 absolute top-5 left-2"/>   
                        <Input
                            value={price} // viene del form
                            onChange={onChangePrice}
                            type="number"
                            disabled={isLoading}
                            placeholder=" "
                            required
                            className={cn(
                                "peer h-14 pt-6 font-light text-black dark:text-white pl-9",
                                getError("price")
                                ? "border-rose-500 focus-visible:ring-rose-500"
                                : "border-neutral-300 focus-visible:ring-black"
                            )}
                        />
                        
                        <label
                            className={cn(
                                "absolute left-4 top-4 z-10 origin-left text-sm text-zinc-400",
                                "transform transition-all",
                                "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100",
                                "peer-focus:top-2 peer-focus:scale-75 left-9",
                                getError("price") && "text-rose-500"
                            )}
                        >
                            Precio
                        </label>
                    </div>

                    {getError("price") && (
                        <p className="mt-1 text-sm text-rose-500">{error}</p>
                    )}
                </div>

            </div>    
        )
    }

    return(
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={step === STEPS.PRICE ? onFinalSubmit : onNext}
            //onSubmit={onNext} //provisional form.handleSubmit(onSubmit)
            title="AirBnb your home"
            actionLabel={actionLabel}
            secondaryActionLabel={secundaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            body={bodyContent}
        />
    )
}