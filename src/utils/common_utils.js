/*
*  2018-7-4  by shangguanMr;
*  description :（工具库）
*  封装的方法放在此文件下；
* */
'use strict';

import {Dimensions, Platform} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation'

//重置navigation
export function navigationResetTo(navigation, routeName) {
    console.log("xxx", NavigationActions, StackActions);
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName})]
    });
    navigation.dispatch(resetAction);
}

//设备宽高；
export let width = Dimensions.get("window").width;
export let height = Dimensions.get("window").height;

//判断设备；
export let isIos = Platform.OS === 'ios';
export let isAndroid = Platform.OS === 'android';

//判断iphoneX设备；
// iPhoneX屏幕大小；
const X_WIDTH = 375;
const X_HEIGHT = 812;

export function isIphoneX() {
    return (
        isIos && ((height === X_HEIGHT && width === X_WIDTH) || (height === X_WIDTH && width === X_HEIGHT))
    )
}

export var navStyle = {
    ...ifIphoneX({
        paddingTop: 20,
        height: 68
    }, {
        paddingTop: 0,
        height: 48,
    })
    // Platform.OS === 'ios' ? 20 : 0,  // 处理iOS状态栏
    // height: Platform.OS === 'ios' ? 68 : 48,   // 处理iOS状态栏
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
    if (isIphoneX()) {
        return iphoneXStyle;
    } else {
        return regularStyle
    }
}

//判断ios版本
export let iosVersion = (isIos && Platform.Version.split(".")[0]) ? Platform.Version.split(".")[0] : false;


/**
 *
 * @param key: 保存的key值
 * @param object: 保存的value
 * @param expires: 有效时间，
 */
export function setStorage(key, object, expires = null) {
    console.log("key ,object, expires-=====", key, object, expires);
    storage.save({
        key: key,  // 注意:请不要在key中使用_下划线符号!
        data: object,
        expires: expires
    }).catch((e) => {
        console.log("e-=====", e);
    });

}

//	获取 storage 数据
// 参数1 : key : string
// getStorage("location").then(result => result).catch(err => err)
export function getStorage(key) {
    return new Promise((resolve, reject) => {
        storage.load({
            key: key,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,

            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
            syncInBackground: true,

            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: {
                    // 各种参数
                },
                someFlag: true,
            },
        }).then(ret => {
            // 如果找到数据，则在then方法中返回
            console.log("获取到的" + key + "数据", ret);
            return resolve(ret)
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.log("读取" + key + "失败", err);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    console.log("NotFoundError", err.name);
                    return resolve("")
                    // break;
                case 'ExpiredError':
                    // TODO
                    console.log("ExpiredError", err.name);
                    // break;
            }
            return reject("")
        });
    })
}

export function removeStorage(key) {
    // 删除单个数据
    storage.remove({
        key: key,
    });
}

export function removeAll() {
    // 移除所有"key-id"数据（但会保留只有key的数据）
    storage.clearMap();
}

//  清除 storage里某个key下所有数据
export function clearDataByKey(key) {
// !! 清除某个key下的所有数据
    console.log("this is clearHistorySearch");
    storage.clearMapForKey(key);
}

//路由重定向reset封装
export function resetFP(index = 0, routeName, params = {}) {
    return StackActions.reset({
        index: index,
        actions: [
            NavigationActions.navigate({
                routeName: routeName,
                params: params
            })
        ],

    });
}
