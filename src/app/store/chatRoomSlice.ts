import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { v4 as uuidv4 } from "uuid";

interface ChatRoomState {
  chatRoomImg: string | null;
  channelName: string | null;
  description: string;
  chatRoomId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  userId: string | null;
  userName: string | null;
}

const initialState: ChatRoomState = {
  chatRoomImg: null,
  channelName: "",
  description: "",
  chatRoomId: null,
  status: "idle",
  error: null,
  userId: null,
  userName: null,
};

export const saveChatRoom = createAsyncThunk<
  string,
  {
    chatRoomImg: string | null;
    channelName: string;
    description: string;
    userId: string;
    userName: string;
  },
  { rejectValue: string }
>("chatRoom/saveChatRoom", async (chatRoom, { rejectWithValue }) => {
  try {
    const newChatRoomId = uuidv4();
    let imageUrl = "";
    if (chatRoom.chatRoomImg) {
      const storageRef = ref(
        storage,
        `images/${Date.now()}_${chatRoom.channelName}`
      );
      await uploadString(storageRef, chatRoom.chatRoomImg, "data_url");
      imageUrl = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, "chatRooms", newChatRoomId), {
      ...chatRoom,
      chatRoomImg: imageUrl,
      chatRoomId: newChatRoomId,
    });
    return newChatRoomId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchChatRoomById = createAsyncThunk<
  ChatRoomState,
  string,
  { rejectValue: string }
>("chatRoom/fetchChatRoomById", async (chatRoomId, { rejectWithValue }) => {
  try {
    const docRef = doc(db, "chatRooms", chatRoomId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { chatRoomId, ...docSnap.data() } as ChatRoomState;
    } else {
      throw new Error("Chat room not found");
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {
    setChatRoomImg: (state, action: PayloadAction<string | null>) => {
      state.chatRoomImg = action.payload;
    },
    clearChatRoomImg: (state) => {
      state.chatRoomImg = null;
    },
    setChannelName: (state, action: PayloadAction<string>) => {
      state.channelName = action.payload;
    },
    clearChannelName: (state) => {
      state.channelName = "";
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    clearDescription: (state) => {
      state.description = "";
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setChatRoomId: (state, action: PayloadAction<string | null>) => {
      state.chatRoomId = action.payload;
    },
    clearChatRoomId: (state) => {
      state.chatRoomId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveChatRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        saveChatRoom.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.chatRoomId = action.payload;
          state.error = null;
        }
      )
      .addCase(saveChatRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchChatRoomById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchChatRoomById.fulfilled,
        (state, action: PayloadAction<ChatRoomState>) => {
          state.status = "succeeded";
          state.chatRoomImg = action.payload.chatRoomImg;
          state.channelName = action.payload.channelName;
          state.description = action.payload.description;
          state.chatRoomId = action.payload.chatRoomId;
          state.userId = action.payload.userId;
          state.userName = action.payload.userName;
          state.error = null;
        }
      )
      .addCase(fetchChatRoomById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  setChatRoomImg,
  clearChatRoomImg,
  setChannelName,
  clearChannelName,
  setDescription,
  clearDescription,
  setUserId,
  setUserName,
  setChatRoomId,
  clearChatRoomId,
} = chatRoomSlice.actions;

export default chatRoomSlice.reducer;
