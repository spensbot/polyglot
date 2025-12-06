import { useDispatch, useSelector } from "react-redux"
import { AppState } from "./appSlice"
import { AppDispatch, RootState } from "./store"
import { AsyncState } from "@/util/AsyncState";
import { ParsedStory } from "@/story/ParsedStory";

export function useAppState<T>(cb: (state: AppState) => T): T {
  return useSelector((state: RootState) => cb(state.app))
}
export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useCurrentStory<T>(cb: (story: AsyncState<ParsedStory>) => T): T {
  return useAppState(s => cb(s.storiesById[s.currentStory.storyId]))
}