import type { PayloadAction } from '@reduxjs/toolkit'
import * as pkg from '@reduxjs/toolkit';
import { stat } from 'fs';
const { createSlice } = pkg;

interface Chat {
  username: string;
  message: string;
}

interface UserState {
  username: string | null;
  directMessages: {
    [key: string]: Chat[];
  }
  currentChatroomState: Chat[];
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
  directMessages: {},
  currentChatroomState: [],
  currentChatroom: null,
  categories: [],
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
    setUser(state, action: PayloadAction<UserState>) {
      state.username = action.payload.username;
      if (action.payload.userIdentity) {
        state.userIdentity = {...state.userIdentity, ...action.payload.userIdentity};
      }
    },
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
    setUserIdentity (state, action: PayloadAction<{fn: string, ln: string, email: string, username?: string}>) {
      state.userIdentity = action.payload;
      if (action.payload.username) {
        state.username = action.payload.username;
      }
    },
    addNewChat(state, action: PayloadAction<{username: string, message: string}>) {
      state.currentChatroomState.push(action.payload);
    },
    addDirectMessageRoom(state, action: PayloadAction<{roomName: string}>) {
      state.directMessages[action.payload.roomName] = [];
    },
    addDirectMessage(state, action: PayloadAction<{roomName: string, message: string, username: string}>) {
      state.directMessages[action.payload.roomName].push({username: action.payload.username, message: action.payload.message});
    },
  },
})

export const { 
  setUser, 
  setCurrentChatroom, 
  setCurrentCategories, 
  addCategory, 
  setIsAuth, 
  setUserIdentity,
  addNewChat,
  addDirectMessageRoom,
  addDirectMessage
} = chatroomSlice.actions

export default chatroomSlice.reducer