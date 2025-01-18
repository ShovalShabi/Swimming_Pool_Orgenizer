// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import instructorReducer from "./instructor.reducer";
import lessonReducer from "./lesson.reducers";

// Combine reducers
const rootReducer = combineReducers({
  instructor: instructorReducer,
  lesson: lessonReducer,
});

/**
 * Type representing the root state of the application.
 * It is inferred from the combined reducers, including `instructor` and `lesson`.
 *
 * @typedef {ReturnType<typeof rootReducer>} RootState
 */
export type RootState = ReturnType<typeof rootReducer>;

// Create store with Redux Toolkit's configureStore
const store = configureStore({
  reducer: rootReducer, // Pass the rootReducer under the 'reducer' key
});

export default store;
