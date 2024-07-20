import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ParticipantInfo {
  id: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string;
}

interface ParticipantModalState {
  showModal: boolean;
  selectedParticipant: ParticipantInfo | null;
}

const initialState: ParticipantModalState = {
  showModal: false,
  selectedParticipant: null,
};

const participantModalSlice = createSlice({
  name: "participantModal",
  initialState,
  reducers: {
    openParticipantModal: (state, action: PayloadAction<ParticipantInfo>) => {
      state.showModal = true;
      state.selectedParticipant = action.payload;
    },
    closeParticipantModal: (state) => {
      state.showModal = false;
      state.selectedParticipant = null;
    },
  },
});

export const { openParticipantModal, closeParticipantModal } =
  participantModalSlice.actions;

export default participantModalSlice.reducer;
