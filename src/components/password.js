import React, { Component } from 'react' ;
import {
	StyleSheet ,
	View ,
	Text ,
	Image ,
	TouchableOpacity ,
	Dimensions ,
	Modal 
}from 'react-native' ;
import PasswordInput from './passwordInput';
const leftRow = require('../assets/img/leftrow.png');
const { height , width } = Dimensions.get('window');

export default class Password extends Component {
	constructor (props) {
		super (props)
		this.state = {
			animationType: 'slide',       //none slide fade
			modalVisible:false,        //模态场景是否可见
			transparent: true,         //是否透明显示
		};
	}

	static defaultProps = {
		wallettitle : '' ,
		LeftFunc : () => {} ,
		showPass : true ,
		onEnd : () => {} ,
		transNumberInput : '' ,
		inAddress : '' ,
		transToken : '' ,
		showMiddle : false
	} 

	_update =() => {
			
	}
    
	_closeModal = (visible) => {
		console.log("xxxsxsxsxsx",visible);
		this.setState({
			modalVisible: visible
		});
	}
	componentWillReceiveProps(nextProps,nextState){
		if(nextProps.showPass!==this.props.showPass){
			this.setState({
                modalVisible:nextProps.showPass
			});
		}
	}

	componentDidMount () {
			
	}

	componentWillUpdate  () {

	}

	componentDidUpdate () {

	}

	render () {
		const {
			wallettitle,
			onEnd,
			showMiddle ,
			transNumberInput ,
			inAddress ,
			transToken ,
		} = this.props;
		const {modalVisible}=this.state;
		let modalBackgroundStyle = {
			backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
		};
		console.log("xxx",this.state);
		return (
			<Modal
				animationType={this.state.animationType}
				transparent={this.state.transparent}
				visible={modalVisible}
				onRequestClose = {() => this._closeModal(false)}
			>
				<View style={[styles.containers, modalBackgroundStyle]}>
					<View style={[styles.password, modalBackgroundStyle]}>
						<View 
							style={{ 
										borderBottomWidth: 1, 
										borderBottomColor: '#ddd', 
										paddingLeft: 16, 
										paddingRight: 16,
										height: 50 ,
										backgroundColor : '#fff' 
						}}>
							<View 
								style={{ 
											height: 48, 
											flex: 1, 
											flexDirection: 'row', 
											alignItems: 'center' 
							}}>
								<TouchableOpacity style={{ width : 16 , height : 16 }} onPress={this.props.LeftFunc}>
									<Image source={leftRow} style={{ height : 16 , width : 8}}></Image>
								</TouchableOpacity>
								<Text 
									style={{
										textAlign:'center',
										width : '100%',
										fontSize : 18 ,
										color : '#030202'
								}} >{wallettitle}</Text>
							</View>
						</View>
							{   
								showMiddle 
								? <View style={{backgroundColor:'#fff'}}>
										<View style={{height:85,marginTop:20}}>
											<Text style={{textAlign:'center',fontFamily:'PingFangSC-Medium',fontSize:35,color:'#231815'}}>
											{transNumberInput}
											</Text>
										</View>
										<View style={{flexDirection:'column',paddingLeft:16,paddingRight:16}}>
											<View style={{flexDirection:'row',justifyContent:'space-between'}}>
												<Text style={styles.Header}>交易信息</Text>
												<Text style={styles.Footer}>转出{transToken}</Text>
											</View>
											<View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:10,paddingBottom:14}}>
												<Text style={styles.Header}>转入地址</Text>
												<Text style={styles.Footer}>{inAddress}</Text>
											</View>
										</View>
								</View>
								: null
							}
							<View style={{ width: '100%' , height : 110 ,backgroundColor : '#fff' ,paddingTop : 25 }}>
								<PasswordInput maxLength={6} onEnd={onEnd}></PasswordInput>
							</View>
					</View>
				</View>
			</Modal>
		)
	}
}
const styles = StyleSheet.create({
	containers : {
		flex:1,
		flexDirection : 'column' ,
		justifyContent:'flex-end'
	},
	password : {
		backgroundColor: '#fafafa',
		width: '100%',
		flex: 1 ,
		justifyContent: 'flex-end'
	},
	Header: {
		fontFamily : 'PingFangSC-Light' ,
		fontSize : 12 ,
		color : '#7d7d7d'
	},
	Footer : {
		fontFamily : 'PingFangSC-Regular' ,
		fontSize : 12 ,
		color : '#231815',
		width : width - 100 
	}
})