import { createSlice } from '@reduxjs/toolkit';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) { return []; }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: getInitialCart() },
  reducers: {
    addToCart: (state, action) => {
      const { id, size, count, price, title } = action.payload;
      const existing = state.items.find(i => i.id === id && i.size === size);
      if (existing) existing.count += count;
      else state.items.push({ id, size, count, price, title });
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(i => !(i.id === id && i.size === size));
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;