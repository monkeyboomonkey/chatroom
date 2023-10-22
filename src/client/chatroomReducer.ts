import type { PayloadAction } from '@reduxjs/toolkit'
import * as pkg from '@reduxjs/toolkit';
const { createSlice } = pkg;

interface User {
  userid: string;
  fn: string;
  ln: string; 
  email: string;
  password: string;
  username: string;
}

interface Chats {
  [key: string]: Chatlog[]
}

interface Chatlog {
  message: string;
  timestamp: string;
}

interface UserState {
  username: User | null;
  chats: Chats;
  currentChatroom: string | null;
  categories: string[];
  isAuth: boolean | null;
}

const initialState: UserState = {
  username: null,
  chats: {},
  currentChatroom: null,
  categories: ['lobby'],
  isAuth: null,
};

const chatroomSlice = createSlice({
  name: 'chatroomSlice',
  initialState,
  reducers: {
    userLogin(state, action: PayloadAction<User>) {
      state.username = action.payload;
    },
    userLogout(state) {
      state.username = null;
    },
    postChat(state, action: PayloadAction<{chatroom: string, chatlog: Chatlog}>) {
      if (state.chats[action.payload.chatroom]) {
        state.chats[action.payload.chatroom].push(action.payload.chatlog);
      }
      else {
        state.chats[action.payload.chatroom] = [action.payload.chatlog];
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.username = action.payload;
    },
    setCurrentChatroom(state, action: PayloadAction<string>) {
      state.currentChatroom = action.payload;
    },
    setCurrentCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<string>) {
      state.categories.push(action.payload);
    },
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    }
  },
})

export const { userLogin, userLogout, postChat, setUser, setCurrentChatroom, setCurrentCategories, addCategory, setIsAuth } = chatroomSlice.actions
export default chatroomSlice.reducer