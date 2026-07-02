export const WHATSAPP_NUMBER = "62811236726";
export const WA_ORDER = "Halo anana, saya ingin memesan produk Super Oksigen.";
export const WA_MITRA = "Halo anana, saya ingin konsultasi kemitraan/distributor.";

export const SOCIALS = {
  instagram: "https://instagram.com/anana.superoksigen_distributor",
  tiktok: "https://www.tiktok.com/@anana.superoksigen_distributor",
};

export const PRINCIPAL = {
  site: "https://anana.nanooxywater.com",
  entity: "PT. Nano Oxywater Internasional",
  instagram: "https://instagram.com/ananasuperoksigen",
  tiktok: "https://www.tiktok.com/@ananasuperoxygen",
};

export const DISTRIBUTOR = {
  entity: "PT. Sumilir",
  role: "Brand Owner & Regional Master Distributor",
  regNumber: "NOWI/AMDK-DIST/2026/0002",
};

export const TERRITORY = "Jakarta, Depok & Bandung";

export function waLink(msg: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? null;
export const META_PIXEL = process.env.NEXT_PUBLIC_META_PIXEL ?? null;
