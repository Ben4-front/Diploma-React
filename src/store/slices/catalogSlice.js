import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:7070/api';

export const fetchTopSales = createAsyncThunk('catalog/fetchTopSales', async () => {
  const res = await fetch(`${API}/top-sales`);
  if (!res.ok) throw new Error('Ошибка');
  return res.json();
});

export const fetchCategories = createAsyncThunk('catalog/fetchCategories', async () => {
  const res = await fetch(`${API}/categories`);
  if (!res.ok) throw new Error('Ошибка');
  return res.json();
});

export const fetchItems = createAsyncThunk('catalog/fetchItems', async ({ categoryId, offset, q }) => {
  const params = new URLSearchParams();
  if (categoryId) params.append('categoryId', categoryId);
  if (offset) params.append('offset', offset);
  if (q) params.append('q', q);
  const res = await fetch(`${API}/items?${params}`);
  if (!res.ok) throw new Error('Ошибка');
  return { data: await res.json(), offset };
});

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    topSales: [], topSalesStatus: 'idle',
    categories: [], categoriesStatus: 'idle',
    items: [], itemsStatus: 'idle',
    activeCategory: null, offset: 0, hasMore: true,
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      state.offset = 0;
      state.items = [];
    },
    setOffset: (state, action) => { state.offset = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSales.pending, (state) => { state.topSalesStatus = 'loading'; })
      .addCase(fetchTopSales.fulfilled, (state, action) => { state.topSalesStatus = 'success'; state.topSales = action.payload; })
      .addCase(fetchTopSales.rejected, (state) => { state.topSalesStatus = 'error'; })
      
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; state.categoriesStatus = 'success'; })
      
      .addCase(fetchItems.pending, (state) => { state.itemsStatus = 'loading'; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.itemsStatus = 'success';
        if (action.payload.offset > 0) state.items.push(...action.payload.data);
        else state.items = action.payload.data;
        state.hasMore = action.payload.data.length >= 6;
      })
      .addCase(fetchItems.rejected, (state) => { state.itemsStatus = 'error'; });
  }
});

export const { setActiveCategory, setOffset } = catalogSlice.actions;
export default catalogSlice.reducer;