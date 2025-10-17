import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FiltersState = {
  query: string;
};

const initialState: FiltersState = {
  query: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state: FiltersState, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearFilters(state: FiltersState) {
      state.query = '';
    },
  },
});

export const { setQuery, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
