import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface User {
  userid: string;
  fn: string;
  ln: string; 
  email:String;
  password: String;
  username: String;
}
const initialState = {user: null};

const chatroomSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
  },
})

const chatroomReducer = createSlice(initialState, (builder) => {

  builder
    .addCase(actionCreators.addMarketActionCreator, (state, action) => {

      // increment lastMarketId and totalMarkets counters
      state.lastMarketId = state.lastMarketId + 1;
      state.totalMarkets = state.totalMarkets + 1;
      // create the new market object from provided data
      const newMarket = {
        // what goes in here?
        marketCard: 0,
        marketId: state.lastMarketId,
        location:action.payload
      };

      // push the new market onto a copy of the market list
      state.marketList.push(newMarket);

    })
    // case types.SET_NEW_LOCATION: 
    //   break;
    .addCase(actionCreators.addCardActionCreator, (state, action) => {
      state.totalCards = state.totalCards + 1;
      state.marketList.filter(market => market.marketId === action.payload)[0].marketCard++;
    })
    .addCase(actionCreators.deleteCardActionCreator, (state, action) => {
      const targetMarket = state.marketList.filter(market => market.marketId === action.payload)[0];
      if(targetMarket.marketCard - 1 >= 0){
        targetMarket.marketCard--;
        state.totalCards = state.totalCards - 1;
      }
    })
    
});

export default marketsReducer;
