/*
*  2018-7-4 by shangguanMr
* */
'use strict';
//初始化数据；
let initialState = {
    data: {sons: [{hash: "", pathValue: ""}], leaf: "", root: "", pathValue: ""},
    useData: {result: {account: "", address: "", nonce: 1,}},//用户信息
    itemDetails: {result: {}},//每种类型的币的交易记录详细
    transactionData: {},//交易返回数据
    lastBlockData: {
        result: {
            height: "",
            timestamp: "",
            nonce: "",
            fee: "",
            totalFee: "",
            previousHash: "",
            currentHash: "",
            signature: "",
            body: "",
            round: {
                currentIndex: "",
                peers: [{peerId: "", address: "", port: "", addressVersion: "", accountAddress: ""}]
            },
            statRoot: "",
            txRoot: "",
            tokenRoot: ""
        }
    },
    blockData: {
        height: "",
        timestamp: "",
        nonce: "",
        fee: "",
        totalFee: "",
        previousHash: "",
        currentHash: "",
        signature: "",
        body: "",
        round: {
            currentIndex: "",
            peers: [{peerId: "", address: "", port: "", addressVersion: "", accountAddress: ""}]
        },
        statRoot: "",
        txRoot: "",
        tokenRoot: ""
    },
    readyBlockListData: {
        result: [
            {
                EventType: "",
                from: "",
                to: "",
                time: "",
                amount: "",
                fee: "",
                nonce: "",
                data: "",
                tokenAddress: "",
                sign: ""
            }]
    },
    BlockListData: {
        result: [
            {
                EventType: "",
                from: "",
                to: "",
                time: "",
                amount: "",
                fee: "",
                nonce: "",
                data: "",
                tokenAddress: "",
                sign: ""
            }]
    },
    init: true,
    isRefreshing: true

};

export default function wallet(state = initialState, action) {
    switch (action.type) {
        case "getWalletInfoSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false,
                isRefreshing: false
            });
        //最后一个区块
        case "getLastBlockSuccess":
            return Object.assign({}, state, {
                lastBlockData: action.data,
                init: false,
                isRefreshing: false
            });
        case "getLastBlockError":
            return Object.assign({}, state, {
                lastBlockData: initialState.lastBlockData,
                init: false,
                isRefreshing: false
            });

        //根据高度获取区块
        case "getBlocksSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "getBlocksError":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        //获取ready的交易列表
        case "readyTransactionListSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "readyTransactionListError":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        //获取block的交易列表
        case "blockTransactionListSuccess":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        case "blockTransactionListError":
            return Object.assign({}, state, {
                data: action.data,
                init: false
            });
        //处理请求失败时的页面卡死现象，（本地存储的数据在错误时取出） TODO；
        case "getUserInfoError":
            return Object.assign({}, state, {
                init: false,
                isRefreshing: false,
            });
        case "getUserInfoSuccess":
            return Object.assign({}, state, {
                init: false,
                useData: action.data,
                isRefreshing: false
            });
        case "getItemDetailsSuccess":
            return Object.assign({}, state, {
                init: false,
                itemDetails: action.data,
            });
        case "transactionDetailsSuccess":
            return Object.assign({}, state, {
                init: false,
                transactionData: action.data
            });
        case "transactionDetailsError":
            return Object.assign({}, state, {
                init: false,
            });
        default:
            return state;
    }
}
