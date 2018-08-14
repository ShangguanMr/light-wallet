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
        this.fromHashGetValue = this.fromHashGetValue.bind(this);
        this.getLeafhash = this.getLeafhash.bind(this);
        this.state = {
            addressEKT: '',
            allmoney: 0,
            dataList: [
                {
                    icon: logoEKT,
                    name: 'EKT',
                    number: 100000000,
                    price: 0
                }
            ],
            dataListEmpty: [],
        }
    }

    //通过hash获得value；
    async fromHashGetValue(hash) {
        let value = "";
        if (!!hash) {
            const {dispatch} = this.props;
            value = await dispatch(getWallet({"hash": hash}));
            console.log("xxxxxxValue", value)
            return value
        } else {
            return value

        }
    }

    //判断叶子节点
    async getLeafhash(hash, address) {
        let that = this;
        let str_address = "";
        let path_hash = "";
        let result = await this.fromHashGetValue(hash);
        if (result['sons'] && result['sons'].length > 0) {
            if (result['leaf'] === true) {
                return result['sons'][0]['hash'];
            } else {
                result['sons'].map((item, index) => {
                    console.log("address", address);
                    if (address.indexOf(item['pathValue']) > -1) {
                        str_address = address.substr(item['pathValue'].length);
                        path_hash = item['hash'];
                        console.log("地址片段", str_address, path_hash);
                    }
                });
                return that.getLeafhash(path_hash, str_address)
            }
        } else {
            return ""
        }

    }


    async componentDidMount() {
        let that = this;
        let params = {};
        const {dispatch} = this.props;
        let address = await getStorage("address");
        params['address'] = address;
        //通过last获取对用的height，statRoot
        let {height, statRoot} = await dispatch(getLastBlock()).then((res) => {
            return res['result']
        });
        console.log("获取到初始的最终的height，statRoot", height, statRoot);
        let leafhash = await this.getLeafhash(statRoot, address);
        console.log("leafhash===>", leafhash,);
        if (!!leafhash) {
            let result = await this.fromHashGetValue(leafhash);
            setStorage('nonce',result['nonce']);
            that.setState({
                allmoney:result['amount']
            });
            console.log("通过叶子节点查到的最终结果", result);
        } else {
            setStorage('nonce',0);
            console.log("新创建的钱包地址，还没有任何交易")
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
            tokenTotalNum: this.state.allmoney,
            tokenTotalPrice: item.price,
            addressEKT: state.params.addressEKT,
            privkey: state.params.privkey
        })
    }

    async _onRefresh() {
        let that = this;
        let params = {};
        const {dispatch} = this.props;
        let address = await getStorage("address");
        params['address'] = address;
        //通过last获取对用的height，statRoot
        let {height, statRoot} = await dispatch(getLastBlock()).then((res) => {
            return res['result']
        });
        console.log("获取到初始的最终的height，statRoot", height, statRoot);
        let leafhash = await this.getLeafhash(statRoot, address);
        console.log("leafhash===>", leafhash,);
        if (!!leafhash) {
            let result = await this.fromHashGetValue(leafhash);
            setStorage('nonce',result['nonce']);
            that.setState({
                allmoney:result['amount']
            });
            console.log("通过叶子节点查到的最终结果", result);
        } else {
            setStorage('nonce',0);
            console.log("新创建的钱包地址，还没有任何交易")
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
