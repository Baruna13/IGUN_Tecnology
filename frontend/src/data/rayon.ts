/**
 * SPMB 2026/2027 rayon tables for Bogor, from Lampiran II "Pembagian
 * Wilayah/Rayon SPMB 2026" of the Gubernur Jawa Barat Juknis SPMB (Cabang
 * Dinas Wilayah I, rayon A-E; Wilayah II, Kota Bogor). Every kecamatan is
 * "utama" in exactly one rayon; "irisan" kecamatan border that rayon and may
 * apply there as well. Irisan kecamatan outside Bogor are kept only where
 * kecamatan.json has their border.
 */
export interface Rayon {
  name: string;
  utama: string[];
  irisan: string[];
}

export const RAYONS: Rayon[] = [
  {
    name: "Kota Bogor",
    utama: ["Bogor Tengah", "Bogor Utara", "Bogor Timur", "Bogor Barat", "Bogor Selatan", "Tanah Sareal"],
    irisan: [
      "Ciawi", "Sukaraja", "Dramaga", "Ciomas", "Kemang", "Ranca Bungur", "Bojong Gede", "Caringin", "Cijeruk",
      "Tamansari",
    ],
  },
  {
    name: "Kab. Bogor A",
    utama: ["Cibinong", "Citeureup", "Babakan Madang", "Sukaraja"],
    irisan: [
      "Bojong Gede", "Gunung Putri", "Sukamakmur", "Megamendung", "Bogor Utara", "Bogor Timur", "Cipayung", "Tapos",
    ],
  },
  {
    name: "Kab. Bogor B",
    utama: ["Cileungsi", "Gunung Putri", "Klapanunggal", "Jonggol", "Cariu", "Sukamakmur", "Tanjungsari"],
    irisan: ["Citeureup", "Tapos"],
  },
  {
    name: "Kab. Bogor C",
    utama: [
      "Jasinga", "Tenjo", "Cigudeg", "Sukajaya", "Nanggung", "Leuwiliang", "Leuwisadeng", "Parung Panjang",
      "Cibungbulang", "Pamijahan",
    ],
    irisan: ["Ciampea", "Tenjolaya", "Rumpin"],
  },
  {
    name: "Kab. Bogor D",
    utama: [
      "Dramaga", "Ciomas", "Ciampea", "Cijeruk", "Ciawi", "Cisarua", "Cigombong", "Caringin", "Megamendung",
      "Tenjolaya", "Tamansari",
    ],
    irisan: ["Cibungbulang", "Ranca Bungur", "Pamijahan", "Bogor Barat", "Bogor Timur", "Bogor Selatan"],
  },
  {
    name: "Kab. Bogor E",
    utama: ["Bojong Gede", "Tajurhalang", "Parung", "Kemang", "Ranca Bungur", "Ciseeng", "Gunung Sindur", "Rumpin"],
    irisan: [
      "Cibinong", "Parung Panjang", "Ciampea", "Dramaga", "Tanah Sareal", "Bogor Barat", "Bojongsari", "Sawangan",
    ],
  },
];
