/*
* 2018-7-4  by shangguanMr;
* */
'use strict';
import {combineReducers} from 'redux';
import me from "../reducers/me/me";
import wallet from "../reducers/wallet/wallet";


//合并所有的reducer
const rootReducer = combineReducers({
    me,
    wallet
});
export default rootReducer;