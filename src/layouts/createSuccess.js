/**
 * 注册成功页
 */

import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Clipboard,
    TouchableOpacity,
    WebView,
    Platform,
    InteractionManager
} from "react-native";
import Toast from '../components/toast';
import {resetNavigation} from '../utils/common_utils'

const IMG_LEFTROW = require('../assets/img/leftrow.png')


export default class createSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pressTextToast: '备份私钥匙',
            pressText: "备份私钥匙",
            myToken: '我的私密匙',
            btnContent: '私钥是钱包资产唯一的恢复方式，私钥一旦丢失，无法找回，无法恢复资产。复制钱包私钥后，将其粘贴至安全的地方保存。请勿将该私钥告知任何人。',
            toastList: [
                {pressFn: this._hideToast, btnTitle: '我已知晓'}
            ],
            tokenList: [
                {pressFn: this._hideKey.bind(this), btnTitle: '复制'}
            ],
            content: '',
            showToast: false,
            showToken: false,

            //确定是否导出私钥 未导出需要在 我=>导出私钥 后显示 (请备份)
            showBackUp: true,

            password: ''
        };
    }

    componentWillMount() {
        this.props.navigation.setParams({
            navigatePress: this.navigatePress,
        })
    }

    navigatePress = () => {
        let {showBackUp} = this.state;
        let {privkey, addressEKT} = this.props.navigation.state.params;
        console.log('====>', addressEKT)
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.dispatch(resetNavigation(0, 'App', {
                showBackUp: showBackUp,
                addressEKT: addressEKT,
                privkey: privkey
            }))
        })

    }
    _hideToast = () => {
        console.log("xxxxxx")
        this.setState({
            showToast: false,
            showToken:true
        })
    };
    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params ? navigation.state.params.headerTitle : null,
        headerLeft: (
            //返回制定页面App
            <TouchableOpacity onPress={navigation.state.params ? navigation.state.params.navigatePress : null}>
                <Image source={IMG_LEFTROW} style={{marginLeft: 16, height: 16, width: 8}}></Image>
            </TouchableOpacity>
        ),
        headerTitleStyle: {
            color: '#231815',
            fontSize: 18,
            textAlign: 'center',
            letterSpacing: 2,
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular'
        },
        headerBackTitle: null,
        headerTitle: '备份私钥',
        headerStyle: {backgroundColor: '#ffffff'},
    });

    contentFn = (key) => {
        return (
            <View style={{
                backgroundColor: '#ffcb00',
                marginLeft: 10,
                marginRight: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10
            }}>
                <Text style={{lineHeight: 17, color: '#ffffff'}}>{key}</Text>
            </View>
        )
    }

    async _hideKey() {
        // 点击复制个人privkey
        let {privkey} = this.props.navigation.state.params;
        Clipboard.setString(privkey);
        try {
            let content = await Clipboard.getString();
            this.setState({
                showToken: false,
                content: content,
                pressText: '我已完成备份',

            });
        } catch (e) {
            this.setState({
                content: e.message,
                showToken: false
            });
        }
    }

    noticeBackup() {
        this.setState({
            showToast: true,
            showBackUp: false,
        })
    }

    render() {
        let {showToast, showToken, toastList, tokenList, pressText, myToken, btnContent, pressTextToast} = this.state;
        let {privkey} = this.props.navigation.state.params;
        return (
            <View style={styles.successCreate}>
                <Image style={styles.successCreateImage} source={require("../assets/img/success.png")}></Image>
                <Text style={styles.successText}>钱包创建成功</Text>
                <Text style={styles.noticeAgain}>请备份钱包私钥，方便找回资产</Text>
                <TouchableHighlight
                    style={styles.backUp}
                    onPress={this.noticeBackup.bind(this)}
                    underlayColor={"#ffffff"}
                >
                    <Text style={styles.backUpText}>{pressText}</Text>
                </TouchableHighlight>
                <Toast showToast={showToast} btnList={toastList} toastTitle={pressTextToast}
                       btnContent={btnContent}></Toast>
                <Toast showToast={showToken} btnList={tokenList} toastTitle={myToken}
                       contentMain={this.contentFn.bind(this, privkey)}></Toast>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    successCreate: {
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff"
    },
    successCreateImage: {
        width: 90,
        height: 90,
        marginTop: 114
    },
    successText: {
        marginTop: 15,
        fontSize: 16,
        color: "#ffcb00",
        fontFamily: "PingFangSC-Regular"
    },
    noticeAgain: {
        marginTop: 30,
        fontSize: 14,
        color: "#231815",
        fontFamily: "PingFangSC-Regular"
    },
    backUp: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        height: 45,
        width: 343,
        marginTop: 35,
        borderRadius: 40,
        backgroundColor: "#ffcc33"
    },
    backUpText: {
        color: "#231815",
        fontFamily: "PingFangSC-Regular",
        fontSize: 16
    }
});
