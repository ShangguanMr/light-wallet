/**
 * 资产详情
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import {connect} from "react-redux";
import {
    blockTransactionList,
    getLastBlock,
    getWallet,
    getBlocks,
    getUserInfo,
    readyTransactionList
} from "../reducers/actions/wallet/wallet"
import {width, height, getStorage} from "../utils/common_utils";


class assetDetails extends Component {
    constructor(props) {
        super(props);
        this.getItemAnyValue=this.getItemAnyValue.bind(this);
        this.halfHeight=this.halfHeight.bind(this);
        this.state = {
            transToken: '',
            transTokenTotalNum: '',
            transTokenTotalPrice: '',

            //转入跳转的headertitle
            headerTitleIn: '',
            //转出跳转的headertitle
            headerTitleOut: '',

            dataNull: [],
            data: this._sourceData,
            show: true,
            addressEKT: ''
        }
    }

    _sourceData = [
        {
            transType: '转出',
            number: '3000',
            //交易单号
            transitionTicket: "Qsaam1nwLzAfXDtLv",
            time: '2018-4-26 23:09',
            transitionAddressIn: 'QUstVAm1nwLzAfXDtLvCgaCWUA1Yrqavjv',
            transitionAddressOut: "QUstVAm1nwLzAfXDtLvCgaCWUB3Ykk90ka",
            result: true
        }
    ]

    componentWillMount() {

    }

    getItemAnyValue(result = [], value1, value2, address) {
        let path_hash = ""
        result.map((item, index) => {
            console.log("item---->", item, item[value1], address, item[value1] === address, typeof item[value1], typeof address);
            if (item[value1] === address) {
                path_hash = item[value2]
            }
        });
        return path_hash;
    }

    async halfHeight(minHeight=0, maxHeight=0, currentNonce=0,currentamount=0,address="") {
        console.log("二分的address",address,currentNonce,currentamount);
        if (maxHeight < minHeight) {
            return false
        }
        const {dispatch} = this.props;
        let that = this;
        let midheight = Math.floor((minHeight + maxHeight) / 2);
        let {statRoot,txRoot} = await dispatch(getBlocks({"height": midheight})).then((res) => {
            return res['result']
        });
        let pathhash = await dispatch(getWallet({"hash": statRoot})).then((res) => {
            console.log("每次通过statRoot查找到的返回值", res,address);
            //遍历sons中的pathValue 等于address 拿到对应的hash调用接口
            return that.getItemAnyValue(res['sons'], "pathValue", "hash", address);
        });
          let leafhash = await dispatch(getWallet({ "hash": pathhash})).then((res) => {
              console.log("xxxx22", res);
              if (res.leaf === true) {
                  return res['sons'][0]['hash'];
              }else{
                  return "";
              }
          });
          let { amount=0, nonce=0} = await dispatch(getWallet({"hash": leafhash})).then((res) => {
              return res
          });
          console.log("判断条件是否成立",currentNonce===nonce,currentamount===amount,amount,nonce);
        if (currentNonce === nonce && currentamount === amount) {
            return {"height": midheight, "txRoot": txRoot};
        } else if (currentNonce < nonce) {
            maxHeight = midheight - 1;
            return that.halfHeight(minHeight, maxHeight, currentNonce,currentamount,address)
        } else if (currentNonce > nonce) {
            minHeight = midheight + 1;
            return that.halfHeight(minHeight, maxHeight, currentNonce,currentamount,address)
        }
    }

    async componentDidMount() {
        let that = this;
        let params = {};
        const {dispatch} = this.props;
        let hash = await getStorage('privkey');
        let address = await getStorage("address");
        // let address = "968b10ebc111ea3434de7333d82e54890c4a2d8c34577e0e54f3464eb88e3b2f";
        console.log("hash====>>>>", hash);
        params['address'] = address;
        //通过last获取对用的height，statRoot
        let {height,statRoot} = await dispatch(getLastBlock()).then((res) => {
            return res['result']
        });
        console.log("xxx1", statRoot);
        let pathhash = await dispatch(getWallet({"hash": statRoot})).then((res) => {
            console.log("xxxx11", res);
            //遍历sons中的pathValue 等于address 拿到对应的hash调用接口
            return that.getItemAnyValue(res['sons'], "pathValue", "hash", address);
        });
        console.log("xxx2", pathhash);
        let leafhash = await dispatch(getWallet({"hash": pathhash})).then((res) => {
            console.log("xxxx22", res);
            if (res.leaf === true) {
                return res['sons'][0]['hash'];
            }else{
                return "";
            }
        });
        console.log("xxx3", leafhash);
        let {amount, nonce} = await dispatch(getWallet({"hash": leafhash})).then((res) => {
            return res
        });
        console.log("xxx4", nonce,amount,address);
        let {finallHeight, txRoot} = await that.halfHeight(0, height,nonce,amount,address);
        // console.log("xxxx4", await that.halfHeight(0, height, nonce,amount,address));
        let transationDetails = await dispatch(getWallet({"hash": txRoot})).then((res) => {
            console.log("xxx5", res)
            if (!!res['sons']) {
                res['sons'].map((value, index) => {
                    console.log("xxxxxxxxxxx", value, index);
                    dispatch(getWallet({"hash": value['hash']})).then((res) => {
                        if (res.leaf = true) {
                            dispatch(getWallet({"hash": res["sons"][0]['hash']})).then((res) => {
                                return res
                            })
                        }
                    })
                })
            } else {
                return [];
            }
        });
        console.log("xxxxxxxxx", txRoot, transationDetails);

        // this.props.dispatch(blockTransactionList(params));
        let {token, tokenTotalNum, tokenTotalPrice, addressEKT} = this.props.navigation.state.params;
        this.setState({
            transToken: token,
            transTokenTotalNum: tokenTotalNum,
            transTokenTotalPrice: tokenTotalPrice,
            headerTitleOut: '转出' + token,
            headerTitleIn: '转入' + token,
            addressEKT: addressEKT
        })
    }

    exDetail(item) {
        const {navigate} = this.props.navigation;
        navigate('ExDetails', {
            headerTitle: '交易详情',
            transType: item.transType,
            number: item.number,
            //交易单号
            transitionTicket: item.transitionTicket,
            time: item.time,
            transitionAddressIn: item.transitionAddressIn,
            transitionAddressOut: item.transitionAddressOut,
            result: item.result
        })
    }

    useStar(vl) {
        var start = vl.length / 3;
        var hideVl = vl.substr(start, start);
        var showVl = vl.replace(hideVl, "***");
        return showVl;
    }

    _randomItem = ({item, index}) => {
        let failIcon = item.result
            ? <View/>
            :
            <View
                style={{
                    borderWidth: 1,
                    borderColor: '#dddddd',
                    backgroundColor: '#dddddd',
                    borderRadius: 3,
                    marginLeft: 2
                }}>
                <Text
                    style={{
                        width: 30,
                        height: 16,
                        lineHeight: 16,
                        fontFamily: 'PingFangSC-Medium',
                        fontSize: 12,
                        color: '#7d7d7d',
                        textAlign: 'center',
                    }}
                >失败</Text>
            </View>

        return (
            <TouchableHighlight
                style={styles.MDListItem}
                onPress={() => this.exDetail(item)}
                underlayColor='#ffffff'>
                <View style={{width: '100%'}}>
                    <View style={styles.MDListItemF}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text
                                style={{
                                    fontFamily: 'PingFangSC-Medium',
                                    fontSize: 16,
                                    color: '#231815',
                                    textAlign: 'left'
                                }}
                            >{item.transType}{this.state.transToken}</Text>
                            {failIcon}
                        </View>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Medium',
                                fontSize: 16,
                                color: '#231815',
                                textAlign: 'right'
                            }}
                        >{item.transType === '转入' ? '+' : '-'} {item.number}</Text>
                    </View>
                    <View style={styles.MDListItemS}>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 14,
                                color: '#444444',
                                textAlign: 'left',
                            }}
                            numberOfLines={1}
                        >{this.useStar(item.transitionAddressIn)}</Text>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 14,
                                color: '#444444',
                                textAlign: 'right'
                            }}
                        >{item.time}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };
    _onRefresh(){
        console.log("刷新----》",);
    }
    _keyExtractor = (item, index) => index + '';

    EmptyList() {
        return (
            <View style={{backgroundColor: '#f8f8f8', height: height - 250}}>
                <Text
                    style={{
                        marginTop: 75,
                        textAlign: 'center',
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: 14,
                        color: '#444444',
                    }}
                >暂时还没有交易记录哦～</Text>
            </View>
        )
    }

    render() {
        let {addressEKT, privkey} = this.props.navigation.state.params;
        // 头部组件；
        const HeaderComponent = () => {
            return (
                <View style={styles.MD}>
                <View style={styles.MDTotal}>
                            <Text style={styles.MDTotalCount}>{this.state.transTokenTotalNum}</Text>
                            <Text style={styles.MDTotalPrice}> ≈
                                ¥ {this.state.transTokenTotalPrice ? this.state.transTokenTotalPrice : '-'}</Text>
                        </View>
                        <View style={styles.MDTrans}>
                        <Text style={styles.MDTransText}>交易记录</Text>
                </View>
                </View>     
            )
        }
        return (
            <View style={{backgroundColor: '#fff',flex:1, position: 'relative'}}>
                        <View style={styles.MDList}>
                            <FlatList
                                data={this.state.data}
                                style={{height:height}}
                                ref={(flatList) => this._flatList = flatList}
                                renderItem={this._randomItem}
                                keyExtractor={this._keyExtractor}
                                ListEmptyComponent={this.EmptyList}
                                ListHeaderComponent={HeaderComponent}
                                showsVerticalScrollIndicator={false}
                                 // onEndReachedThreshold={0} //滚动距底部0像素触发
                                onRefresh={this._onRefresh.bind(this)} //刷新
                                // onEndReached={this._onEndReach.bind(this)} //分页处理函数
                                refreshing={this.props.isRefreshing} //刷新加载中提示
                                // ListFooterComponent={this._renderFooter.bind(this)}//分页底部提示框
                                // getItemLayout={(data, index) => ({ length: 75, offset: (74 + 1) * index, index })}
                            />
                        </View>
                        <View style={{height: 48, width: '100%'}}></View>
                    {/* </View> */}
                {/* // </ScrollView> */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopWidth: 1,
                        borderTopColor: '#dddddd',
                        width: '100%',
                        height: 48,
                    }}>
                    <TouchableHighlight
                        style={{
                            width: '50%',
                            backgroundColor: '#ffffff',
                            // height : 48
                        }}
                        onPress={() => this.props.navigation.navigate('ItemDeExEkttail', {
                            headerTitle: this.state.headerTitleIn,
                            addressEKT: this.state.addressEKT
                        })}
                        underlayColor='#ffffff'
                    >
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: '#ffcb00',
                                textAlign: 'center',
                                lineHeight: 48
                            }}>转入</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{
                            backgroundColor: '#ffcb00',
                            width: '50%',
                            // height : 48 ,
                        }}
                        underlayColor='#ffcb00'
                        onPress={() => this.props.navigation.navigate('OutCoin1', {
                            headerTitle: this.state.headerTitleOut,
                            transToken: this.state.transToken,
                            transTokenTotalNum: this.state.transTokenTotalNum,
                            addressEKT: addressEKT,
                            privkey: privkey,
                            callback:()=>{this._onRefresh()}
                        })}>
                        <Text
                            style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 16,
                                color: '#ffffff',
                                textAlign: 'center',
                                lineHeight: 48
                            }}>转出</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    let {itemDetails, init,isRefreshing} = state.wallet;
    return {itemDetails, init,isRefreshing};
}

export default connect(mapStateToProps)(assetDetails)

const styles = StyleSheet.create({
    MD: {
        paddingTop: 30,
    },
    MDTotal: {
        backgroundColor: '#ffffff'
    },
    MDTotalCount: {
        textAlign: 'center',
        fontFamily: 'PingFangSC-Medium',
        fontSize: 40,
        color: '#231815'
    },
    MDTotalPrice: {
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#444444'
    },
    MDTrans: {
        marginTop: 36,
        backgroundColor: '#f8f8f8',
    },
    MDTransText: {
        marginLeft: 16,
        height: 35,
        lineHeight: 35,
        textAlign: 'left',
        fontFamily: 'PingFangSC-Regular',
        fontSize: 16,
        color: '#231815'
    },
    MDList: {
        backgroundColor: '#ffffff'
    },
    MDListItem: {
        flexDirection: 'column',
        height: 74,
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        marginLeft: 16,
        marginRight: 16,
    },
    MDListItemF: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
        justifyContent: 'space-between',
    },
    MDListItemS: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
