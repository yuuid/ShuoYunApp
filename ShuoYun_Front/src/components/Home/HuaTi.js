import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Easing,
} from 'react-native';
import { Avatar, Icon, Image } from 'react-native-elements';
import { Toast } from 'teaset';
// import ZoomImage from 'react-native-zoom-image';
import config from '../../common/config';

const { width, height } = Dimensions.get('window');

export default class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            // isSelect: true,
            list: [],
            nowUser: {},
        }
        this.fetchData = this.fetchData.bind(this)
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '一说',
        headerTintColor: '#ff7040',
        headerTitleStyle: { // android 居中
            flex: 1,
            // textAlign: 'center',
            fontSize: 18,
            color: '#ff7040'
        },
        headerRight: (
            <Icon
                onPress={() => navigation.navigate('HuaTiExport')}
                type="feather"
                name="plus-circle"
                color="#ff7040"
                containerStyle={{ paddingRight: 20 }}
            />
        ),

    });

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        config.getUser().then(user => {
            this.setState({ nowUser: user });
            if (user.userId) {
                // let body = {
                //     userId: user.userId,
                // };
                let arrList = [];
                fetch(config.api.URI + '/huati/getAll', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    // body: JSON.stringify(body),
                }).then((response) => {
                    // this.setState({ refreshing: false });
                    return response.json();
                }).then((responseText) => {
                    if (responseText.result.code === 200) {
                        responseText.result.data && responseText.result.data.forEach((item, index) => {
                            arrList.push({ ...item });
                        })
                    }
                    arrList.sort(function (a, b) { return b.updatetime > a.updatetime })
                    this.setState({ list: arrList, ready: false, refreshing: false });
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                Toast.fail('用户未登陆');
                this.setState({ list: [], ready: false, refreshing: false });
            }
        });

    }

    refreshData = () => {
        // const { nowUser } = this.state
        this.setState({ refreshing: true });
        this.fetchData();
    }

    keyExtractor = (item, index) => index.toString();

    render() {
        const { navigate } = this.props.navigation;
        const { list, nowUser } = this.state;

        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    onPress={() => { navigate('HuaTiDetail', { detail: item }) }}
                    activeOpacity={0.9}
                    style={{ marginTop: 10, backgroundColor: '#fff' }}
                >
                    <View style={[styles.hotList, item.key + 1 == list.length && styles.lastList]}>

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.content} numberOfLines={2} ellipsizeMode={'tail'}>{item.content}</Text>
                        <Text style={styles.createTime}>{item.createTime}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View style={{ backgroundColor: '#f2f2f2' }}>
                {this.state.ready
                    ? <ActivityIndicator size="large" style={styles.loadding} />
                    : <FlatList
                        data={list}
                        onRefresh={this.refreshData}
                        refreshing={this.state.refreshing}
                        keyExtractor={this.keyExtractor}
                        renderItem={renderItem}
                    />}

            </View>
        );

    }
}

const styles = StyleSheet.create({
    loadding: {
        marginTop: 100,
        color: '#ff7040',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        // paddingVertical: 10,
        width,
    },
    hotList: {
        // minHeight: 180,
        flexDirection: 'column',
        // justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10
    },
    lastList: {
        borderBottomWidth: 0
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
        marginTop: 5,
        color: '#333'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 5,
        paddingHorizontal: 10,
        lineHeight: 23,
    },
    createTime: {
        paddingHorizontal: 10,
        fontSize: 11,
        color: '#797979'
    },
    tags: {
        // justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 5,
    },
})