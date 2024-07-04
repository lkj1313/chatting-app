// src/app/store/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  showModal: boolean;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  showModal: false,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state) => {
      state.showModal = true;
    },
    closeModal: (state) => {
      state.showModal = false;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
  },
});

export const { openModal, closeModal, openSidebar, closeSidebar } =
  uiSlice.actions;
export default uiSlice.reducer;
