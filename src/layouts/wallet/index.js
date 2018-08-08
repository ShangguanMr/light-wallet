/**
 * 项目初始化内容
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    FlatList,
    TouchableHighlight,
} from 'react-native';
import {width, height, getStorage, setStorage} from "../../utils/common_utils";
import {connect} from "react-redux";
import {
    getUserInfo,
    getLastBlock,
    getWallet,
} from "../../reducers/actions/wallet/wallet";

const topbg = require('../../assets/img/topbg.png');
const bgadd = require('../../assets/img/addh.png');
const logoEKT = require('../../assets/img/logoEKT.png');

class wallet extends Component {
    constructor(props) {
        super(props);
        this.getItemAnyValue = this.getItemAnyValue.bind(this);
        this.state = {
            addressEKT: '',
            allmoney: 0,
            dataList: [
                {
                    icon: logoEKT,
                    name: 'EKT',
                    number: 10,
                    price: 0
                }
            ],
            dataListEmpty: [],
        }
    }

    getItemAnyValue(result = [], value1, value2, address) {
        let path_hash = ""
        result.map((item, index) => {
            // console.log("item---->", item, item[value1], address, item[value1] === address, typeof item[value1], typeof address);
            if (item[value1] === address) {
                path_hash = item[value2]
            }
        });
        return path_hash;
    }

    async componentDidMount() {
        let that = this;
        const {dispatch} = this.props;
        let address = await getStorage("address");
        let params = {};
        params['address'] = address;
        //通过last获取对用的height，statRoot
        let {statRoot} = await dispatch(getLastBlock()).then((res) => {
            return res['result']
        });
        console.log("xxx1", statRoot);
        let pathhash = await dispatch(getWallet({"hash": statRoot})).then((res) => {
            console.log("xxxx11", res);
            //遍历sons中的pathValue 等于address 拿到对应的hash调用接口
            return that.getItemAnyValue(res['sons'], "pathValue", "hash", address);
        });
        console.log("xxx2", pathhash);
        if (!!pathhash) {
            let leafhash = await dispatch(getWallet({"hash": pathhash})).then((res) => {
                console.log("xxxx22", res);
                if (res.leaf === true) {
                    return res['sons'][0]['hash'];
                } else {
                    return "";
                }
            });
            console.log("xxx3", leafhash);
            let {amount, nonce} = await dispatch(getWallet({"hash": leafhash})).then((res) => {
                return res
            });
            this.setState({
                allmoney: amount
            });
            setStorage("nonce", nonce);
            console.log("xxx4", nonce, amount, address);
        } else {
            setStorage("nonce", 0);
        }

    }

    pressTo = () => {
        const {navigate} = this.props.nav;
        navigate('CurrencyList', {
            headerTitle: '显示币种',
        })
    }

    pressToDetail = (item) => {
        const {navigate, state} = this.props.nav;
        navigate('AssetDetails', {
            headerTitle: item.name,
            token: item.name,
            tokenTotalNum: item.number,
            tokenTotalPrice: item.price,
            addressEKT: state.params.addressEKT,
            privkey: state.params.privkey
        })
    }

    async _onRefresh() {
        let that = this;
        const {dispatch} = this.props;
        let address = await getStorage("address");
        let params = {};
        params['address'] = address;
        //通过last获取对用的height，statRoot
        let {statRoot} = await dispatch(getLastBlock()).then((res) => {
            return res['result']
        });
        let pathhash = await dispatch(getWallet({"hash": statRoot})).then((res) => {
            console.log("xxxx11", res);
            //遍历sons中的pathValue 等于address 拿到对应的hash调用接口
            return that.getItemAnyValue(res['sons'], "pathValue", "hash", address);
        });
        if(!!pathhash){
            let leafhash = await dispatch(getWallet({"hash": pathhash})).then((res) => {
                if (res.leaf === true) {
                    return res['sons'][0]['hash'];
                } else {
                    return "";
                }
            });
            let {amount, nonce} = await dispatch(getWallet({"hash": leafhash})).then((res) => {
                return res
            });
            this.setState({
                allmoney: amount
            });
            setStorage("nonce", nonce);
        }else{
            setStorage("nonce", 0);
        }

    }

    _renderItem = ({item}) => (
        <TouchableHighlight
            style={{
                width: width,
                paddingLeft: 16,
                paddingRight: 17
            }}
            onPress={() => this.pressToDetail(item)}
            underlayColor='#ffffff'>
            <View style={{
                flexDirection: 'row',
                height: 75,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomColor: "#ddd",
                borderBottomWidth: 1
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{
                        height: 40,
                        width: 40,
                        backgroundColor: '#ffffff',
                        borderWidth: 1,
                        borderColor: '#dddddd',
                        borderRadius: 20
                    }} source={item.icon}></Image>
                    <Text
                        style={{
                            marginLeft: 10,
                            fontSize: 16,
                            color: '#231815',
                            fontFamily: 'PingFangSC-Medium',
                        }}>{item.name}</Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{
                        fontFamily: 'PingFangSC-Semibold',
                        fontSize: 24,
                        color: '#444444'
                    }}>{item.number !== 0 ? item.number : '-'}</Text>
                    <Text style={{
                        textAlign: "right",
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: 12,
                        color: '#7d7d7d'
                    }}> {item.price !== 0 ? ' ≈ ¥ ' + item.price : ' - '}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )

    _keyExtractor = (item, index) => item.name;

    render() {
        console.log(this.props);

        const HeaderComponent = () => {
            return (<TouchableHighlight onPress={this.pressTo}>
                <ImageBackground
                    source={topbg}
                    style={styles.topcontent}>
                    <View
                        style={styles.topword}>
                        <Text
                            style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 14,
                                fontFamily: 'PingFangSc-Light'
                            }}>我的总资产( ￥ )</Text>
                        <Text
                            style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 40,
                                marginTop: 16,
                                fontFamily: 'PingFangSC-Medium'
                            }}>{this.state.allmoney !== 0 ? this.state.allmoney : '-'}</Text>
                    </View>
                    <ImageBackground style={styles.add} source={bgadd}>
                        <Text style={{width: 30, height: 30,}}></Text>
                    </ImageBackground>
                </ImageBackground></TouchableHighlight>)
        };
        return (
            <View style={{backgroundColor: '#ffffff', height: height}}>
                <View style={{backgroundColor: '#ffffff', width: width}}>
                    <FlatList
                        ListHeaderComponent={HeaderComponent}
                        showsVerticalScrollIndicator={false}
                        style={{height: height}}
                        data={this.state.dataList}
                        renderItem={this._renderItem}
                        ref={(flatList) => this._flatList = flatList}
                        keyExtractor={this._keyExtractor}
                        initialListSize={15}
                        // onEndReachedThreshold={0} //滚动距底部0像素触发
                        onRefresh={this._onRefresh.bind(this)} //刷新
                        // onEndReached={this._onEndReach.bind(this)} //分页处理函数
                        refreshing={this.props.isRefreshing} //刷新加载中提示
                        // ListFooterComponent={this._renderFooter.bind(this)}//分页底部提示框
                    />
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    let {useData, init, isRefreshing} = state.wallet;
    console.log("==========>", isRefreshing);
    return {useData, init, isRefreshing};
}

export default connect(mapStateToProps)(wallet)

const styles = StyleSheet.create({
    topcontent: {
        backgroundColor: '#000',
        height: 200,
        position: 'relative'
    },

    icon: {
        width: 30,
        height: 30
    },
    topword: {
        position: 'absolute',
        top: 65,
        width: '100%'
    },
    add: {
        position: 'absolute',
        width: 30,
        height: 30,
        bottom: 20,
        right: 25
    }
});
