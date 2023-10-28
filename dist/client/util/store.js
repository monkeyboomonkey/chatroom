import { configureStore } from '@reduxjs/toolkit';
import chatroomReducer from './chatroomReducer';
const store = configureStore({ reducer: { chatroomReducer } });
export default store;
//# sourceMappingURL=store.js.map