import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContainerState {
  containerWidth: number;
  leftWidth: number;

  headerHeight: number;
}

const initialState: ContainerState = {
  containerWidth: 0,
  leftWidth: 0,

  headerHeight: 0, // 추가된 상태
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

    setHeaderHeight(state, action: PayloadAction<number>) {
      state.headerHeight = action.payload;
    },
  },
});

export const {
  setContainerWidth,
  setLeftWidth,

  setHeaderHeight,
} = containerSlice.actions;
export default containerSlice.reducer;
