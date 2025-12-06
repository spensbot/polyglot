import z from "zod";

// export const WORD_RARITY_LIST = ['Very Common', 'Common', 'Uncommon', 'Rare', 'Exotic', 'Mythic'] as const;

// Essential → Core → Useful → Specialized → Niche → Esoteric
// Fluency-Critical → High-Value → Everyday → Advanced → Rare → Obscure
// Foundational → Structural → Supporting → Decorative → Ornamental → Arcane
export const WORD_RARITY_LIST = ['Foundational', 'Essential', 'Core', 'Useful', 'Specialized', 'Niche', 'Esoteric'] as const;
export type WordRarity = typeof WORD_RARITY_LIST[number];

interface WordRarityInfo {
  color: string
  className: string
  rankingThreshold: number
}

const WORD_RARITY_INFO: Record<WordRarity, WordRarityInfo> = {
  'Foundational': {
    color: '#FACC15',
    className: 'text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]',
    rankingThreshold: 100
  }, // Yellow with strong glow/pulse
  'Essential': {
    color: `#D4AF37`,
    className: 'text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]',
    rankingThreshold: 500
  }, // Gold with medium glow
  'Core': {
    color: '#8B5CF6',
    className: 'text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,1.0)]',
    rankingThreshold: 1000
  }, // Purple with medium glow
  'Useful': {
    color: '#3B82F6',
    className: 'text-[#3B82F6]',
    rankingThreshold: 2000
  }, // Blue
  'Specialized': {
    color: '#5a6',
    className: 'text-[#5a6]',
    rankingThreshold: 5000
  }, // Green
  'Niche': {
    color: '#6B8E72',
    className: 'text-[#6B8E72]',
    rankingThreshold: 10000
  }, // Gray-green
  'Esoteric': {
    color: '#9CA3AF',
    className: 'text-[#9CA3AF]',
    rankingThreshold: Infinity
  }, // Gray
};

export function getRarity(ranking: number): WordRarity {
  for (const rarity of WORD_RARITY_LIST) {
    if (ranking <= WORD_RARITY_INFO[rarity].rankingThreshold) {
      return rarity;
    }
  }
  return 'Esoteric'; // Fallback, should not reach here
}

export function rarityInfo(rarity: WordRarity): WordRarityInfo {
  return WORD_RARITY_INFO[rarity];
}