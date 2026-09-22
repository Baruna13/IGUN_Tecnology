export interface AddressSuggestion {
  label: string;
  coordinates: [number, number];
}

/**
 * Small placeholder address book standing in for a real geocoder
 * (e.g. Nominatim/OSM or a paid geocoding API). Swap this for a live
 * `/api/geocode` call once the backend is wired in.
 */
export const ADDRESS_SUGGESTIONS: AddressSuggestion[] = [
  { label: "Jl. Pangrango No. 14, Bogor Tengah", coordinates: [106.7975, -6.5951] },
  { label: "Jl. Malabar No. 22, Babakan", coordinates: [106.7908, -6.6003] },
  { label: "Jl. Sudirman No. 5, Tanah Sareal", coordinates: [106.7861, -6.5891] },
  { label: "Jl. Pajajaran No. 88, Bantarjati", coordinates: [106.8034, -6.5847] },
  { label: "Jl. Raya Ciomas No. 3, Ciomas", coordinates: [106.7852, -6.6162] },
  { label: "Jl. Surya Kencana No. 40, Gudang", coordinates: [106.7911, -6.6067] },
  { label: "Jl. Achmad Adnawijaya, Tegallega", coordinates: [106.7822, -6.6091] },
  { label: "Jl. Kayu Manis, Bondongan", coordinates: [106.7951, -6.6119] },
];
