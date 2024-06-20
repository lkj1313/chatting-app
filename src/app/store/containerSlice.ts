import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContainerState {
  containerWidth: number;
  leftWidth: number;
  sidebarOpen: boolean;
}

const initialState: ContainerState = {
  containerWidth: 0,
  leftWidth: 0,
  sidebarOpen: false,
};

const containerSlice = createSlice({
  name: "container",
  initialState,
  reducers: {
    setContainerWidth: (state, action: PayloadAction<number>) => {
      state.containerWidth = action.payload;
    },
    setLeftWidth: (state, action: PayloadAction<number>) => {
      state.leftWidth = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setContainerWidth, setLeftWidth, setSidebarOpen } =
  containerSlice.actions;
export default containerSlice.reducer;
