import {createLoader, parseAsInteger, parseAsIsoDate, parseAsString, parseAsStringLiteral} from "nuqs/server";

const categories = [
  "Playa","Molinos","Moderno","Campo","Piscina","Islas","Lago","Esquiar","Castillo","Camping","Arctic",
  "Cueva",
  "Desierto",
  "Graneros",
  "Lujo",
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

  city: parseAsString,

  startDate: parseAsIsoDate,
  endDate: parseAsIsoDate
}

export const loadListingFilters = createLoader(params)