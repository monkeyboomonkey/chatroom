import type { PayloadAction } from '@reduxjs/toolkit'
import * as pkg from '@reduxjs/toolkit';
const { createSlice } = pkg;

// interface User {
//   userid: string;
//   fn: string;
//   ln: string; 
//   email: string;
//   password: string;
//   username: string;
// }

interface Chats {
  [key: string]: Chatlog[]
}

interface Chatlog {
  message: string;
  timestamp: string;
}

interface UserState {
  username: string | null;
  chats: Chats;
  currentChatroom: string | null;
  categories: string[];
  isAuth: boolean | null;
  userIdentity: {
    fn: string;
    ln: string;
    email: string;
  }
}

const initialState: UserState = {
  username: null,
  chats: {},
  currentChatroom: null,
  categories: ['lobby'],
  isAuth: null,
  userIdentity: {
    fn: '',
    ln: '',
    email: ''
  },
};

const chatroomSlice = createSlice({
  name: 'chatroomSlice',
  initialState,
  reducers: {
    postChat(state, action: PayloadAction<{chatroom: string, chatlog: Chatlog}>) {
      if (state.chats[action.payload.chatroom]) {
        state.chats[action.payload.chatroom].push(action.payload.chatlog);
      }
      else {
        state.chats[action.payload.chatroom] = [action.payload.chatlog];
      }
    },
    setUser(state, action: PayloadAction<string>) {
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
    },
    setUserIdentity (state, action: PayloadAction<{fn: string, ln: string, email: string, username?: string}>) {
      state.userIdentity = action.payload;
      if (action.payload.username) {
        state.username = action.payload.username;
      }
    }
  },
})

export const { postChat, setUser, setCurrentChatroom, setCurrentCategories, addCategory, setIsAuth, setUserIdentity } = chatroomSlice.actions
export default chatroomSlice.reducer