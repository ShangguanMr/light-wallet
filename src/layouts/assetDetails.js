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

let heights = [];
let txList = [];

class assetDetails extends Component {
    constructor(props) {
        super(props);
        this.getLeafhash = this.getLeafhash.bind(this);
        this.fromHashGetValue = this.fromHashGetValue.bind(this);
        this.halfHeightSearch = this.halfHeightSearch.bind(this);
        this.fromHeightSearch = this.fromHeightSearch.bind(this);
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

    //查询对应高度下的tx_id
    async fromHeightSearch(height, address) {
        let that = this;
        let height_res = await that.fromHeighGetValue(height);
        console.log("height--->", height, "======", height_res,);
        let txRoot = height_res['txRoot'];
        let tx_res = await this.fromHashGetValue(txRoot);
        console.log("tx_res===>", txRoot, tx_res);
        if (tx_res['sons'] !== null && tx_res['sons'].length > 0) {
            let list = [];
            let tx_item = "";
            let tx_details = "";
            let item_leaf_hash = await that.getLeafhash(tx_res['sons'][0]['hash'], address);
            if (!!item_leaf_hash) {
                tx_item = await that.fromHashGetValue(item_leaf_hash);
                console.log("item_leaf_hash====>", item_leaf_hash, tx_item);
                if (!!tx_item) {
                    list.push(tx_item);
                    console.log("xxxxx=====>list11", list)
                }
            }
            console.log("xxxxx=====>list", list)
            if (!!list && list.length > 0) {
                tx_details = await this.fromHashGetValue(list[0]['txId']);
                console.log("tx_details===>", tx_details)
                if (tx_details['from'] === address || tx_details['to'] === address) {
                    txList.push(tx_details);
                }
            }
        }
        return txList;
    }

    //通过height查询对应的值；
    async fromHeighGetValue(height, key) {
        const {dispatch} = this.props;
        let value = await dispatch(getBlocks({"height": height})).then((res) => {
            if (!!res['result']) {
                if (key) return res['result'][key];
                return res['result'];
            }
            return ""
        });
        console.log("xxxxxxValue", value);
        return value
    }

    //二分对比height的nonce以及amount值来查找到对应的记录；
    async halfHeightSearch(low, high, address) {
        console.log("高度===》", low, high, address);
        let that = this;
        //右边的余额结果；
        let midHeight = Math.floor((low + high) / 2);
        let high_statRoot = await that.fromHeighGetValue(high, "statRoot");
        let highleafhash = await that.getLeafhash(high_statRoot, address);
        let highresult = await that.fromHashGetValue(highleafhash);
        console.log("high_result==>", highresult);
        let mid_statRoot = await that.fromHeighGetValue(midHeight, "statRoot");
        let midleafhash = await that.getLeafhash(mid_statRoot, address);
        let midresult = await that.fromHashGetValue(midleafhash);
        console.log("mid_result==>", midresult);
        let low_statRoot = await that.fromHeighGetValue(low, "statRoot");
        let lowleafhash = await that.getLeafhash(low_statRoot, address);
        let lowresult = await that.fromHashGetValue(lowleafhash);
        console.log("low_result==>", lowresult);
        if ((lowresult['amount'] === midresult['amount'] && lowresult['nonce'] === midresult['nonce']) && (midresult['amount'] === highresult['amount'] && midresult['nonce'] === highresult['nonce'])) {
            console.log("没有交易==》", low, midHeight, high);
            heights.push(low);
            console.log("heights===>", heights);
            return heights;
        } else if ((lowresult['amount'] !== midresult['amount'] || lowresult['nonce'] !== midresult['nonce']) && (midresult['amount'] !== highresult['amount'] || midresult['nonce'] !== highresult['nonce'])) {
            //左右区间都有交易
            console.log("左右区间都有交易", low, midHeight, high);
            await that.halfHeightSearch(low, midHeight, address);
            await that.halfHeightSearch(midHeight + 1, high, address);
            // return [low, midHeight, midHeight + 1, high]
        } else if ((lowresult['amount'] === midresult['amount'] && lowresult['nonce'] === midresult['nonce']) && (midresult['amount'] !== highresult['amount'] || midresult['nonce'] !== highresult['nonce'])) {
            //左边区间没有，只考虑右边；
            console.log("左边区间没有，只考虑右边", midHeight, high);
            // return [midHeight + 1, high];
            await that.halfHeightSearch(midHeight + 1, high, address);
        } else if ((lowresult['amount'] !== midresult['amount'] || lowresult['nonce'] !== midresult['nonce']) && (midresult['amount'] === highresult['amount'] && midresult['nonce'] === highresult['nonce'])) {
            //右边区间没有，只考虑左边；
            console.log("右边区间没有，只考虑左边", low, midHeight);
            // return [low, midHeight]
            await that.halfHeightSearch(low, midHeight, address)
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
            console.log("通过叶子节点查到的最终结果", result);
            let res = await this.halfHeightSearch(1, height, address);
            console.log("最终结果res==>", res, heights);
            if (heights.length > 0) {
                let ress;
                heights.map(async (item, index) => {
                    ress=await that.fromHeightSearch(item, address);
                    if(index===(heights.length-1)){
                        console.log("交易信息===》22", ress, "txList===>222", txList);
                        that.setState({
                            data:ress,
                        })
                    }
                    // console.log("交易信息===》", "txList===>222", txList);
                });
                // console.log("交易信息===》1", "txList===>222", txList);
            }
        } else {
            console.log("新创建的钱包地址，还没有任何交易")
        }

    }

    componentWillUnmount() {
        heights = [];
        txList = [];
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
        var start = vl.length / 3 || 0;
        var hideVl = vl.substr(start, start);
        var showVl = vl.replace(hideVl, "***");
        return showVl;
    }

    _randomItem = ({item, index}) => {
        console.log("item====>1111", item);
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
                            numberOfLines={1}>
                            {/*{this.useStar(item.transitionAddressIn)}*/}
                            </Text>
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

function

mapStateToProps(state) {
    let {itemDetails, init, isRefreshing} = state.wallet;
    return {itemDetails, init, isRefreshing};
}

export default connect(mapStateToProps)

(
    assetDetails
)

const
    styles = StyleSheet.create({
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
