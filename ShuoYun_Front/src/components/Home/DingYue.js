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
    Easing
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { Toast } from 'teaset';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ZoomImage from 'react-native-zoom-image';
import config from '../../common/config';

const { width, height } = Dimensions.get('window');
// let index = 1
export default class DingYue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            articleList: [],
            myarticles: [],
            nowUser: {},
        }
        this.fetchData = this.fetchData.bind(this)
    }

    static navigationOptions = {
        header: null
    };
    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        config.getUser().then(user => {
            // this.setState({ nowUser: user });
            if (user.userId) {
                let body = {
                    userId: user.userId,
                };
                let arrList = [];
                fetch(config.api.URI + '/getArticle', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(body),
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
                    this.setState({ articleList: arrList, ready: false, refreshing: false });
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                Toast.fail('用户未登陆');
                this.setState({ articleList: [], ready: false, refreshing: false });
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
        const { pages, articleList } = this.state;

        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    onPress={() => { navigate('Detail', { olddetail: item }) }}
                    activeOpacity={0.9}
                    style={{ marginTop: 10, backgroundColor: '#fff' }}
                >
                    <View style={[styles.hotList, item.key + 1 == articleList.length && styles.lastList]}>
                        <View style={{ width, justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                // alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                paddingLeft: 10,
                            }}>
                                <Avatar rounded source={{ uri: item.userImg }} />
                                <Text style={{ marginLeft: 5, marginTop: 5 }}>{item.username}</Text>
                            </View>
                            <View style={{
                                flex: 0,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                paddingRight: 10
                            }}>
                                <Text style={{ fontSize: 11 }}>{item.updatetime}</Text>
                                <View style={{
                                    flex: 0,
                                    flexDirection: 'row',
                                }}>
                                    <Icon name="eye" size={15} color={'#848484'} />
                                    <Text style={{ fontSize: 11, marginLeft: 5 }}>{item.pageview}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{
                            flex: 0,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            // alignItems: 'left',
                        }}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.content} numberOfLines={2} ellipsizeMode={'tail'}>{item.content}</Text>
                        </View>
                        <View style={styles.tags}>
                            {item.imgList && item.imgList.map((v, i) => {
                                if (i < 3 && v !== '') {
                                    return (
                                        <View key={i} style={{ marginTop: 5, marginLeft: 10 }}>
                                            <ZoomImage
                                                source={{ uri: v }}
                                                imgStyle={{ width: 100, height: 100 }}
                                                // style={styles.img}
                                                duration={200}
                                                enableScaling={false}
                                                easingFunc={Easing.ease}
                                            />
                                        </View>
                                    )
                                }
                            })}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View style={{ backgroundColor: '#f2f2f2' }}>

                {this.state.ready
                    ? <ActivityIndicator size="large" style={styles.loadding} />
                    : <FlatList
                        data={articleList}
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
    smallFont: {
        lineHeight: 18,
        color: '#A6A6A6',
        fontSize: 10
    },
    loadding: {
        marginTop: 100,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        // paddingVertical: 10,
        width,
    },
    circle: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        backgroundColor: '#f76260',
        borderColor: 'green',
        borderStyle: 'solid',
        borderRadius: 15,
        paddingBottom: 2
    },
    hotList: {
        // minHeight: 180,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        // borderBottomWidth: 1,
        // backgroundColor: '#fff',
        // borderBottomColor: '#979797'
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
    tags: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 5,
    }
})