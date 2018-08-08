import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableHighlight,
	Dimensions,
	Modal ,
	Alert
} from 'react-native';
const { height } = Dimensions.get('window');

export default class toast extends Component {
	constructor(props) {
		super(props)
		this.state = {
			animationType: 'slide',       //none slide fade
			modalVisible: false,        //模态场景是否可见
			transparent: true,         //是否透明显示
			color : '#ffcb00'
		};
	}

	static defaultProps = {
		showToast: false ,
		toastTitle : '备份提示',
		btnList : [] ,
		// 当不是普通的toast信息的时候显示一个view展示新的父组件传过来的信息
		contentMain : () => {} ,
	}

	_update = () => {

	}

	_closeModal = () => {
		alert('关闭')
	}

	render() {
		const { toastTitle, showToast, btnList, btnContent, contentMain } = this.props;
		let modalBackgroundStyle = {
			backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
		};
		let { color } = this.state ;
		return (
			<Modal
				animationType={this.state.animationType}
				transparent={this.state.transparent}
				visible={showToast}
				onRequestClose={() => this.closeModal()}
			>
				<View style={[styles.containers, modalBackgroundStyle]}>
					<View style={[styles.toast, modalBackgroundStyle]}>
						<View style={styles.toastContainer}>
							<Text style={styles.titleMain}>
								{toastTitle}
							</Text>
							{
								btnContent !== '' && !!btnContent 
								?
								<Text style={styles.titleContent}>
									{ btnContent }
								</Text> 
								: contentMain()
							}
							<View style={styles.btnBottom}>
								<View style={styles.btnList}>
									{
										btnList.map((ele, index) => {
											return (
												<TouchableHighlight
													onPress={ele.pressFn}
													key={index}
													activeOpacity={0.4}
													underlayColor={"#ffffff"}
													style={{
														width : '50%' ,
														height : 53 ,
														borderLeftWidth : index === 1 ? 1 : 0 ,
														borderLeftColor : '#dddddd' 
													}}>
													<Text 
														style={{
															textAlign: 'center' ,
															color : color ,
															lineHeight : 53
														}}
													>{ele.btnTitle}</Text>
												</TouchableHighlight>
											)
										})                                       
									}
								</View>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
}
const styles = StyleSheet.create({
    containers: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center' ,
        justifyContent:'center'
    },
    toast: {
        backgroundColor: '#ffffff',
        width: '100%',
        flex: 1 ,
        alignItems:'center' ,
        justifyContent: 'center'
    },
    toastContainer : {
        width : '80%',
        backgroundColor : '#ffffff',
        borderRadius : 8
    },
    titleMain : {
        fontSize : 15 ,
        marginTop: 18 ,
        marginBottom: 10 ,
        textAlign : 'center'
    },
    titleContent : {
        marginLeft : 15 ,
        marginRight : 15 ,
        lineHeight : 19 ,
        color: '#444444',
        textAlign : 'center'
    },
    btnBottom : {
        height : 53 ,
        marginTop: 22 ,
        borderTopWidth : 1 ,
        borderTopColor : '#dddddd' ,
    },
    btnList : {
        flex : 1 ,
        width: '100%',
        flexDirection : 'row' ,
        alignItems : 'center' ,
        justifyContent : 'space-around'
    }
})