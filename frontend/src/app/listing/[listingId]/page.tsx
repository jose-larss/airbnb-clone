import { EmptyState } from "@/modules/home/components/empty-state";
import {  ListingDetailView } from "@/modules/listing/views/listing-detail-view";

const getListingById = async (listing_id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/listing/${listing_id}/`, {
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

interface Props {
    params: Promise<{
        listingId: string,
    }>
}

const Page = async ({params}: Props) => {
    const {listingId} = await params
    const listing = await getListingById(listingId)

    if (!listing) {
        return <EmptyState
                title= "No hay coincidencias exactas"
                subTitle = "Intente cambiar o eliminar algunos de sus filtros" 
                showReset={true}
        />
    }

    return(
        <>
            <ListingDetailView 
                listing={listing}
            />
        </>
    )
}
export default Page;