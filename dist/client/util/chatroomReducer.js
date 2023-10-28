import * as pkg from '@reduxjs/toolkit';
const { createSlice } = pkg;
const initialState = {
    username: null,
    currentChatroomState: [],
    currentChatroom: null,
    categories: [],
    isAuth: null,
    userIdentity: {
        fn: '',
        ln: '',
        email: '',
        pictureURL: "",
    },
};
const chatroomSlice = createSlice({
    name: 'chatroomSlice',
    initialState,
    reducers: {
        setCurrentChatroom(state, action) {
            state.currentChatroom = action.payload;
            state.currentChatroomState = [];
        },
        setCurrentCategories(state, action) {
            state.categories = action.payload;
        },
        addCategory(state, action) {
            state.categories.push(action.payload);
        },
        setIsAuth(state, action) {
            if (action.payload === false) {
                return initialState;
            }
            else {
                state.isAuth = action.payload;
            }
        },
        setUserIdentity(state, action) {
            state.userIdentity = Object.assign(Object.assign({}, state.userIdentity), action.payload.userIdentity);
            if (action.payload.username && action.payload.username !== state.username) {
                state.username = action.payload.username;
            }
        },
        addNewChat(state, action) {
            state.currentChatroomState.push(action.payload);
        },
    },
});
export const { setCurrentChatroom, setCurrentCategories, addCategory, setIsAuth, setUserIdentity, addNewChat, } = chatroomSlice.actions;
export default chatroomSlice.reducer;
//# sourceMappingURL=chatroomReducer.js.map