import { createAction, createReducer } from "@reduxjs/toolkit";
import NewInstructor from "../dto/instructor/new-instructor.dto";

// Action types (using createAction)
export const editInstructor = createAction<NewInstructor>("EDIT_INSTRUCTOR");
export const discardInstructor = createAction("DISCRARD_INSTRUCTOR");

// Initial state for instructor reducer reducer
interface InstructorState {
  /** Objects of NewInstructor for creation or null for discarding it. */
  instructor: NewInstructor | null;
}

// Initial state
const initialState: InstructorState = {
  instructor: null, // Initially a null
};

// Reducer to handle instructor actions
const instructorReducer = createReducer(initialState, (builder) => {
  builder
    /**
     * Handles the "EDIT_INSTRUCTOR" action, which updates the data of the instructor in case their new.
     * @param {InstructorState} state - The current state of instructor.
     * @param {Action<NewInstructor>} action - The action containing and object of NewInstructor.
     */
    .addCase(editInstructor, (state, action) => {
      state.instructor = action.payload; // Set the Instructor data response from the server
    })
    /**
     * Handles the "DISCRARD_INSTRUCTOR" action, which clears the instructor.
     * @param {InstructorState} state - The current state of instructor.
     */
    .addCase(discardInstructor, (state) => {
      state.instructor = null; // Clear instructor on reset
    });
});

export default instructorReducer;
