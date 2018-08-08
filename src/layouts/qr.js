import React, {Component} from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	InteractionManager,
	Animated,
	Easing,
	Platform,
	Image
} from 'react-native';
import Camera from 'react-native-camera';
var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

const IMG_RIGHTUP = require('../assets/img/rightUp.png');
const IMG_RIGHTDOWN = require('../assets/img/rightDown.png');
const IMG_LEFTUP = require('../assets/img/leftUp.png');
const IMG_LEFTDOWN = require('../assets/img/leftDown.png');
const IMG_LEFTROW = require('../assets/img/leftrow.png')


export default class Qr extends Component {
	constructor(props) {
		super(props);
		this.camera = null;
		this.state = {
			show: true,
			anim: new Animated.Value(0),
			top: new Animated.Value(0),
			// camera: {
			//     aspect: Camera.constants.Aspect.fill,
			// },
		};
		this.interval = null
	}

	startAnimation() {
		if (this.state.show) {
			this.state.anim.setValue(0)
			Animated.timing(this.state.anim, {
				toValue: 1,
				duration: 1500,
				easing: Easing.linear,
			}).start(() => this.startAnimation());
		}
	}

	//扫描二维码方法
	barcodeReceived = (e) => {
		let { goBack , state , navigation } = this.props.navigation ;
		if (this.state.show) {
			this.state.show = false;
			if (e) {
				let receiveAddressQr = e.data ;
				state.params.callback(receiveAddressQr);
				goBack();  
			} else {
				Alert.alert(
					'提示',
					'扫描失败'
					[{ text: '确定' }]
				)
			}
		}
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.startAnimation()
		});
		const that = this
		this.interval =
		setInterval(function () {
			Animated.timing(that.state.top, {
				toValue: 1,
				duration: 2200
			}).start(() => that.setState({ top: new Animated.Value(0) }))
		}, 2260)
	}

	componentWillUnmount() {
		this.state.show = false;
		clearInterval(this.interval)
	}

	render() {
		return (
			<View style={styles.container}>
				<Camera
					ref={(cam) => {
						this.camera = cam;
					}}
					style={styles.preview}
					onBarCodeRead={this.barcodeReceived.bind(this)}
					barCodeTypes={['qr']}
				>
					<View style={{ height: Platform.OS == 'ios' ? (height - 264) / 3 : (height - 244) / 3, width: width,  }}>
					</View>
					<View style={{  }}>
						<View style={styles.itemStyle} >
							<Image style={[styles.rectangle,{left : 0 ,top : 0}]} source={IMG_LEFTUP}>
							</Image>
							<Image style={[styles.rectangle,{right : 0 ,top : 0}]} source={IMG_RIGHTUP}>
							</Image>
							<Image style={[styles.rectangle,{left : 0 ,bottom : 0}]} source={IMG_LEFTDOWN}>
							</Image>
							<Image style={[styles.rectangle,{right : 0 ,bottom : 0}]} source={IMG_RIGHTDOWN}>
							</Image>
							<Animated.View style={{ width: 265,
								height: 1,
								backgroundColor: '#ffcb00',
								borderRadius : 50 ,
								transform: [{
									translateY: this.state.top.interpolate({
									inputRange: [0, 1],
									outputRange: [0, 265]
									})
								}]}} />
						</View>
					</View>
					<View style={{ flex: 1,  width: width, alignItems: 'center' ,paddingTop : 15 }}>
						<Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
					</View>
				</Camera>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	itemStyle: {
		// backgroundColor: 'yellow',
		width: 265,
		height: 265 ,
		marginLeft : (width - 265) / 2 ,
		position : 'relative'
	},
	textStyle: {
		color: '#ffcb00',
		marginTop: 10,
		fontWeight: 'bold',
		fontSize: 16
	},
	navTitleStyle: {
		color: 'white',
		fontWeight: 'bold',
	},
	navBarStyle: { // 导航条样式
		height: Platform.OS === 'ios' ? 64 : 44,
		backgroundColor: 'rgba(0,0,0,0.5)',
		// 设置主轴的方向
		flexDirection: 'row',
		// 垂直居中 ---> 设置侧轴的对齐方式
		alignItems: 'center',
		justifyContent: 'center'
	},

	leftViewStyle: {
		// 绝对定位
		// 设置主轴的方向
		flexDirection: 'row',
		position: 'absolute',
		left: 10,
		bottom: Platform.OS === 'ios' ? 15 : 12,
		alignItems: 'center',
		width: 30
	},
	animatiedStyle: {
		height: 2,
		// backgroundColor: '#00FF00'
	},
	container: {
		flex: 1,
	},
	preview: {
		flex: 1,
	},
	rectangle: {
		height: 15,
		width: 15,
		position : 'absolute'
	}
});