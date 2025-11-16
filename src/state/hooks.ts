import { useSelector } from "react-redux"
import { AppState } from "./appSlice"
import { RootState } from "./store"

export function useAppState<T>(cb: (state: AppState) => T) {
  return useSelector((state: RootState) => cb(state.app))
}

export { useDispatch } from "react-redux"