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
import {width, height, getStorage} from "../../utils/common_utils";
import {connect} from "react-redux";
import {getUserInfo} from "../../reducers/actions/wallet/wallet";

const topbg = require('../../assets/img/topbg.png');
const bgadd = require('../../assets/img/addh.png');
const logoEKT = require('../../assets/img/logoEKT.png');

class wallet extends Component {
    constructor() {
        super()
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

    async componentDidMount() {
        const {dispatch} = this.props;
        let address = await getStorage("address");
        console.log("address", address);
        let params = {};
        params["address"] = address;
        dispatch(getUserInfo(params));
    }

    pressTo = () => {
        const {navigate} = this.props.nav;
        navigate('CurrencyList', {
            headerTitle: '显示币种',
        })
    }

    pressToDetail = (item) => {
        const {navigate,state} = this.props.nav;
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
        const {dispatch} = this.props;
        let address = await getStorage("address");
        console.log("address", address);
        let params = {};
        params["address"] = address;
        dispatch(getUserInfo(params)).then( (res) => {
            if (res.status=== 0 && res.msg === 'ok') {
                if (res.result === null) {
                    this.setState({
                        dataList : [{
                            icon: logoEKT,
                            name: 'EKT',
                            number: 100,
                            price: 0
                        }]
                    })
                    
                    
                }
            }
        })
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
                    }}>{item.number!==0?item.number:'-'}</Text>
                    <Text style={{
                        textAlign: "right",
                        fontFamily: 'PingFangSC-Regular',
                        fontSize: 12,
                        color: '#7d7d7d'
                    }}> {item.price !==0 ? ' ≈ ¥ ' + item.price : ' - '}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )

    _keyExtractor = (item, index) => item.name;

    render() {
        console.log(this.props);
        
        const HeaderComponent = () => {
            return (<ImageBackground
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
                        }}>{this.state.allmoney !==0 ? this.state.allmoney : '-'}</Text>
                </View>
                <ImageBackground style={styles.add} source={bgadd}>
                    <Text style={{width: 30, height: 30,}} onPress={this.pressTo}></Text>
                </ImageBackground>
            </ImageBackground>)
        };
        return (
            <View style={{backgroundColor: '#ffffff', height: height}}>
                <View style={{backgroundColor: '#ffffff', width: width}}>
                    <FlatList
                        ListHeaderComponent={HeaderComponent}
                        showsVerticalScrollIndicator={false}
                        style={{height:height}}
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
