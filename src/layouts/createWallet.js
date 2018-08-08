/**
 * 创建钱包页面
 */

import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    InteractionManager,
    WebView,
} from "react-native";
import CircleCheckBox, {LABEL_POSITION} from "react-native-circle-checkbox";
import {width, height, setStorage, isIos} from "../utils/common_utils";
import {getWallet} from '../reducers/actions/wallet/wallet';
import {connect} from 'react-redux';
import {toastShort} from '../utils/ToastUtil'

const websource = isIos ? require('../../web/index.html') : {uri: 'file:///android_asset/dist/index.html'};


class createwallet extends Component {
    constructor() {
        super();
        this.state = {
            password: "",
            checkPassword: "",
            checked: false,
            isChecked: false,
            
            //点击按钮样式
            unableClick : {
                backgroundColor: '#ffffff',
                borderColor: "#b7b7b7",
                color: "#b7b7b7",
                disabled : true ,
            },
            enableClick : {
                backgroundColor: '#fed853',
                borderColor: "#fed853",
                color: "#231815",
                disabled: false,
            }
        };
    }

    componentDidMount () {
        console.log('=======width and height', width, height);
    }

    changeChecked = () => {
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    createToken() {
        //判断两次密码是否一致
        if (this.state.password === this.state.checkPassword && this.state.password.length === 6) {
            this.setState({
                create: true
            });
            //创建钱包成功之后存储交易密码
            setStorage('password', this.state.password);
            this.giveh5();
        } else {
            if (this.state.password !== this.state.checkPassword) {
                toastShort('前后密码不一致，请重新输入')
            } else {
                toastShort('密码长度不够6位，请重新输入！')
            }
        }
    }

    _onMessage = e => {
        let data = JSON.parse(e.nativeEvent.data);
        //处理之后的地址以及私钥存储到本地；
        setStorage("address", data.addressSha256);
        setStorage("privkey", data.privkey);
        console.log("输入密码创建的数据data==》", data);
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.navigate('CreateSuccess', {
                addressEKT: data.addressSha256,
                privkey: data.privkey
            })
        })
    };

    //给 h5 发消息
    giveh5() {
        let messageObject = {source: 'create'};
        let message = JSON.stringify(messageObject)
        this.refs.webview.postMessage(message);
    }

    _success = () => {
        console.log('========success')
    }
    _fail = () => {
        console.log('==========fail')
    }

    render() {
        let {isChecked, enableClick,unableClick} = this.state;
        let {backgroundColor,disabled,borderColor,color} = isChecked ? enableClick : unableClick ;
        return (
            <View style={{backgroundColor: "#ffffff"}}>
                <View
                    style={{
                        height: height,
                        paddingTop: 115,
                        marginLeft: 25,
                        marginRight: 25,
                        backgroundColor: "#ffffff",
                        position: "relative"
                    }}>
                    <Text style={styles.login}>
                        创建EKT钱包
                    </Text>
                    <View style={{marginTop: 42}}>
                        <TextInput
                            style={styles.password}
                            placeholder='请设置 6 位数字，作为钱包密码'
                            maxLength={6}
                            underlineColorAndroid="transparent"
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            secureTextEntry={true}
                            keyboardType={"numeric"}
                            placeholderTextColor="#b7b7b7"
                        />
                        <TextInput
                            style={styles.password}
                            placeholder='请重复钱包密码'
                            underlineColorAndroid="transparent"
                            maxLength={6}
                            onChangeText={(checkPassword) => this.setState({checkPassword})}
                            value={this.state.checkPassword}
                            secureTextEntry={true}
                            placeholderTextColor="#b7b7b7"
                            keyboardType={"numeric"}
                        />
                    </View>
                    <View style={styles.agree}>
                        <CircleCheckBox
                            checked={isChecked}
                            onToggle={(checked) => this.changeChecked()}
                            labelPosition={LABEL_POSITION.RIGHT}
                            label=""
                            outerSize={15}
                            innerSize={9}
                            filterSize={13}
                            outerColor="#444"
                            innerColor="#ffd400"
                            filterColor="white"
                            // styleCheckboxContainer={{marginTop : 3}}
                        />
                        <Text
                            style={{
                                color: "#444444",
                                fontSize: 14,
                                // height: 54,
                                width: 110,
                                paddingLeft: 5
                            }}>
                            我已阅读并同意
                        </Text>
                        <Text
                            style={{
                                color: "#ffcb00",
                                fontSize: 14,
                                // height: 54,
                                width: 100
                            }}>
                            使用条款
                        </Text>
                    </View>
                    <View style={{marginTop: 0}}>
                        <TouchableOpacity
                            style={{
                                height: 45,
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                borderRadius: 40,
                                borderWidth: 1,
                                backgroundColor: backgroundColor,
                                borderColor: borderColor
                            }}
                            disabled={disabled}
                            onPress={() => this.createToken()}>
                            <Text style={{
                                fontSize: 15,
                                color: color
                            }}>
                                创建钱包
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 44,
                            width: "100%"
                        }}>
                        <TouchableOpacity
                            style={styles.btn2}
                            onPress={() => this.props.navigation.navigate('InPk', {
                                headerTitle: '导入私钥',
                                inPath: 'createWallet'
                            })}>
                            <Text style={styles.btnText2}>
                                导入钱包
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <WebView
                    source={websource}
                    onLoad={this._success}
                    onError={this._fail}
                    ref="webview"
                    onMessage={this._onMessage.bind(this)}
                    javaScriptEnabled={true}
                />
            </View>
        );
    }

}

function mapStateToProps(state) {
    let {data} = state.wallet;
    return {data: data}
}

//或者直接写在页面里面也可以；
function mapDispatchToProps(dispatch) {
    return {
        getWallet: (params) => dispatch(getWallet(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(createwallet);

const styles = StyleSheet.create({
    login: {
        color: "#231815",
        // fontFamily:'Microsoft YaHei',
        fontSize: 18,
    },
    password: {
        height: 50,
        fontSize: 14,
        lineHeight: 18,
        borderBottomColor: "#b7b7b7",
        borderBottomWidth: 1,
        padding: 0,
    },
    agree: {
        flexDirection: "row",
        // fontFamily:'MicrosoftYaHei'
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50
    },
    btn2: {
        height: 45
    },
    btnText2: {
        fontSize: 15,
        color: "#444444",
        textAlign: "center"
    }
});
