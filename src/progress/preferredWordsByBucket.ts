import { AppState } from "@/state/appSlice";
import { lerp } from "@/util/math";
import { isKnown, isLearning, knownWords, learningToSeenRatio, learningWords, seenWords } from "./Progress";
import { combinedBias, llmBias_frequency, llmBias_recency } from "./LlmBias";
import { dict } from "@/dictionary/Dictionary";
import { Word } from "@/dictionary/Word";
import { distributeByWeight } from "@/util/math/distributeByWeight";
import { Log } from "@/util/Log";

interface BucketWeights {
  learning: number;
  known: number;
  familiar: number;
  unseen: number;
}

const minLtsBucketWeights: BucketWeights = {
  learning: 1.0,
  known: 0.0,
  familiar: 0.5,
  unseen: 0.3,
}

const maxLtsBucketWeights: BucketWeights = {
  learning: 0.1,
  known: 1.0,
  familiar: 0.1,
  unseen: 0.03,
}

function lerpWeights<K extends string>(a: Record<K, number>, b: Record<K, number>, ratio: number): Record<K, number> {
  const result: Record<K, number> = {} as Record<K, number>;
  for (const key in a) {
    result[key] = lerp({ start: a[key], end: b[key] }, ratio);
  }
  return result;
}

/** Prints a list of words the LLM should prefer to use in stories by bucketing words in categories
 * - learning
 * - known
 * - familiar
 * - unseen
 * 
 * Sorting them based on frequency and recency
 * And distributing them according to the user's learning / seen ratio
 */
function preferredWordsByBucket(state: AppState): Word[] {
  const { progress } = state
  const ltsRatio = learningToSeenRatio(progress)
  const bucketWeights = lerpWeights(minLtsBucketWeights, maxLtsBucketWeights, ltsRatio)

  Log.info("learning / seen ratio:", ltsRatio.toFixed(2))
  Log.info("bucket weights:", JSON.stringify(bucketWeights, null, 2))

  const llmBias = combinedBias([
    llmBias_frequency(),
    llmBias_recency(state),
  ])
  const cmp = getCompareFunction(llmBias)

  const learning = learningWords(progress).map(w => w.word).sort(cmp)
  const known = knownWords(progress).map(w => w.word).sort(cmp)
  const familiar = seenWords(progress).filter(w => !isKnown(w) && !isLearning(w)).map(w => w.word).sort(cmp)
  const unseen = dict.allUnique()
    .map(e => e.simplified as Word)
    .filter(w => progress.wordsSeen[w] === undefined).sort(cmp)

  Log.info(`Sorted Learning`, learning)
  Log.info(`Sorted Known`, known)
  Log.info(`Sorted Familiar`, familiar)

  const words = distributeByWeight<Word>([
    { items: learning, weight: bucketWeights.learning },
    { items: known, weight: bucketWeights.known },
    { items: familiar, weight: bucketWeights.familiar },
    { items: unseen, weight: bucketWeights.unseen },
  ])

  return words
}

export function printPreferredWordsByBucket(state: AppState, limit: number): string {
  const words = preferredWordsByBucket(state)
  return words.slice(0, limit)
    .map((w, i) => `${i + 1}. ${w}${i === 0 ? " (highest priority)" : ""}${i === limit - 1 ? " (lowest priority)" : ""}`)
    .join("\n")
}

const getCompareFunction = (llmBias: Record<Word, number>) => (a: Word, b: Word): number => {
  const biasA = llmBias[a] ?? 0.0
  const biasB = llmBias[b] ?? 0.0
  return biasB - biasA
}