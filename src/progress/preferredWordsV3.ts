import { Word } from "@/dictionary/Word";
import { AppState } from "@/state/appSlice";
import { hintToSeenRatio_recent } from "./hintToSeenRatio";
import { shuffle } from "@/util/collectionUtil";
import { buckets, unseenWords } from "./Progress";
import { combinedBias, llmBias_frequency } from "./LlmBias";
import { getBiasCompareCb, PREFERRED_WORDS_LIMIT } from "./preferredWordUtils";
import { distributeByWeight } from "@/util/math/distributeByWeight";

/** Returns the preferred ratio of known words based on the hint / seen ratio */
export function getPreferredKnownRatio(hsRatio: number): number {
  if (hsRatio < 0.01) return 0;
  if (hsRatio < 0.05) return 0.2;
  if (hsRatio < 0.1) return 0.5;
  if (hsRatio < 0.2) return 0.7;
  if (hsRatio < 0.3) return 0.9;
  return 1;
}

export function getPreferredWordsV3(app: AppState): Word[] {
  const { progress } = app
  const hintToSeenRatio = hintToSeenRatio_recent(app)
  const preferredKnownRatio = getPreferredKnownRatio(hintToSeenRatio)

  const { learning, known, familiar } = buckets(progress)
  const unseen = unseenWords(progress)

  // Known words are shuffled so each story gets a random selection of known words
  const orderedKnown = shuffle(known.map(w => w.word))

  // Unknown words are composed of learning, familiar, and unseen words
  // Ordered to turn learning words into known words ASAP
  const bias = combinedBias([
    llmBias_frequency()
  ])
  const cmp = getBiasCompareCb(bias)
  const orderedUnknown: Word[] = [
    ...learning.map(w => w.word).sort(cmp),
    ...familiar.map(w => w.word).sort(cmp),
    ...unseen.sort(cmp)
  ]

  const words = distributeByWeight<Word>([
    { items: orderedUnknown, weight: 1 - preferredKnownRatio },
    { items: orderedKnown, weight: preferredKnownRatio },
  ])

  return words.slice(0, PREFERRED_WORDS_LIMIT)
}