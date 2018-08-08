/*
*2018-7-4  by shangguanMr;
* */
//个人页面的action；
//引入对应的接口地址；
import {API_CONFIG} from "../../../services/api";
import {xFetch} from "../../../utils/xfetch";

//根据hash值获取value
export function getWallet(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/db/api/getByHex";
        console.log(url);

        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch({type: "getWalletInfoSuccess", data: res});
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch({type: "getWalletInfoError", msg: err});//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}


//获取最后一个区块
export function getLastBlock(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/block/api/last";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(getLastBlockSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(getLastBlockError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function getLastBlockSuccess(data) {
    return {
        type: "getLastBlockSuccess",
        data: data
    }
}

function getLastBlockError(err) {
    return {
        type: "getLastBlockError",
        data: err
    }
}

//根据高度获取区块
export function getBlocks(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/block/api/blockByHeight";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(getBlocksSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(getBlocksError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function getBlocksSuccess(data) {
    return {
        type: "getBlocksSuccess",
        data: data
    }
}

function getBlocksError(err) {
    return {
        type: "getBlocksError",
        data: err
    }
}


//获取用户账户信息
export function getUserInfo(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/account/api/info";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(getUserInfoSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(getUserInfoError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function getUserInfoSuccess(data) {
    return {
        type: "getUserInfoSuccess",
        data: data
    }
}

function getUserInfoError(err) {
    return {
        type: "getUserInfoError",
        data: err
    }
}

//查看每条交易的详细  todo 暂时不用
export function getItemDetails(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/db/api/getByHex";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(getItemDetailsSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(getItemDetailsError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function getItemDetailsSuccess(data) {
    return {
        type: "getItemDetailsSuccess",
        data: data
    }
}

function getItemDetailsError(err) {
    return {
        type: "getItemDetailsError",
        data: err
    }
}


//交易接口（转出）
export function transactionDetails(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/transaction/api/newTransaction";
        console.log(url);
        return xFetch(url, {
            method: "POST",
            body: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(transactionDetailsSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(transactionDetailsError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function transactionDetailsSuccess(data) {
    return {
        type: "transactionDetailsSuccess",
        data: data
    }
}

function transactionDetailsError(err) {
    return {
        type: "transactionDetailsError",
        data: err
    }
}

//获取ready的交易列表
export function readyTransactionList(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/transaction/api/queueTxs";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            body: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(readyTransactionListSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(readyTransactionListError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function readyTransactionListSuccess(data) {
    return {
        type: "readyTransactionListSuccess",
        data: data
    }
}

function readyTransactionListError(err) {
    return {
        type: "readyTransactionListError",
        data: err
    }
}
//获取block的交易列表
export function blockTransactionList(params) {
    return dispatch => {
        let url = API_CONFIG.host + "/transaction/api/blockTxs";
        console.log(url);
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch(blockTransactionListSuccess(res));
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch(blockTransactionListError(err));//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}

function blockTransactionListSuccess(data) {
    return {
        type: "blockTransactionListSuccess",
        data: data
    }
}

function blockTransactionListError(err) {
    return {
        type: "blockTransactionListError",
        data: err
    }
}
