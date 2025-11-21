import { Result, rmap } from "@/util/Result";
import { generateStoryId, StoryResponse } from "./Story";
import { createStory } from "./createStory";
import { Progress } from "@/progress/Progress";
import { AppDispatch } from "@/state/store";
import { nextStory, setStory } from "@/state/appSlice";
import { Async } from "@/util/AsyncState";
import { stories } from "./stories";

export async function createStoryThunk(dispatch: AppDispatch, progress: Progress) {
  const id = stories[1].id
  const asyncStory = Async.success({ ...stories[1], id })
  dispatch(nextStory({ id }))

  // const id = generateStoryId()
  // dispatch(nextStory({ id }))
  // const result = await createStory({ progress })

  // const asyncStory = Async.fromResult(rmap(result, story => ({
  //   ...story,
  //   id
  // })))

  dispatch(
    setStory({
      id,
      story: asyncStory,
    })
  )
}
