import z from "zod";

export const WORD_RARITY_LIST = ['Very Common', 'Common', 'Uncommon', 'Rare', 'Exotic', 'Mythic'] as const;
export type WordRarity = typeof WORD_RARITY_LIST[number];

interface WordRarityInfo {
  className: string
  rankingThreshold: number
}

const WORD_RARITY_INFO: Record<WordRarity, WordRarityInfo> = {
  'Very Common': {
    className: 'text-[#9CA3AF]',
    rankingThreshold: 100
  }, // Grey
  'Common': {
    className: 'text-[#22C55E]',
    rankingThreshold: 500
  }, // Green
  'Uncommon': {
    className: 'text-[#3B82F6]',
    rankingThreshold: 1000
  }, // Blue
  'Rare': {
    className: 'text-[#8B5CF6] drop-shadow-[0_0_6px_rgba(139,92,246,1)]',
    rankingThreshold: 2000
  }, // Purple with subtle glow
  'Exotic': {
    className: 'text-[#0EA5E9] drop-shadow-[0_0_8px_rgba(14,165,233,1)]',
    rankingThreshold: 5000
  }, // Light Blue with stronger glow
  'Mythic': {
    className: 'text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,1)] animate-pulse',
    rankingThreshold: Infinity
  }, // Gold with bold glow & pulse
};

export function getRarity(ranking: number): WordRarity {
  for (const rarity of WORD_RARITY_LIST) {
    if (ranking <= WORD_RARITY_INFO[rarity].rankingThreshold) {
      return rarity;
    }
  }
  return 'Mythic'; // Fallback, should not reach here
}

export function getClassName(rarity: WordRarity): string {
  return WORD_RARITY_INFO[rarity].className;
}