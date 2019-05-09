import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import styleUtil from "../../common/styleUtil";
import { Icon, Avatar, Text } from 'react-native-elements';
import { ListRow, Button } from 'teaset';
// import Swipeout from 'react-native-swipeout';
import config from '../../common/config';
// import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

export default class AllUserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: '#000',
            list: [],

        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '所有社员',
        headerTintColor: '#ff7040',
        headerTitleStyle: { // android 居中
            flex: 1,
            // textAlign: 'center',
            fontSize: 18,
            color: '#ff7040'
        }
    });

    componentDidMount() {
        this.init();
    }

    init = () => {
        // const { params: { type } } = this.props.navigation.state;
        // let body = {
        //     userId: id,
        // };

        fetch(config.api.URI + '/users/allusers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            // body: JSON.stringify(body),
        }).then((response) => {
            return response.json();
        }).then((responseText) => {
            let userList = [];
            if (responseText.result.code === 200) {
                responseText.result.data && responseText.result.data.forEach((item, index) => {
                    userList.push({ ...item });
                })
            }
            this.setState({ list: userList });
        }).catch((error) => {
            console.error(error);
        });

    };

    //删除操作
    handleDelete = () => {
        //取消关注、移除粉丝、删除文章
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={[styles.likes]}>
                {/* <Swipeout right={swipeoutBtns}> */}
                <View style={styles.like}>
                    <View style={{ width, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <View style={styles.avatar}>
                            <Avatar rounded source={{ uri: item.userImg }} size='medium' />
                            <Text style={styles.username}>{item.username}</Text>
                        </View>
                        {/* <View style={{ justifyContent: 'flex-end' }}> */}
                        {/* <Button title='详情' type='primary' style={{ height: 35, width: 50, justifyContent: 'flex-end', marginTop: 20, marginRight: 20 }} >
                            <Text style={{ fontSize: 12}}>详情</Text>
                        </Button> */}
                        <View style={styles.btnstyle}>
                            <Button
                                title='详情'
                                // size=''
                                type='primary'
                                style={{ height: 35, width: 63, justifyContent: 'flex-end',marginRight: 20 }}
                                // onPress={() => { navigate('HuaTiExport', { detail: detail }) }} 
                            />
                        </View>
                    </View>
                </View>
                {/* </Swipeout> */}
            </TouchableOpacity>
        )

    }


    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        const { list } = this.state

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ paddingTop: 5 }}>
                        {this.state.ready
                            ? <ActivityIndicator size="large" style={styles.loadding} />
                            : <FlatList
                                keyExtractor={this.keyExtractor}
                                data={list}
                                onRefresh={this.refreshData}
                                refreshing={this.state.refreshing}
                                renderItem={this.renderItem}
                            />}
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>到底啦</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleUtil.backgroundColor,
    },
    likes: {
        width,
        minHeight: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        backgroundColor: '#fff',
        // paddingVertical: 5,
        paddingHorizontal: 10
    },
    avatar: {
        // flex: 0.2,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    btnstyle: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    like: {
        flex: 1,
        width,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    username: {
        color: '#a2a2a2',
        fontSize: 15,
        paddingTop: 8,
        paddingLeft: 5
    },
})
