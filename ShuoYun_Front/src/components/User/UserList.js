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

export default class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: '#000',
            list: [],

        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '',
        headerTintColor: '#b2b2b2',
        headerTitleStyle: { // android 居中
            flex: 1,
            // textAlign: 'center',
            fontSize: 18,
        }
    });

    componentDidMount() {
        this.init();
    }

    init = () => {
        const { params: { id, type } } = this.props.navigation.state;
        let body = {
            userId: id,
        };
        if (type === 'follow') {
            fetch(config.api.URI + '/getFollowUser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(body),
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
        } else if (type === 'fans') {
            fetch(config.api.URI + '/getFansUser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(body),
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
        }

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
                            <Icon
                                name={item.sex === 1 ? 'gender-male' : item.sex === 2 ? 'gender-female' : 'gender-male-female'}
                                type='material-community'
                                size={20}
                                color={item.sex === 1 ? '#009ad6' : item.sex === 2 ? '#f391a9' : '#7D26CD'}
                                containerStyle={{ marginRight: 5, marginTop: 10 }}
                            />
                        </View>
                        {/* <View style={{ justifyContent: 'flex-end' }}> */}
                            <Button title='删除' type='danger' style={{ height: 35, width: 60, justifyContent: 'flex-end', marginTop: 20, marginRight: 20 }}>
                            <Text>删除</Text>
                            </Button>
                        {/* </View> */}
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
    title: {
        color: '#a2a2a2',
        fontSize: 18,
        paddingTop: 5,
        paddingLeft: 5
    },
    content: {
        color: '#a2a2a2',
        fontSize: 14,
        paddingTop: 5,
        paddingLeft: 5
    },
    updateTime: {
        color: '#d2d2d2',
        fontSize: 12,
        paddingTop: 5,
        paddingLeft: 5
    }
})
