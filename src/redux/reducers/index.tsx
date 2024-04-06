import { ADD_ITEM, REMOVE_ITEM } from "../action/actionTypes";

// Define the type for the state
interface StateType {
  items: number[]; // Change `number` to the type of items in your state array
}

// Define the initial state
const initialState: StateType = {
  items: [], // Initialize items array
};

// Define the reducer function
export const Reducers = (
  state: StateType = initialState, // Set the initial state
  action: { type: string; payload: number } // Specify the action type
) => {
  switch (action.type) {
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.payload] }; // Add item to the items array

    case REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item !== action.payload), // Remove item from the items array
      };

    default:
      return state;
  }
};
