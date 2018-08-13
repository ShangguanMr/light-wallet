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
        // this.halfHeight = this.halfHeight.bind(this);
        // this.getLeafhash = this.getLeafhash.bind(this);
        // this.fromHashGetValue = this.fromHashGetValue.bind(this);
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

    //通过hash获得value；
    async fromHashGetValue(hash) {
        let value = "";
        if (!!hash) {
            const {dispatch} = this.props;
            value = await dispatch(getWallet({"hash": hash})).then((res)=>{
                return res;
            });
            console.log("xxxxxxValue",value)
            return value
        } else {
            return value

        }
    }

    //判断叶子节点
    async getLeafhash(hash, address) {
        let str_address = "";
        let result = await this.fromHashGetValue(hash)

        console.log("xxxxxxresult",result);
        if (result['leaf']){
            let a = result.sons[0].hash;
            console.log(a);
            return  a
        } else {
            //非叶子节点
            for (let i = 0; i < result['sons'].length; i++) {
                if (address.indexOf(result['sons'][i].pathValue) === 0) {
                    str_address = address.substr(result['sons'][i].pathValue.length);
                    this.getLeafhash(result['sons'][i]['hash'], str_address);
                }
            }
        }
        // if (result['sons'] && result['sons'].length > 0) {
        //     if (result['leaf'] === true) {

        //        return result['sons'][0]['hash'];
        //     } else {
        //        // result['sons'].map((item, index) => {
        //        //      console.log("address", address);
        //        //      if (address.indexOf(item['pathValue']) > -1) {
        //        //          str_address = address.substr(item['pathValue'].length);
        //        //          console.log("地址片段", str_address);
        //        //          this.getLeafhash(item['hash'], str_address);
        //        //      }
        //        //  });
        //         for (let i = 0 ; i < result['sons'].length; i++) {
        //             if (address.indexOf(result['sons'][i]['pathValue']) > -1) {
        //                  str_address = address.substr(result['sons'][i]['pathValue'].length);
        //                  console.log("地址片段", str_address);
        //                  await this.getLeafhash(result['sons'][i]['hash'], str_address);
        //              }
        //         }
        //     }
        // } else {
        //     return {}
        // }
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
        let leafhash = await this.getLeafhash(statRoot, address).then((res)=>{
            console.log("xxxxxx",res);
            return res;
        });
        // let leafhash=await this.fromHashGetValue(statRoot).then((res)=>{
        //     return res
        // })
        console.log("leafhash===>",leafhash,)
        // if (!!leafhash) {
        //     let result = await this.fromHashGetValue(leafhash);
        //     console.log("通过叶子节点查到的最终结果", result);
        // } else {
        //     console.log("新创建的钱包地址，还没有任何交易")
        // }

    }

    componentWillUnmount() {
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
        let {token} = this.props.navigation.state.params;
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
                            >{item.transType}{token}</Text>
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

    _onRefresh() {
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
        let {addressEKT, privkey, token, tokenTotalNum, tokenTotalPrice,} = this.props.navigation.state.params;
        // 头部组件；
        const HeaderComponent = () => {
            return (
                <View style={styles.MD}>
                    <View style={styles.MDTotal}>
                        <Text style={styles.MDTotalCount}>{tokenTotalNum}</Text>
                        <Text style={styles.MDTotalPrice}> ≈
                            ¥ {tokenTotalPrice ? tokenTotalPrice : '-'}</Text>
                    </View>
                    <View style={styles.MDTrans}>
                        <Text style={styles.MDTransText}>交易记录</Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={{backgroundColor: '#fff', flex: 1, position: 'relative'}}>
                <View style={styles.MDList}>
                    <FlatList
                        data={this.state.data}
                        style={{height: height}}
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
                            headerTitle: '转入' + token,
                            addressEKT: addressEKT
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
                            headerTitle: '转出' + token,
                            transToken: token,
                            transTokenTotalNum: tokenTotalNum,
                            addressEKT: addressEKT,
                            privkey: privkey,
                            callback: () => {
                                this._onRefresh()
                            }
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
    let {itemDetails, init, isRefreshing} = state.wallet;
    return {itemDetails, init, isRefreshing};
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
