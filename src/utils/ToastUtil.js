'use strict';
/*
*
* 轻提示;  https://github.com/magicismight/react-native-root-toast
* */

//使用方法：  toastShort("提示内容");

import Toast from 'react-native-root-toast';

let toast;
export const toastShort = (content) => {
    if (toast !== undefined) {
        Toast.hide(toast);
    }
    toast = Toast.show(content.toString(), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.CENTER,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0
    });
};