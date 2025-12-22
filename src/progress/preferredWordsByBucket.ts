import { AppState } from "@/state/appSlice";
import { lerp } from "@/util/math";
import { buckets, unseenWords } from "./Progress";
import { combinedBias, llmBias_frequency, llmBias_recency } from "./LlmBias";
import { Word } from "@/dictionary/Word";
import { distributeByWeight } from "@/util/math/distributeByWeight";
import { hintToSeenRatio_recent } from "./hintToSeenRatio";
import { getBiasCompareCb, PREFERRED_WORDS_LIMIT } from "./preferredWordUtils";

interface BucketWeights {
  learning: number;
  known: number;
  familiar: number;
  unseen: number;
}

/** The preferred mixture of words based on the minimum hint / seen ratio 
 * (user hasn't looked up anything, too easy) */
export const minHsRatioBucketWeights: BucketWeights = {
  learning: 1.0, // Give them as many learning words as possible (they probs won't have many)
  known: 0.0, // Don't give them any known words
  familiar: 0.7, // Prefer familiar words so they can become known
  unseen: 0.3, // Fill remaining spots with unseen words
}

/** The preferred mixture of words based on the maximum hint / seen ratio 
 * (user has looked up every word, too hard) */
export const maxHsRatioBucketWeights: BucketWeights = {
  learning: 0.1,
  known: 1.0,
  familiar: 0.1,
  unseen: 0.01,
}

function lerpWeights<K extends string>(a: Record<K, number>, b: Record<K, number>, ratio: number): Record<K, number> {
  const result: Record<K, number> = {} as Record<K, number>;
  for (const key in a) {
    result[key] = lerp({ start: a[key], end: b[key] }, ratio);
  }
  return result;
}

export function targetBucketWeights_deprecated(hsRatio: number): BucketWeights {
  const skewed = Math.pow(hsRatio, 0.5)
  return lerpWeights(minHsRatioBucketWeights, maxHsRatioBucketWeights, skewed);
}

/** @deprecated
 * Prints a list of words the LLM should prefer to use in stories by bucketing words in categories
 * - learning
 * - known
 * - familiar
 * - unseen
 * 
 * Sorting them based on frequency and recency
 * And distributing them according to the user's hint / seen ratio
 */
export function preferredWordsByBucket_deprecated(state: AppState): Word[] {
  const { progress } = state
  const hintToSeenRatio = hintToSeenRatio_recent(state)
  const bucketWeights = targetBucketWeights_deprecated(hintToSeenRatio)

  const llmBias = combinedBias([
    llmBias_frequency(),
    llmBias_recency(state),
  ])
  const cmp = getBiasCompareCb(llmBias)

  let { learning, known, familiar } = buckets(progress)

  const learningWords = learning.map(w => w.word).sort(cmp)
  const knownWords = known.map(w => w.word).sort(cmp)
  const familiarWords = familiar.map(w => w.word).sort(cmp)
  const unseenWords_ = unseenWords(progress).sort(cmp)

  const words = distributeByWeight<Word>([
    { items: learningWords, weight: bucketWeights.learning },
    { items: knownWords, weight: bucketWeights.known },
    { items: familiarWords, weight: bucketWeights.familiar },
    { items: unseenWords_, weight: bucketWeights.unseen },
  ])

  return words.slice(0, PREFERRED_WORDS_LIMIT)
}
