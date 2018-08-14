/**
 * 项目初始化内容
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {height,width, navigationResetTo,getStorage,resetNavigation} from '../utils/common_utils'

const launchgif = require('../assets/img/toplaunch.gif');
const logo = require('../assets/img/logo.png');

export default class Launch extends Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        SplashScreen.hide();
        let address = await getStorage('address')
        let privkey = await getStorage('privkey') 
        console.log("===>",typeof(address),privkey,address&&privkey);
        let {navigation} = this.props;
        console.log("xxxx", navigation, this.props);
        if (address&&privkey) {
            setTimeout(() => {
                this.props.navigation.dispatch(resetNavigation(0, "WakeUp", {
                    showBackUp: false,
                    addressEKT: address,
                    privkey: privkey
                }))
            }, 500)
        }else{
            setTimeout(() => {
                // navigationResetTo(0,navigation, "CreateWallet");
                this.props.navigation.dispatch(resetNavigation(0,'CreateWallet'))
            }, 500)
        }
    }

    welcome = () => {
        return (
            <View style={styles.onLaunch} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
                <ImageBackground
                    source={launchgif}
                    style={{width: width, height: 200, marginTop: 200}}/>
                <View style={styles.bottomSign}>
                    <ImageBackground
                        source={logo}
                        style={styles.bottomImg}/>
                    <Text style={{color: '#7d7d7d', textAlign: 'center'}}>Copyright © 2018 EKT版权所有</Text>
                </View>
            </View>
        )
    }

    componentWillUnmount() {
        // setTimeout(() => {
        //     SplashScreen.hide();
        // }, 5000);
    }

    render() {
        return (
            <View>
                {this.welcome()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    onLaunch: {
        backgroundColor: '#000',
        height: height,
        position: 'relative'
    },
    bottomSign: {
        position: 'absolute',
        bottom: 10,
        width: '100%'
    },
    bottomImg: {
        width: 20,
        height: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 7
    }
});
