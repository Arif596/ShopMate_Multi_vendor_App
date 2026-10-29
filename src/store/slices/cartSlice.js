import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    // Add or update product in cart
    addCart(state, action) {
      const { product, quantity } = action.payload;
      console.log("ADDING PRODUCT:", product);
      const existingProduct = state.cart.find(
        (item) => item.product.id === product.id
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    // Remove from Cart
    removeCart(state, action) {
      state.cart = state.cart.filter(
        (item) => item.product.id !== action.payload
      );
    },
    // Clear cart
    clearCart(state) {
      state.cart = [];
    },
    // Update Qunatity
    UpdateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.product.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const { addCart, removeCart, UpdateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
