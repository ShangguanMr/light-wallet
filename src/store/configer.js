/**
 *2018-7-4  by shangguanMr;
 **/
'use strict';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);
    return store;
}