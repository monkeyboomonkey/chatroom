import chatroomReducer from "../client/util/chatroomReducer.ts";
import { initialState } from "../client/util/chatroomReducer.ts";
import { setUser, setCurrentChatroom, 
         setCurrentCategories, 
         addCategory, 
         setIsAuth, 
         setUserIdentity,
         addNewChat, } from "../client/util/chatroomReducer.ts";
   
    
  const reducer = chatroomReducer;

test('actions test', ()=> {

    const state = initialState;
    const actionSetUser = setUser('Emma');
    expect(reducer(state, actionSetUser).username).toEqual('Emma');

    const actionSetCurrentChatroom = setCurrentChatroom('1');
    expect(reducer(state, actionSetCurrentChatroom).currentChatroom).toEqual('1');

    const actionAddCategory = addCategory('codesmith');

    expect(reducer(state, actionAddCategory).categories[1]).toBe('codesmith');

    const actionSetCurrentCategories = setCurrentCategories(['test', 'avatar']);

    expect(reducer(state, actionSetCurrentCategories).categories).toEqual(['test', 'avatar']);

    const actionSetIsAuth = setIsAuth(true);
    expect(reducer(state, actionSetIsAuth).isAuth).toEqual(!false);

    const actionSetUserIdentity = setUserIdentity({fn : "Terry" , ln: "Mcginnis" , email: "terryMcginnis@gmail.com" , username: 'terry Mcginnis'})

    expect(reducer(state, actionSetUserIdentity).userIdentity).toEqual({fn : "Terry" , ln: "Mcginnis" , email: "terryMcginnis@gmail.com", username: 'terry Mcginnis'});

    const actionAddNewChat = addNewChat({username : 'Terry', message : 'hi'});

    expect(reducer(state, actionAddNewChat).currentChatroomState[0]).toEqual({username : 'Terry', message : 'hi'});

})


