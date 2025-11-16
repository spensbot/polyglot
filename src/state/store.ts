import { configureStore } from '@reduxjs/toolkit'
import appReducer, { AppStateSchema, initialState } from './appSlice'
import { SaveManager } from '@/util/SaveManager'

const saveManager = new SaveManager({
  debounce_s: 3,
  maxWait_s: 20
}, {
  PersistedAppState2: AppStateSchema
})

const loadedStateResult = saveManager.load('PersistedAppState2')
const loadedState = loadedStateResult.isOk() ? loadedStateResult.value : null
if (loadedStateResult.isErr()) {
  console.warn('Failed to load persisted state:', loadedStateResult.error.message)
}

export const store = configureStore({
  reducer: {
    app: appReducer
  },
  preloadedState: {
    app: initialState,
    // app: loadedState ? { ...initialState, ...loadedState } : initialState
  },
})

store.subscribe(() => {
  const persistedState = {
    ...store.getState().app,
    activeSession: undefined // Don't persist the active session
  }

  saveManager.stateUpdated('PersistedAppState2', persistedState)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch