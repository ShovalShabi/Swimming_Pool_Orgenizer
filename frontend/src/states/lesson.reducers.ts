import { createAction, createReducer } from "@reduxjs/toolkit";
import NewLesson from "../dto/lesson/new-lesson.dto";

// Action types (using createAction)
export const editLesson = createAction<NewLesson>("EDIT_LESSON");
export const discardLesson = createAction("DISCRARD_LESSON");

// Initial state for lesson reducer
interface LessonState {
  /** Object of NewLesson for creation or null for discarding it. */
  lesson: NewLesson | null;
}

// Initial state
const initialState: LessonState = {
  lesson: null, // Initially a null
};

// Reducer to handle lesson actions
const lessonReducer = createReducer(initialState, (builder) => {
  builder
    /**
     * Handles the "EDIT_LESSON" action, which updates the data of the lesson in case their new.
     * @param {LessonState} state - The current state of lesson.
     * @param {Action<NewLesson>} action - The action containing and object of NewLesson.
     */
    .addCase(editLesson, (state, action) => {
      state.lesson = action.payload; // Set the Lesson data response from the server
    })
    /**
     * Handles the "DISCRARD_LESSON" action, which clears the lesson.
     * @param {LessonState} state - The current state of lesson.
     */
    .addCase(discardLesson, (state) => {
      state.lesson = null; // Clear lesson on reset
    });
});

export default lessonReducer;
