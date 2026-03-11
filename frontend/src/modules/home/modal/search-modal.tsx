"use client";

import useSearchModal from "@/modules/auth/hooks/useSearchModal"
import { Modal } from "../components/modals/modal"
import { useMemo, useState } from "react";
import { CountryType } from "@/modules/listing/hooks/useCountries";
import dynamic from "next/dynamic";
import CountrySelect from "@/modules/listing/components/modal/country-select";
import { DateRange } from "react-day-picker";
import { CalendarRange } from "@/modules/listing/components/calendar-range";
import { Counter } from "@/modules/listing/components/modal/Counter";
import { useListingFilters } from "../hooks/use-listing-filter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
}

export const SearchModal = () => {
    const searchModal = useSearchModal()

    const [filters, setFilters] = useListingFilters()

    const [step, setStep] = useState(STEPS.LOCATION)

    const [location, setLocation] = useState<CountryType | null>(null)
    //default londres
    const defaultCenter: [number, number] = [51.505, -0.09]; // Londres por ejemplo
    const center: [number, number] = location?.latlng as [number, number] ?? defaultCenter;
 
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })
    const disabledDates = useMemo(() => {
        let dates: Date[] = []

        return dates
    }, []) //reservations

    const [guestCount, setGuestCount] = useState<number>(1)
    const [roomCount, setRoomCount] = useState<number>(1)
    const [bathRoomCount, setBathRoomCount] = useState<number>(1)
   
    //map's
    const Maps = dynamic(() => import('@/modules/listing/components/modal/maps'), { ssr: false });

    const onBack = () => {
        setStep((value) => value - 1)
    }

    const onNext = async () => {
        setStep((value) => value + 1);
    };

    const onFinalSubmit = () => {
        if (step === STEPS.INFO) {
            setFilters({
            guest: guestCount,
            rooms: roomCount,
            bathrooms: bathRoomCount,
            city: location?.label,
            startDate: dateRange?.from,
            endDate: dateRange?.to,
            })

            searchModal.onClose()
        }
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return "Buscar"
        }
        return "Siguiente"
    }, [step])

    const secundaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined
        }
        return "Volver"
    }, [step])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    ¿Donde te gustaria viajar?
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    Encuentra el sitio perfecto
                </div>
            </div>

            <CountrySelect
                value={location}
                onChange={(country) => setLocation(country)}
            />
            <hr/>
            {<Maps center={center} />} 
        </div>    
    )

    if (step === STEPS.DATE) {
        bodyContent = (
        <div className="flex flex-col gap-8">
            <div className={"text-start"}>
                <div className="text-2xl font-bold">
                    Cuando tienes planeado ir?
                </div>

                <div className="font-light text-neutral-500 mt-2">
                    Asegúrese de que todos los dias no estén ocupados
                </div>
            </div>

            <CalendarRange
                value={dateRange}
                disabledDates={disabledDates}
                onChange={setDateRange}
            />
        </div>  
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <div className={"text-start"}>
                    <div className="text-2xl font-bold">
                        Más información
                    </div>
                    <div className="font-light text-neutral-500 mt-2">
                        Encuentra tu lugar perfecto
                    </div>
                </div>
                <Counter 
                    title="Invitados"
                    subtitle="Cuantos invitados permites"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <hr/>
                <Counter 
                    title="Habitaciones"
                    subtitle="Cuantas habotaciones tienes"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <hr/>
                <Counter 
                    title="Baños"
                    subtitle="Cuantos baños tienes"
                    value={bathRoomCount}
                    onChange={(value) => setBathRoomCount(value)}
                />
            </div>   
        )
    }

    return(
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={step === STEPS.INFO ? onFinalSubmit : onNext}
            title="Filtros"
            actionLabel={actionLabel}
            secondaryActionLabel={secundaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    )
}