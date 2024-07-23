import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ParticipantInfo {
  uid: string;
  nickname: string;
  profileImg: string;
  additionalInfo?: string;
}

interface ParticipantModalState {
  participantInfo: ParticipantInfo | null;
}

const initialState: ParticipantModalState = {
  participantInfo: null,
};

const participantModalSlice = createSlice({
  name: "participantInfo",
  initialState,
  reducers: {
    participantInfo: (state, action: PayloadAction<ParticipantInfo>) => {
      state.participantInfo = action.payload;
    },
  },
});

export const { participantInfo } = participantModalSlice.actions;

export default participantModalSlice.reducer;
