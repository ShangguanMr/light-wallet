/*
*2018-7-4  by shangguanMr;
* */
//个人页面的action；
//引入对应的接口地址；
import {API_CONFIG} from "../../../services/api";
import {xFetch} from "../../../utils/xfetch";


export function getUserInfo(params) {
    return dispatch => {
        let url = API_CONFIG.host + "";
        return xFetch(url, {
            method: "GET",
            params: params
        }).then((res) => {
            console.log("请求数据成功==>>>", res);
            dispatch({type: "getUserInfoSuccess", data: res});
            return Promise.resolve(res);
        }).catch((err) => {
            dispatch({type: "getUserInfoError", msg: err});//或者全局去处理错误；
            console.log("数据请求失败==>>>", err);
            return Promise.reject(err);
        })
    }
}