import type { PayloadAction } from '@reduxjs/toolkit'
import * as pkg from '@reduxjs/toolkit';
const { createSlice } = pkg;

export interface Chat {
  username: string;
  message: any;
  userProfilePic?: string;
  type?: string;
}


export interface UserState {
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

const initialState: UserState = {
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
    setCurrentChatroom(state, action: PayloadAction<string | null>) {
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
    setUserIdentity (state, action: PayloadAction<{userIdentity: {fn: string, ln: string, email: string, pictureURL: string}, username?: string}>) {
      state.userIdentity = {...state.userIdentity, ...action.payload.userIdentity}
      if (action.payload.username && action.payload.username !== state.username) {
        state.username = action.payload.username;
      }
    },
    addNewChat(state, action: PayloadAction<{username: string, message: string | {type: string, url: string}, userProfilePic?: string}>) {
      state.currentChatroomState.push(action.payload);
    },
  },
});

export const { 
  setCurrentChatroom, 
  setCurrentCategories, 
  addCategory, 
  setIsAuth, 
  setUserIdentity,
  addNewChat,
} = chatroomSlice.actions

export default chatroomSlice.reducer