// src/app/store/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  showModal: boolean;
  sidebarOpen: boolean;
  chatRoomSidebarOpen: boolean;
  chatRoomInfoModalOpen: boolean;
  participantModalOpen: boolean;
  privateChatRoomSidebar: boolean;
  imageModalState: boolean;
}

const initialState: UIState = {
  showModal: false,
  sidebarOpen: false,
  chatRoomSidebarOpen: false,
  chatRoomInfoModalOpen: false,
  participantModalOpen: false,
  privateChatRoomSidebar: false,
  imageModalState: false,
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
    openImageModal: (state) => {
      state.imageModalState = true;
    },
    closeImageModal: (state) => {
      state.imageModalState = false;
    },
    chatRoomSidebarOpen: (state) => {
      state.chatRoomSidebarOpen = true;
    },
    chatRoomSidebarClose: (state) => {
      state.chatRoomSidebarOpen = false;
    },
    chatRoomInfoModalOpen: (state) => {
      state.chatRoomInfoModalOpen = true;
    },
    chatRoomInfoModalClose: (state) => {
      state.chatRoomInfoModalOpen = false;
    },
    participantModalOpen: (state) => {
      state.participantModalOpen = true;
    },
    participantModalClose: (state) => {
      state.participantModalOpen = false;
    },
    privateChatRoomSidebarOpen: (state) => {
      state.privateChatRoomSidebar = true;
    },
    privateChatRoomSidebarClose: (state) => {
      state.privateChatRoomSidebar = false;
    },
  },
});

export const {
  openModal,
  closeModal,

  openSidebar,
  closeSidebar,

  chatRoomSidebarClose,
  chatRoomSidebarOpen,

  chatRoomInfoModalOpen,
  chatRoomInfoModalClose,

  participantModalClose,
  participantModalOpen,

  privateChatRoomSidebarOpen,
  privateChatRoomSidebarClose,

  openImageModal,
  closeImageModal,
} = uiSlice.actions;
export default uiSlice.reducer;
