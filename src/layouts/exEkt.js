import React, { Component } from "react";
import {
	StyleSheet,
	Clipboard,
	View,
	Text,
	InteractionManager,
	Animated,
	Easing,
	Platform,
	TouchableHighlight
} from "react-native";
import QRCode from "react-native-qrcode";

let Dimensions = require("Dimensions");
let { width, height } = Dimensions.get("window");

export default class exEkt extends Component {
	constructor(props) {
		super(props);
		
	}

	state = {
	}
	
	// async _onCopy (){
	// 	try {
	// 		let content = await Clipboard.getString();
	// 		this.setState({ addressEKT });
	// 	} catch (e) {
	// 		this.setState({ addressEKT: e.message });
	// 	}
	// }

	_setContent() { 
		let { addressEKT } = this.props.navigation.state.params ;
		Clipboard.setString('0x'+addressEKT)
	}

	componentDidMount() {
		// let { addressEKT } = this.props.navigation.state.params ;
		// this.setState({
		// 	addressEKT : '0x'+addressEKT
		// })
	}
  

	render() {
		let { addressEKT } = this.props.navigation.state.params ;
		return (
			<View style={styles.container}>
				<QRCode
					value={'0x'+ addressEKT}
					size={250}
					bgColor='black'
					fgColor='white' />
				<View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: '#dddddd'}}>
					<Text style={{ textAlign: 'center', fontSize: 14, lineHeight: 28, color: '#444444',marginTop : 30 , marginLeft : 16 , marginRight : 16}}>
						{'0x'+addressEKT }
					</Text>
				</View>
				<TouchableHighlight
					style={styles.btn1}
					onPress={() => this._setContent()}
					underlayColor={'#ffcb00'}>
					<Text style={styles.btnText1}>
						复制地址
					</Text>
				</TouchableHighlight>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},
	btn1: {
		marginTop:20,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		height: 45,
		width: 325,
		borderRadius: 40,
		borderWidth: 1,
		borderColor: '#fed853',
		backgroundColor : '#fed853'
	},
	btnText1: {
		fontSize: 14,
		color: '#231815'
	},
});