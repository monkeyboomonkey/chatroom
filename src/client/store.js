/**
 * ************************************
 *
 * @module  store.js
 * @author
 * @date
 * @description Redux 'single source of truth'
 *
 * ************************************
 */

import { composeWithDevTools } from 'redux-devtools-extension';
import { configureStore } from '@reduxjs/toolkit';
import marketsReducer from './reducers/marketsReducer';


// we are adding composeWithDevTools here to get easy access to the Redux dev tools
const store = configureStore({reducer: marketsReducer});

export default store;