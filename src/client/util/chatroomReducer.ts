import type { PayloadAction } from '@reduxjs/toolkit'
import * as pkg from '@reduxjs/toolkit';
const { createSlice } = pkg;

interface Chat {
  username: string;
  message: string;
}

interface UserState {
  username: string | null;
  currentChatroomState: Chat[];
  currentChatroom: string | null;
  categories: string[];
  isAuth: boolean | null;
  userIdentity: {
    fn: string;
    ln: string;
    email: string;
    pictureURL: string;
  }
}

export const  initialState: UserState = {
  username: null,
  currentChatroomState: [],
  currentChatroom: null,
  categories: [],
  isAuth: null,
  userIdentity: {
    fn: '',
    ln: '',
    email: '',
    pictureURL:"",
  },
};

const chatroomSlice = createSlice({
  name: 'chatroomSlice',
  initialState,
  reducers: {
    setCurrentChatroom(state, action: PayloadAction<string>) {
      state.currentChatroom = action.payload;
      state.currentChatroomState = [];
    },
    setCurrentCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<string>) {
      state.categories.push(action.payload);
    },
    setIsAuth(state, action: PayloadAction<boolean>) {
      if (action.payload === false) {
        return initialState;
      } else {
        state.isAuth = action.payload;
      }
    },
    setUserIdentity (state, action: PayloadAction<{fn: string, ln: string, email: string, username?: string, pictureURL: string}>) {
      // state.userIdentity = action.payload;
      state.userIdentity = {...state.userIdentity,...action.payload}
      if (action.payload.username && action.payload.username !== state.username) {
        state.username = action.payload.username;
      }
    },
    addNewChat(state, action: PayloadAction<{username: string, message: string}>) {
      state.currentChatroomState.push(action.payload);
    },
  },
})

export const { 
  setCurrentChatroom, 
  setCurrentCategories, 
  addCategory, 
  setIsAuth, 
  setUserIdentity,
  addNewChat,
} = chatroomSlice.actions

export default chatroomSlice.reducer