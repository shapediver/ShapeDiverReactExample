import { configureStore } from '@reduxjs/toolkit'
import counterSlice from '../features/counter/counterSlice'
import parametersSlice from '../features/parameters/parametersSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    parameters: parametersSlice
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

