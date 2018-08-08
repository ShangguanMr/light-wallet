/*
*  2018-7-4 by shangguanMr
* */
'use strict';
//初始化数据；
let initialState = {
    data: {title:"测试redux",users:[]},
    init: true,

};

export default function me(state = initialState, action) {
    switch (action.type) {
        case "getUserInfoSuccess":
            return Object.assign({}, state, {
                data:action.data,
                init:false
            });
        default:
            return state;
    }
}