export type Category = "burgers" | "porcoes" | "bebidas" | "adicionais";

export interface MenuItem {
  id: string;
  name: string;
  desc?: string;
  price: number; // em reais
  category: Category;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "burgers", label: "Burgers" },
  { id: "porcoes", label: "Porções" },
  { id: "bebidas", label: "Bebidas" },
  { id: "adicionais", label: "Adicionais" },
];

export const MENU: MenuItem[] = [
  // ---------- BURGERS ----------
  {
    id: "feron",
    name: "Feron Burger",
    desc: "Pão brioche, burger defumado 160g, cheddar, bacon, cebola caramelizada e molho especial.",
    price: 35,
    category: "burgers",
  },
  {
    id: "giga",
    name: "Giga Burger",
    desc: "Pão brioche, duplo burger defumado 160g, duplo cheddar, duplo bacon, alface, tomate e molho especial.",
    price: 48,
    category: "burgers",
  },
  {
    id: "tradicional",
    name: "Tradicional Burger",
    desc: "Pão brioche, burger defumado 160g, cheddar, alface, tomate e molho especial.",
    price: 28,
    category: "burgers",
  },
  {
    id: "tropical",
    name: "Tropical Burger",
    desc: "Pão brioche, burger defumado 160g, cheddar, bacon, abacaxi, alface e molho especial.",
    price: 32,
    category: "burgers",
  },
  {
    id: "banana",
    name: "Banana Burger",
    desc: "Pão brioche, burger defumado 160g, cheddar, bacon, banana da terra, cebola roxa ao mel e molho especial.",
    price: 34,
    category: "burgers",
  },
  {
    id: "mumu",
    name: "Mumu Burger",
    desc: "Pão brioche, burger defumado 160g, provolone, bacon em cubos e doce de leite.",
    price: 36,
    category: "burgers",
  },

  // ---------- PORÇÕES ----------
  { id: "batata-p", name: "Batata Pequena 120g", price: 8, category: "porcoes" },
  {
    id: "batata-p-doce",
    name: "Batata Pequena + Doce de Leite 120g",
    price: 10,
    category: "porcoes",
  },
  {
    id: "batata-flamb-p",
    name: "Batata Flambada P 120g",
    desc: "Cheddar e bacon.",
    price: 14,
    category: "porcoes",
  },
  { id: "batata-g", name: "Batata Grande 400g", price: 22, category: "porcoes" },
  {
    id: "batata-g-doce",
    name: "Batata Grande + Doce de Leite 400g",
    price: 28,
    category: "porcoes",
  },
  {
    id: "batata-flamb-g",
    name: "Batata Flambada G 400g",
    desc: "Cheddar e bacon.",
    price: 40,
    category: "porcoes",
  },
  { id: "anel", name: "Anel de Cebola 120g", price: 7, category: "porcoes" },
  {
    id: "batata-anel",
    name: "Batata Flambada c/ Anel de Cebola 400g",
    price: 46,
    category: "porcoes",
  },

  // ---------- BEBIDAS ----------
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    desc: "Coca, Coca Zero, Guaraná, Guaraná Zero, Schweppes ou Sprite.",
    price: 8,
    category: "bebidas",
  },
  {
    id: "refri-1l",
    name: "Refrigerante 1L",
    desc: "Coca, Coca Zero ou Guaraná.",
    price: 13,
    category: "bebidas",
  },
  {
    id: "refri-15l",
    name: "Refrigerante 1,5L",
    desc: "Guaraná.",
    price: 15,
    category: "bebidas",
  },
  {
    id: "refri-2l",
    name: "Refrigerante 2L",
    desc: "Coca, Coca Zero ou Guaraná.",
    price: 18,
    category: "bebidas",
  },
  { id: "limoneto", name: "Limoneto", price: 10, category: "bebidas" },
  {
    id: "delvalle",
    name: "Suco Del Valle",
    desc: "Uva ou maracujá.",
    price: 8,
    category: "bebidas",
  },
  {
    id: "polpa",
    name: "Suco de Polpa",
    desc: "Maracujá, cajá, cupuaçu ou goiaba.",
    price: 10,
    category: "bebidas",
  },
  { id: "agua", name: "Água sem gás", price: 4, category: "bebidas" },
  { id: "agua-gas", name: "Água com gás", price: 5, category: "bebidas" },
  { id: "antarctica", name: "Cerveja Antártica", price: 5, category: "bebidas" },
  { id: "amstel", name: "Cerveja Amstel", price: 6, category: "bebidas" },
  { id: "original", name: "Cerveja Original", price: 6, category: "bebidas" },
  { id: "heineken", name: "Cerveja Heineken", price: 7, category: "bebidas" },

  // ---------- ADICIONAIS ----------
  { id: "add-burg160", name: "Hambúrguer 160g", price: 10, category: "adicionais" },
  { id: "add-burg220", name: "Hambúrguer 220g", price: 15, category: "adicionais" },
  { id: "add-bacon", name: "Bacon", price: 5, category: "adicionais" },
  { id: "add-cheddar", name: "Cheddar", price: 3, category: "adicionais" },
  { id: "add-provolone", name: "Provolone", price: 4, category: "adicionais" },
  { id: "add-cebola-car", name: "Cebola Caramelizada", price: 4, category: "adicionais" },
  { id: "add-cebola-mel", name: "Cebola Roxa ao Mel", price: 3, category: "adicionais" },
  { id: "add-anel", name: "Anel de Cebola", price: 4, category: "adicionais" },
  { id: "add-doce", name: "Doce de Leite", price: 6, category: "adicionais" },
  { id: "add-alface", name: "Alface", price: 2, category: "adicionais" },
  { id: "add-tomate", name: "Tomate", price: 2, category: "adicionais" },
  { id: "add-abacaxi", name: "Abacaxi", price: 4, category: "adicionais" },
  { id: "add-banana", name: "Banana da Terra", price: 4, category: "adicionais" },
  { id: "add-picles", name: "Picles", price: 4, category: "adicionais" },
];

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Palavras "saborosas" destacadas em âmbar nos cards (sinestesia).
const FLAVOR_WORDS = [
  "defumado",
  "provolone",
  "doce de leite",
  "bacon em cubos",
  "cebola caramelizada",
  "cebola roxa ao mel",
  "banana da terra",
  "cheddar",
  "abacaxi",
  "molho especial",
];

export function highlightFlavors(text: string): { text: string; flavor: boolean }[] {
  const pattern = new RegExp(`(${FLAVOR_WORDS.join("|")})`, "gi");
  const lower = new Set(FLAVOR_WORDS.map((w) => w.toLowerCase()));
  return text
    .split(pattern)
    .filter((p) => p.length > 0)
    .map((p) => ({ text: p, flavor: lower.has(p.toLowerCase()) }));
}
