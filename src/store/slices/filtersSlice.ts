import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FiltersState = {
  query: string;
  category: '' | 'champion-skins' | 'items' | 'summoner-spells' | 'runes';
  sortBy: 'createdAt' | 'likes' | 'title';
  sortDir: 'asc' | 'desc';
};

const initialState: FiltersState = {
  query: '',
  category: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state: FiltersState, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setCategory(state: FiltersState, action: PayloadAction<FiltersState['category']>) {
      state.category = action.payload;
    },
    setSortBy(state: FiltersState, action: PayloadAction<FiltersState['sortBy']>) {
      state.sortBy = action.payload;
    },
    setSortDir(state: FiltersState, action: PayloadAction<FiltersState['sortDir']>) {
      state.sortDir = action.payload;
    },
    clearFilters(state: FiltersState) {
      state.query = '';
      state.category = '';
      state.sortBy = 'createdAt';
      state.sortDir = 'desc';
    },
  },
});

export const { setQuery, setCategory, setSortBy, setSortDir, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
