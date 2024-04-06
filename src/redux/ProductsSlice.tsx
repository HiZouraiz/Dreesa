import { createSlice } from "@reduxjs/toolkit";

const ProductsSlice = createSlice({
    name: 'product',
    initialState: [],
    reducers: {
        addCartProducts(state, action) {
            state.push(action.payload);
        }
    }
})

export const { addCartProducts } = ProductsSlice.actions;
export default ProductsSlice.reducer;