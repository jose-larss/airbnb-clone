"use client";

import {useQueryStates, parseAsStringLiteral, parseAsInteger, parseAsString, parseAsIsoDate} from "nuqs";

const categories = [
  "Playa","Molinos","Moderno","Campo","Piscina","Islas","Lago","Esquiar","Castillo","Camping","Arctic","Cueva","Desierto","Graneros","Lujo",
] 

const params = {
  category: parseAsStringLiteral(categories),

  guest: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),

  rooms: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),

  bathrooms: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true }),

  city: parseAsString.withOptions({clearOnDefault: true}),

  startDate: parseAsIsoDate.withOptions({clearOnDefault: true}),
  endDate: parseAsIsoDate.withOptions({clearOnDefault: true})
}

export const useListingFilters = () => {
    return useQueryStates(params, {shallow: false})
}