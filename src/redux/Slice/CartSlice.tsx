import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addProductToCart(state, action) {
      let myindex = -1;

      state.map((item, index) => {
        if (item.id == action.payload.id) {
          myindex = index;
        }
      });

      if (myindex == -1) {
        state.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          image: action.payload.images[0].src,
          qty: action.payload.qty == undefined ? 1 : action.payload.qty,
          stock_quantity: action.payload.stock_quantity,
          variation_id: action.payload.selectedVariationId,
        });
      } else {
        state[myindex].qty = state[myindex].qty + 1;
      }
    },
    removeProductToCart(state, action) {
      let myindex = -1;

      state.map((item, index) => {
        if (item.id == action.payload.id) {
          myindex = index;
        }
      });

      if (myindex == -1) {
      } else {
        state[myindex].qty = state[myindex].qty - 1;
      }
    },
    deleteCartItem(state, action) {
      state.splice(
        state.findIndex((arrow) => arrow.id === action.payload),
        1
      );
    },
    emptyCart(state, action) {
      state.splice(state.length - state.length, state.length);
    },
  },
});

export const {
  addProductToCart,
  removeProductToCart,
  deleteCartItem,
  emptyCart,
} = CartSlice.actions;
export default CartSlice.reducer;
