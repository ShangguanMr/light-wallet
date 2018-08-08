/**
 * 关注货币列表
 */

import React, { Component } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ImageBackground,
	Dimensions,
	FlatList,
	SectionList
} from "react-native";

const { width, height } = Dimensions.get("window");
export default class currencyList extends Component {

	constructor() {
		super()
		this.state = {
			list : [
				{ name : 'EKT' , status : true , delete : false} ,
				{ name : 'EOS' , status : true , delete : true} ,
				{ name : 'BTC' , status : true , delete : true} ,
				{ name : 'ETH' , status : true , delete : true} ,
			],
			listFocus : [] ,
			listNoFocus : []
		}
	}

	componentWillMount(){
		let listFocus = [] ;
		let listNoFocus = [] ;
		for (let i = 0; i < this.state.list.length; i++) {
			if(this.state.list[i].status === true ){
				listFocus.push(this.state.list[i])
			}else{
				listNoFocus.push(this.state.list[i])
			}
		};
		this.setState({
			listFocus : listFocus ,
			listNoFocus : listNoFocus             
		})
	}

	_header = (title) => {
		return (
			<View style={styles.header}>
				<Text style={styles.title}>{title}</Text>
			</View>
		)
	}
	_listItem = ({item,index}) => {
		let Status = item.status || false ;
		return (
			<View style={ styles.itemContainer}>
				<View style={styles.item}>
					<View style={ styles.leftCon}>
						<ImageBackground
							style={styles.leftBorder}
							source={require('../assets/img/logo.png')} >
						</ImageBackground>
						<View style={ styles.leftWord }>
							<Text>{item.name}</Text>
							<Text>{item.name}</Text>
						</View>
					</View>
					<ImageBackground
						style={styles.icon}
						source={ Status ? require('../assets/img/reduce.png') : require('../assets/img/add.png')}
					>
						<Text 
							style={styles.icon}
							onPress={ () => { this.test(item,index) }}
						></Text>
					</ImageBackground>
				</View>
			</View>
		)
	}
	test(item,index){
		let listFocus = this.state.listFocus ;
		let listNoFocus = this.state.listNoFocus;

		let changeItem = {} ;
		if(item.status === true){
			if(item.delete !== false){
				changeItem.name = item.name ;
				changeItem.status = false ;
				listFocus.splice(index,1);
				listNoFocus.push(changeItem);
				this.setState({
					listFocus : listFocus ,
					listNoFocus : listNoFocus
				})
			}
		}else{
			changeItem.name = item.name ;
			changeItem.status = true ;
			listNoFocus.splice(index,1);
			listFocus.push(changeItem);
			this.setState({
				listFocus : listFocus ,
				listNoFocus : listNoFocus
			})
		}
		// let list = [{ name: 'XAS', status: true }]
		// this.setState({
		//     listFocus : list
		// })
	}

	_keyExtractor = (item,index) => index + '';

	_ListEmptyComponent(){
		return (
			<View style={{height:35,width:'100%',backgroundColor:'green'}} />
		)
	}
	render() {
		return (
			<View
			style={{ flex : 1 , flexDirection : 'column', backgroundColor : '#fff'}}>
			<SectionList 
				renderItem={this._listItem}
				keyExtractor = {this._keyExtractor}
				ListEmptyComponent = {this._ListEmptyComponent}
				renderSectionHeader={({section}) => this._header(section.title)}
				sections={[ // 不同section渲染相同类型的子组件
					{
						data: this.state.listFocus, 
						title: '已在首页显示'
					},
					{
						data: this.state.listNoFocus, 
						title: '未在首页显示'
					},
				]}
			/>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	header : {
		width : '100%',
		height : 35 ,
		backgroundColor: '#f8f8f8'
	},
	title : {
		fontSize : 18 ,
		marginLeft : 14 ,
		lineHeight : 35
	},
	itemContainer : {
		height : 76 
	},
	item : {
		flex : 1 ,
		flexDirection : 'row' ,
		justifyContent : 'space-between',
		alignItems : 'center',
		paddingLeft : 13 ,
		paddingRight : 13 ,
		borderBottomWidth : 1 ,
		borderBottomColor : '#ddd'
	},
	leftCon : {
		flex : 1 ,
		flexDirection : 'row',
		justifyContent :'flex-start'
	},
	leftBorder : {
		width: 40,
		height: 40,
		overflow: 'hidden' ,
		borderWidth: 1,
		// borderStyle: 'solid',
		borderColor: '#ddd',
		borderRadius: 20
	},
	leftWord : {
		marginLeft : 10
	},
	icon: {
		width : 29 ,
		height : 29
	}
});