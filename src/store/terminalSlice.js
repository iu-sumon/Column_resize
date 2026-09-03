import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderSide: 'BUY',
  orderType: 'LIMIT',
  orderPrice: 428.50,
  orderQty: 100,
  isDemoModalOpen: false,
  selectedProduct: null,
  toastNotification: null
};

export const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    setOrderSide: (state, action) => {
      state.orderSide = action.payload;
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setOrderPrice: (state, action) => {
      state.orderPrice = action.payload;
    },
    setOrderQty: (state, action) => {
      state.orderQty = action.payload;
    },
    openDemoModal: (state) => {
      state.isDemoModalOpen = true;
    },
    closeDemoModal: (state) => {
      state.isDemoModalOpen = false;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    showToast: (state, action) => {
      state.toastNotification = action.payload;
    },
    clearToast: (state) => {
      state.toastNotification = null;
    }
  }
});

export const {
  setOrderSide,
  setOrderType,
  setOrderPrice,
  setOrderQty,
  openDemoModal,
  closeDemoModal,
  setSelectedProduct,
  showToast,
  clearToast
} = terminalSlice.actions;

export default terminalSlice.reducer;
