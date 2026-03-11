//export const dynamic = "force-dynamic";

import { EmptyState } from "@/modules/home/components/empty-state";
import { loadListingFilters } from "@/modules/home/hooks/search-params";
import ListingView from "@/modules/listing/views/listing-view";
import { SearchParams } from "nuqs";

const getListings = async (filters: any) => {

    const params = new URLSearchParams()

    if (filters.category) params.append("category", filters.category)
    if (filters.guest) params.append("guest", filters.guest)
    if (filters.rooms) params.append("rooms", filters.rooms)
    if (filters.bathrooms) params.append("bathrooms", filters.bathrooms)
    if (filters.city) params.append("city", filters.city)
    if (filters.startDate) params.append("startDate", filters.startDate.toISOString())
    if (filters.endDate) params.append("endDate", filters.endDate.toISOString())

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/listings/?${params.toString()}`, {
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store"
        });

        if (!response.ok) {
            const errorData = await response.json()
            console.log(errorData)
            return errorData;
        }

        const data = await response.json();
        return data
    } catch (err) {
        console.error("Error al obtener listado:", err);
    } 
};

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({searchParams}: Props) => {
    const filters = await loadListingFilters(searchParams)
    const listings = await getListings(filters)

    if (!listings || listings.length === 0) {
        return(
            <EmptyState
                title= "No hay coincidencias exactas"
                subTitle = "Intente cambiar o eliminar algunos de sus filtros" 
                showReset={true}
            />
        )
    }

    return(<ListingView listings={listings}/>)
}
export default Page;