import chatroomReducer from "../client/util/chatroomReducer.ts";
import { initialState } from "../client/util/chatroomReducer.ts";
import { setCurrentChatroom, 
         setCurrentCategories, 
         addCategory, 
         setIsAuth, 
         setUserIdentity,
         addNewChat, } from "../client/util/chatroomReducer.ts";
   
    
  const reducer = chatroomReducer;

test('actions test', ()=> {

const state = initialState;

 const actionSetCurrentChatroom = setCurrentChatroom('1');
    expect(reducer(state, actionSetCurrentChatroom).currentChatroom).toEqual('1');

    const actionAddCategory = addCategory('codesmith');

    expect(reducer(state, actionAddCategory).categories[0]).toBe('codesmith');

    const actionSetCurrentCategories = setCurrentCategories(['test', 'avatar']);

    expect(reducer(state, actionSetCurrentCategories).categories).toEqual(['test', 'avatar']);

    const actionSetIsAuth = setIsAuth(true);
    expect(reducer(state, actionSetIsAuth).isAuth).toEqual(!false);

    const userDetails = {fn: "Terry" , ln: "Mcginnis" , email: "terryMcginnis@gmail.com" , username: 'terry Mcginnis', pictureURL: 'test'};
    const actionSetUserIdentity = setUserIdentity(userDetails);

    expect(reducer(state, actionSetUserIdentity).userIdentity).toEqual(userDetails);

    const actionAddNewChat = addNewChat({username : 'Terry', message : 'hi'});

    expect(reducer(state, actionAddNewChat).currentChatroomState[0]).toEqual({username : 'Terry', message : 'hi'});

})


