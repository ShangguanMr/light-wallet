/**
 * 注册钱包页
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions
} from "react-native";

const { width } = Dimensions.get("window");

const IMG_TRANSITIONSUCCESS = require("../assets/img/success.png");
const IMG_TRANSITIONFAIL = require('../assets/img/fail.png')

export default class exDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			transType : '',
			number: '',
			transitionTicket: '',
			time: '',
			transitionAddressIn: '',
			transitionAddressOut: '',
			result : true
		};
	}

	componentWillMount () {
		let { transType , number , transitionTicket , time , transitionAddressIn , transitionAddressOut , result } = this.props.navigation.state.params ;
		this.setState({
			transType : transType,
			number: number,
			//交易单号
			transitionTicket: transitionTicket,
			time: time,
			transitionAddressIn: transitionAddressIn,
			transitionAddressOut: transitionAddressOut,
			result: result
		})
	}

	render() {
		return (
			<View style={{height : '100%', backgroundColor : '#ffffff'}}>
				<View style={styles.TD}>
					<View style={styles.TDH}>
						<Image source={ this.state.result ?IMG_TRANSITIONSUCCESS:IMG_TRANSITIONFAIL} style={{ width: 90, height: 90 }}></Image>
						<Text style={styles.TDHText}>{this.state.transType === '转入' ? '+' : '-'} {this.state.number}</Text>
					</View>
					<View style={styles.TDF}>
						<View style={styles.TDFStyle}>
							<View style={{ paddingBottom: 20 }}>
								<View style={styles.TDFStyleText}>
									<Text style={styles.TDFStyleTextTitle}>交易类型</Text>
									<Text style={styles.TDFStyleTextData}>{this.state.transType }</Text>
								</View>
								<View style={styles.TDFStyleText}>
									<Text style={styles.TDFStyleTextTitle}>交易单号</Text>
									<Text style={styles.TDFStyleTextData}>{this.state.transitionTicket}</Text>
								</View>
								<View style={styles.TDFStyleText}>
									<Text style={styles.TDFStyleTextTitle}>交易时间</Text>
									<Text style={styles.TDFStyleTextData}>{this.state.time}</Text>
								</View>
							</View>
						</View>
						<View style={styles.TDFAddress}>
							<View style={{ paddingBottom: 20 }}>
								<View style={styles.TDFStyleText}>
									<Text style={styles.TDFStyleTextTitle}>转入地址</Text>
									<Text style={styles.TDFStyleTextData}>{this.state.transitionAddressIn}</Text>
								</View>
								<View style={styles.TDFStyleText}>
									<Text style={styles.TDFStyleTextTitle}>转出地址</Text>
									<Text style={styles.TDFStyleTextData}>{this.state.transitionAddressOut}</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	TD: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center"
	},
	TDH: {
		marginTop: 50
	},
	TDHText: {
		marginTop: 15,
		fontFamily: "PingFangSC-Medium",
		fontSize: 24 ,
		letterSpacing : 1 ,
		textAlign : 'center'
	},
	TDF: {
		marginTop: 40,
		borderTopWidth: 1,
		borderTopColor: "#dddddd",
		borderBottomWidth: 1,
		borderBottomColor: "#dddddd",
		width: width
	},
	TDFStyle: {
		marginLeft: 16,
		marginRight: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#dddddd",
		flexDirection: "column",
	},
	TDFStyleText: {
		marginTop: 20,
		flexDirection: "row"
	},
	TDFStyleTextTitle: {
		fontFamily: "PingFangSC-Light",
		fontSize: 12,
		color: "#7d7d7d",
		textAlign: "left"
	},
	TDFStyleTextData: {
		marginLeft: 15,
		fontFamily: "PingFangSC-Regular",
		fontSize: 12,
		color: "#231815"
	},
	TDFAddress: {
		marginLeft: 16,
		marginRight: 16,
	}
});