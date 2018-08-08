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
import {height,width, navigationResetTo} from '../utils/common_utils'

const launchgif = require('../assets/img/toplaunch.gif');
const logo = require('../assets/img/logo.png');

export default class Launch extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        SplashScreen.hide();
        const {navigation} = this.props;
        console.log("xxxx", navigation, this.props);
        setTimeout(() => {
            navigationResetTo(navigation, "CreateWallet");
        }, 500)

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
