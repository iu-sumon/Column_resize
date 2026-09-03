import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import marketReducer from './marketSlice';
import terminalReducer from './terminalSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    market: marketReducer,
    terminal: terminalReducer
  }
});
