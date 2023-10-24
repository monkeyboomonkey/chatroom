import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomReducer.ts';
const store = configureStore({reducer: {chatroomReducer}});
export default store;