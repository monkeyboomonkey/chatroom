// // import { createSlice } from '@reduxjs/toolkit'
// import { PayloadAction } from '@reduxjs/toolkit'
// // import { configureStore } from '@reduxjs/toolkit'
// import pkg from '@reduxjs/toolkit';
// const { createSlice, configureStore, current } = pkg;

// interface User {
//   userid: string;
//   fn: string;
//   ln: string; 
//   email:String;
//   password: String;
//   username: String;
// }

// interface Chats {
//   [key: string]: Chatlog[]
// }

// interface Chatlog {
//   message: string;
//   timestamp: string;
// }

// interface UserState {
//   user: User | null;
//   chats: Chats;

// }

// const initialState = {
//   user: null,
//   // {chatroom1:[{c1_obj1}, {c1_obj1},...], chatroom2:[{c2_obj1}, {c2_obj1},...]}
//   chats: {}
// } as UserState;

// const chatroomSlice = createSlice({
//   name: 'chatroom_user',
//   initialState,
//   reducers: {
//     userLogin(state, action: PayloadAction<User>) {
//       state.user = action.payload;
//       // console.log(current(state));
//     },
//     userLogout(state) {
//       state.user = null;
//       // console.log(current(state));
//     },
//     postChat(state, action: PayloadAction<{chatroom: string, chatlog: Chatlog}>) {
//       if(state.chats[action.payload.chatroom]){
//         state.chats[action.payload.chatroom].push(action.payload.chatlog);
//       }
//       else{
//         state.chats[action.payload.chatroom] = [action.payload.chatlog];
//       }
//       // console.log(current(state));
//     },
//   },
// })

// // all tests passed
// const store = configureStore({reducer: chatroomSlice.reducer})
// // store.dispatch(chatroomSlice.actions.userLogin({fn: 'fn', ln:'ln', userid:'userid', email:'email', password:'password', username:'testusername'}));
// // store.dispatch(chatroomSlice.actions.userLogout());
// // store.dispatch(chatroomSlice.actions.userLogin({fn: 'fn', ln:'ln', userid:'userid', email:'email', password:'password', username:'testusername2'}));

// // store.dispatch(chatroomSlice.actions.postChat({chatroom: 'chatroom1', chatlog: {message: 'hello world', timestamp:'12345'}}));

// export const { userLogin, userLogout, postChat } = chatroomSlice.actions
// export default chatroomSlice.reducer