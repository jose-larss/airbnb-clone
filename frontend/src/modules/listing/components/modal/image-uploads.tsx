"use client";

import { useState } from "react";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadsProps {
    value: string;
    onChange: (value: string) => void;
}

export const ImageUploads = ({ value, onChange }: ImageUploadsProps) => {
    const [localValue, setLocalValue] = useState(value);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "airbnb_unsigned"); // tu preset
      
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
         
            if (data.secure_url) {
                    setLocalValue(data.secure_url);
                    onChange(data.secure_url);
            }
        } catch (err) {
                console.error("Upload error:", err);
        } finally {
                setLoading(false);
        }
    };

  return (
        <div
            className="
                relative cursor-pointer hover:opacity-80 transition
                border-dashed border-2 border-neutral-300
                flex flex-col justify-center items-center gap-4
                text-neutral-600 h-[300px]
            "
        >
            {/* Input file invisible cubriendo toda la caja */}
            <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleUpload}
            />

            {/* Contenido cuando no hay imagen */}
            {!localValue && (
                <>
                <TbPhotoPlus size={50} />
                {loading ? <div>Cargando...</div> : <div className="font-semibold text-xl">Click to upload</div>}
                </>
            )}

            {/* Contenido cuando hay imagen */}
            {localValue && (
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        alt="uploaded"
                        src={localValue}
                        fill
                        className="object-cover rounded-md"
                    />
                    {/* Overlay opcional para indicar que se puede cambiar */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center 
                        opacity-0 hover:opacity-100 text-white font-semibold transition">
                            Click para cambiar
                    </div>
                </div>
            )}
        </div>
    );
};