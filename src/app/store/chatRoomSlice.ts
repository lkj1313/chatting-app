import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { v4 as uuidv4 } from "uuid";
import { RootState, AppDispatch } from "./store";

export interface ChatRoomState {
  chatRoomImg: string | null;
  channelName: string | null;
  description: string;
  chatRoomId: string | null;
  participants: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  userId: string | null;
  userName: string | null;
  chatRooms: ChatRoomState[];
  latestMessage: string | null;
}

const initialState: ChatRoomState = {
  channelName: "",
  chatRoomId: null,
  chatRoomImg: null,
  description: "",
  participants: [],
  userId: null,
  userName: null,
  status: "idle",
  error: null,
  chatRooms: [],
  latestMessage: null,
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
    const chatRoomRef = doc(db, "chatRooms", chatRoomId);
    const chatRoomSnap = await getDoc(chatRoomRef);

    if (!chatRoomSnap.exists()) {
      throw new Error("Chat room not found");
    }

    const chatRoomData = chatRoomSnap.data();

    const latestMessageQuery = query(
      collection(db, "chatRooms", chatRoomId, "messages"),
      orderBy("time", "desc"),
      limit(1)
    );
    const latestMessageSnapshot = await getDocs(latestMessageQuery);
    const latestMessage =
      latestMessageSnapshot.docs[0]?.data().text || "No messages yet";

    return {
      chatRoomImg: chatRoomData.chatRoomImg,
      channelName: chatRoomData.channelName,
      description: chatRoomData.description,
      chatRoomId: chatRoomId,
      participants: chatRoomData.participants || [],
      userId: chatRoomData.userId || null,
      userName: chatRoomData.userName || null,
      latestMessage,
      status: "idle",
      error: null,
      chatRooms: [],
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchChatRooms = createAsyncThunk<
  ChatRoomState[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("chatRoom/fetchChatRooms", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const user = state.auth.user;

  if (!user?.uid) {
    return rejectWithValue("User not authenticated");
  }

  try {
    // 사용자 정보 가져오기
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return rejectWithValue("User document not found");
    }

    const participatingRooms = userDoc.data().participatingRoom || [];

    // 참가한 방들 정보 가져오기
    const chatRoomList: ChatRoomState[] = await Promise.all(
      participatingRooms.map(async (roomId: string) => {
        const chatRoomDocRef = doc(db, "chatRooms", roomId);
        const chatRoomDoc = await getDoc(chatRoomDocRef);

        if (!chatRoomDoc.exists()) {
          return null;
        }

        const latestMessageQuery = query(
          collection(db, "chatRooms", roomId, "messages"),
          orderBy("time", "desc"),
          limit(1)
        );
        const latestMessageSnapshot = await getDocs(latestMessageQuery);
        const latestMessage =
          latestMessageSnapshot.docs[0]?.data().text || "No messages yet";

        return {
          chatRoomImg: chatRoomDoc.data().chatRoomImg,
          channelName: chatRoomDoc.data().channelName,
          description: chatRoomDoc.data().description,
          latestMessage,
          chatRoomId: chatRoomDoc.id,
          participants: chatRoomDoc.data().participants || [],
          userId: chatRoomDoc.data().userId || null,
          userName: chatRoomDoc.data().userName || null,
          status: "idle",
          error: null,
          chatRooms: [],
        };
      })
    );

    return chatRoomList.filter((room) => room !== null) as ChatRoomState[];
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
          state.participants = action.payload.participants;
          state.userId = action.payload.userId;
          state.userName = action.payload.userName;
          state.latestMessage = action.payload.latestMessage;
          state.error = null;
        }
      )
      .addCase(fetchChatRoomById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchChatRooms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchChatRooms.fulfilled,
        (state, action: PayloadAction<ChatRoomState[]>) => {
          state.status = "succeeded";
          state.chatRooms = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchChatRooms.rejected, (state, action) => {
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
