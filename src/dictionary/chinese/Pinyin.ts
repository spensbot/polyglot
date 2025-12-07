import z from "zod";

const NumberedPinyin = z.string().brand("NumberedPinyin");
export type NumberedPinyin = z.infer<typeof NumberedPinyin>;
const PrettyPinyin = z.string().brand("PrettyPinyin");
export type PrettyPinyin = z.infer<typeof PrettyPinyin>;

export function prettyPinyin(numberedPinyin: NumberedPinyin): PrettyPinyin {
  // Mapping of vowels to their tone marks
  const toneMap: { [key: string]: string[] } = {
    'a': ['a', 'ā', 'á', 'ǎ', 'à'],
    'e': ['e', 'ē', 'é', 'ě', 'è'],
    'i': ['i', 'ī', 'í', 'ǐ', 'ì'],
    'o': ['o', 'ō', 'ó', 'ǒ', 'ò'],
    'u': ['u', 'ū', 'ú', 'ǔ', 'ù'],
    'ü': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
  };

  // Find the tone number (1-5)
  const match = numberedPinyin.match(/([a-zü]+)([1-5])$/i);
  if (!match) return numberedPinyin as unknown as PrettyPinyin;
  let [_, syllable, toneStr] = match;
  const tone = parseInt(toneStr);
  if (tone === 5) return syllable as PrettyPinyin; // Neutral tone, no mark

  // Replace 'v' with 'ü' (common in numbered pinyin)
  syllable = syllable.replace('v', 'ü');

  // Find which vowel to mark
  // Priority: a > o > e > i > u > ü
  let vowelIndex = -1;
  let vowelToMark = '';
  for (const v of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    vowelIndex = syllable.indexOf(v);
    if (vowelIndex !== -1) {
      vowelToMark = v;
      break;
    }
  }
  if (!vowelToMark) return numberedPinyin as unknown as PrettyPinyin;

  // Replace the vowel with the marked vowel
  const markedVowel = toneMap[vowelToMark][tone];
  const result =
    syllable.slice(0, vowelIndex) + markedVowel + syllable.slice(vowelIndex + 1);
  return result as PrettyPinyin;
}

export function numberedPinyin(pretty: PrettyPinyin): NumberedPinyin {
  // Reverse-tone map: tone-marked vowel → [base, tone]
  const reverseToneMap: Record<string, [string, number]> = {
    'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
    'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
    'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
    'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
    'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
    'ǖ': ['ü', 1], 'ǘ': ['ü', 2], 'ǚ': ['ü', 3], 'ǜ': ['ü', 4],
  };

  // Search for any marked vowel
  for (let i = 0; i < pretty.length; i++) {
    const ch = pretty[i];

    if (reverseToneMap[ch]) {
      const [base, tone] = reverseToneMap[ch];

      // Replace the marked vowel with its base
      const syllable =
        pretty.slice(0, i) + base + pretty.slice(i + 1);

      // Convert ü → v for numbered pinyin output
      const normalized = syllable.replace(/ü/g, 'v');

      return normalized + tone as NumberedPinyin;
    }
  }

  // No marked vowel ⇒ tone 5
  // Normalize ü → v
  const normalized = pretty.replace(/ü/g, 'v');
  return normalized + '5' as NumberedPinyin;
}