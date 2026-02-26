import { EmptyState } from "@/modules/home/components/empty-state";
import ListingView from "@/modules/listing/views/listing-view";


const getListings = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/listings/`, {
            headers: {
                "Content-Type": "application/json",
            },
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

export default async function Home() {
    const listings = await getListings()

    console.log(listings)

    if (listings.length === 0) {
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
