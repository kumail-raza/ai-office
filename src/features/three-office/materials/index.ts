import { DoubleSide, MeshStandardMaterial } from "three";

/**
 * The office's material vocabulary. Every surface in the scene picks a preset
 * from here — components never construct their own material, so the whole room
 * can be re-graded (walnut → oak, brass → chrome) from this one file.
 *
 * Palette direction: a luxury executive suite — walnut and brass against warm
 * greige walls, deep leather, and brushed steel.
 */
export enum MaterialKind {
  /* Structure */
  Floor = "floor",
  FloorInlay = "floor-inlay",
  Wall = "wall",
  WallTrim = "wall-trim",
  Ceiling = "ceiling",

  /* Furniture */
  Wood = "wood",
  WoodDark = "wood-dark",
  Metal = "metal",
  MetalDark = "metal-dark",
  Brass = "brass",
  Leather = "leather",
  Fabric = "fabric",
  Rug = "rug",

  /* Props */
  Glass = "glass",
  GlassSky = "glass-sky",
  Monitor = "monitor",
  MonitorBezel = "monitor-bezel",
  Paper = "paper",
  Ceramic = "ceramic",
  Leaf = "leaf",
  LeafDark = "leaf-dark",
  Terracotta = "terracotta",
  LampGlow = "lamp-glow",

  /* Backdrop */
  SkyFar = "sky-far",
  CityFar = "city-far",
  CityNear = "city-near",

  /* UI affordance */
  Highlight = "highlight",
}

interface MaterialRecipe {
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  doubleSide?: boolean;
}

const RECIPES: Record<MaterialKind, MaterialRecipe> = {
  /* Structure — warm, matte, low-contrast so furniture reads as the subject. */
  [MaterialKind.Floor]: { color: "#6b4f38", roughness: 0.62, metalness: 0.04 },
  [MaterialKind.FloorInlay]: { color: "#4e3928", roughness: 0.55 },
  [MaterialKind.Wall]: { color: "#d9d2c6", roughness: 0.96 },
  [MaterialKind.WallTrim]: { color: "#c3b9a8", roughness: 0.85 },
  [MaterialKind.Ceiling]: { color: "#e6e1d7", roughness: 1 },

  /* Furniture */
  [MaterialKind.Wood]: { color: "#7a5638", roughness: 0.5, metalness: 0.05 },
  [MaterialKind.WoodDark]: { color: "#4d3524", roughness: 0.55 },
  [MaterialKind.Metal]: { color: "#9aa3af", roughness: 0.34, metalness: 0.78 },
  [MaterialKind.MetalDark]: { color: "#3b4149", roughness: 0.42, metalness: 0.7 },
  [MaterialKind.Brass]: { color: "#c9a86a", roughness: 0.28, metalness: 0.88 },
  [MaterialKind.Leather]: { color: "#4a3a30", roughness: 0.62, metalness: 0.06 },
  [MaterialKind.Fabric]: { color: "#39434f", roughness: 0.9 },
  [MaterialKind.Rug]: { color: "#3c3a42", roughness: 1 },

  /* Props */
  [MaterialKind.Glass]: {
    color: "#cfe0ee",
    roughness: 0.08,
    metalness: 0.1,
    transparent: true,
    opacity: 0.28,
  },
  [MaterialKind.GlassSky]: {
    color: "#cddff0",
    roughness: 0.12,
    emissive: "#bcd6ee",
    emissiveIntensity: 0.55,
    transparent: true,
    opacity: 0.45,
  },
  [MaterialKind.Monitor]: {
    color: "#0d1017",
    roughness: 0.24,
    emissive: "#8fb6e8",
    emissiveIntensity: 0.4,
  },
  [MaterialKind.MonitorBezel]: { color: "#16191f", roughness: 0.45, metalness: 0.3 },
  [MaterialKind.Paper]: { color: "#f4efe4", roughness: 0.9 },
  [MaterialKind.Ceramic]: { color: "#ebe6dc", roughness: 0.45 },
  [MaterialKind.Leaf]: { color: "#4a7c59", roughness: 0.8 },
  [MaterialKind.LeafDark]: { color: "#39604a", roughness: 0.82 },
  [MaterialKind.Terracotta]: { color: "#a75f3e", roughness: 0.8 },
  [MaterialKind.LampGlow]: {
    color: "#f6e3c0",
    roughness: 0.5,
    emissive: "#f0cf95",
    emissiveIntensity: 1.5,
  },

  /* Backdrop — unlit-ish so the view outside reads as far away. */
  [MaterialKind.SkyFar]: {
    color: "#b9cfe4",
    roughness: 1,
    emissive: "#b9cfe4",
    emissiveIntensity: 0.55,
    doubleSide: true,
  },
  [MaterialKind.CityFar]: { color: "#95a9bd", roughness: 1, emissive: "#8fa3b8", emissiveIntensity: 0.18 },
  [MaterialKind.CityNear]: { color: "#7c8ea3", roughness: 1, emissive: "#748699", emissiveIntensity: 0.12 },

  /* Selection ring — brass, matching the app's accent. */
  [MaterialKind.Highlight]: {
    color: "#c9a86a",
    roughness: 0.35,
    metalness: 0.4,
    emissive: "#c9a86a",
    emissiveIntensity: 0.85,
  },
};

const cache = new Map<string, MeshStandardMaterial>();

function build(recipe: MaterialRecipe): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: recipe.color,
    roughness: recipe.roughness ?? 0.8,
    metalness: recipe.metalness ?? 0.05,
    ...(recipe.emissive
      ? { emissive: recipe.emissive, emissiveIntensity: recipe.emissiveIntensity ?? 1 }
      : {}),
    ...(recipe.transparent ? { transparent: true, opacity: recipe.opacity ?? 1 } : {}),
    ...(recipe.doubleSide ? { side: DoubleSide } : {}),
  });
}

/** The shared instance for a material kind (built once, reused everywhere). */
export function material(kind: MaterialKind): MeshStandardMaterial {
  let instance = cache.get(kind);
  if (!instance) {
    instance = build(RECIPES[kind]);
    cache.set(kind, instance);
  }
  return instance;
}

/**
 * Book spine palette — muted library tones that sit with the walnut/brass
 * scheme. Kept here (not in components) so the whole shelf can be re-graded.
 */
const BOOK_COLORS = ["#5c4a6b", "#8c4a3c", "#3a5a70", "#4f6b4a", "#8a6a3a", "#5a5f6b", "#7a4550"];

/** A cached material for the nth book on a shelf. */
export function bookMaterial(index: number): MeshStandardMaterial {
  const color = BOOK_COLORS[index % BOOK_COLORS.length];
  const key = `book:${color}`;
  let instance = cache.get(key);
  if (!instance) {
    instance = new MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.02 });
    cache.set(key, instance);
  }
  return instance;
}
