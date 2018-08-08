import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    I18nManager,
    AsyncStorage,
} from 'react-native';

// 全局注入store，页面传参都要用到store
import {Provider} from "react-redux";
// 获取store实例
import configureStore from './store/configer'

global.store = configureStore();

//全局注入Storage
import Storage from 'react-native-storage'

var storage = new Storage({
    //最大存储量 默认1000条数据循环存储
    size: 1000,

    //存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    //如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    //数据过期时间，默认一整天(1000 * 3600 * 24 毫秒)，设为null永不过期
    defaultExpires: null,

    //读写时在内存中缓存数据。默认启用
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // 或是写到另一个文件里，这里require引入
    // sync: require('你可以另外写一个文件专门处理sync')


})
//全局范围内创建一个（且只有一个）storage实例，方便直接调用
global.storage = storage;


console.disableYellowBox = true
import {
    StackNavigator,
} from "react-navigation";

import getSceneIndicesForInterpolationInputRange
    from 'react-navigation/src/utils/getSceneIndicesForInterpolationInputRange'

import App from "./App";
import AboutUs from "./layouts/aboutUs";
import AssetDetails from "./layouts/assetDetails";
import CreateSuccess from "./layouts/createSuccess";
import CreateToken from "./layouts/createToken";
// import CreateToken2 from "./layouts/createToken2";
// import CreateToken3 from "./layouts/createToken3";
import CurrencyList from "./layouts/currencyList";
import ExDetails from "./layouts/exDetails";
import ExEkt from "./layouts/exEkt";
import InPk from "./layouts/inPk";
import Splash from "./layouts/splash";
// import Lock from "./layouts/lock";
import Qr from "./layouts/qr";
import CreateWallet from "./layouts/createWallet";
import WakeUp from "./layouts/wakeUp";
import Setting from "./layouts/me/setting";
import ChangePas from './layouts/changePas' ;
import SetPass from './layouts/setPass'
import OutCoin1 from './layouts/outCoin1';
import OutCoin2 from './layouts/outCoin2';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
const IMG_LEFTROW = require('./assets/img/leftrow.png');

const StackOptions = ({navigation, backgroundColor, color, backRouter}) => {
    let {state, goBack} = navigation;
    const headerStyle = {backgroundColor: backgroundColor};
    const headerTitle = state.params ? state.params.headerTitle : null;
    const headerTitleStyle = {
        color: color,
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 2,
        fontWeight: '400',
        fontFamily: 'PingFangSC-Regular'
    };
    const headerBackTitle = null;
    const headerLeft = (
        <TouchableOpacity style={{width: 16, marginLeft: 16}} onPress={() => {
            goBack(backRouter);
        }}>
            <Image source={IMG_LEFTROW} style={{height: 16, width: 8}}></Image>
        </TouchableOpacity>
    );
    return {
        headerStyle,
        headerTitle,
        headerTitleStyle,
        headerLeft,
        headerBackTitle,
    }
}
//以后好扩展（写成类的格式）
class Navigation extends Component {
    constructor(props) {
        super(props);

    }
    componentWillMount(){

    }
    componentDidMount() {
        SplashScreen.hide();

    }

    render() {
        return (<Provider store={global.store}>
            <RootStack/>
        </Provider>)
    }
}

// const Navigation = () => {
//     return (
//         <Provider store={global.store}>
//             <RootStack/>
//         </Provider>
//
//     );
// }
const RootStack = StackNavigator(
    {   //打开app加载动态logo
        Splash: {
            screen: Splash,
            navigationOptions: {
                header: null
            }
        },
        App: {
            screen: App,
            navigationOptions: {
                header: null
            },
        },

        AboutUs: {
            screen: AboutUs,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //资产详情 总资产+各种token的数目和价值
        AssetDetails: {
            screen: AssetDetails,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //创建成功
        CreateSuccess: {
            screen: CreateSuccess,
        },
        //创建token1
        CreateToken: {
            screen: CreateToken,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        // //创建token2
        // CreateToken2: {
        // 	screen: CreateToken2 ,
        // },
        // //创建token3
        // CreateToken3: {
        // 	screen: CreateToken3 ,
        // },
        //创建钱包
        CreateWallet: {
            screen: CreateWallet,
            navigationOptions: {
                header: null
            }
        },
        //显示关注货币自定义列表
        CurrencyList: {
            screen: CurrencyList,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //交易详情
        ExDetails: {
            screen: ExDetails,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //钱包二维码复制&&展示
        ItemDeExEkttail: {
            screen: ExEkt,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })

        },
        //扫描二维码
        Qr: {
            screen: Qr,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                backRouter: null
            })
        },
        // Lock: {
        //     screen: Lock ,
        // },
        //唤醒页面
        WakeUp: {
            screen: WakeUp,
            navigationOptions: {
                header: null
            }
        },
        //设置页面
        Setting: {
            screen: Setting,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //导入私钥
        InPk: {
            screen: InPk,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //修改密码
        ChangePas: {
            screen: ChangePas,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //设置交易密码
        SetPass: {
            screen: SetPass,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
        //转出1=>扫描二维码
        OutCoin1: {
            screen: OutCoin1,
        },
        //转出2=>输入支付密码确认转出
        OutCoin2: {
            screen: OutCoin2,
            navigationOptions: ({navigation}) => StackOptions({
                navigation,
                backgroundColor: '#ffffff',
                color: '#231815',
                backRouter: null
            })
        },
    },
    {
        initialRouteName: 'Splash',
        //修改安卓页面跳转为从右到左
        transitionConfig: () => ({
            screenInterpolator: sceneProps => {
                const {layout, position, scene} = sceneProps;

                const interpolate = getSceneIndicesForInterpolationInputRange(sceneProps);

                if (!interpolate) return {
                    opacity: 0
                };

                const {first, last} = interpolate;
                const index = scene.index;
                const opacity = position.interpolate({
                    inputRange: [first, first + 0.01, index, last - 0.01, last],
                    outputRange: [0, 1, 1, 0.85, 0],
                });

                const width = layout.initWidth;
                const translateX = position.interpolate({
                    inputRange: [first, index, last],
                    outputRange: I18nManager.isRTL
                        ? [-width, 0, width * 0.3]
                        : [width, 0, width * -0.3],
                });
                const translateY = 0;

                return {
                    opacity,
                    transform: [{translateX}, {translateY}],
                };
            },
        })
    }
);

export default Navigation;
