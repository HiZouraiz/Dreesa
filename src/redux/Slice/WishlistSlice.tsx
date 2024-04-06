import { createSlice } from "@reduxjs/toolkit";

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    toggleProductInWishlist(state, action) {
      const existingIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          price_html: action.payload.price_html,
          image: action.payload.images[0]?.src,
        });
      } else {
        state.splice(existingIndex, 1);
      }
    },
  },
});

export const { toggleProductInWishlist } = WishlistSlice.actions;
export default WishlistSlice.reducer;
