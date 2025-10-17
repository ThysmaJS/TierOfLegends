import { configureStore } from '@reduxjs/toolkit';
import filters from './slices/filtersSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      filters,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

// Infer types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
