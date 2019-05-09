import React, { Component } from 'react';
import {
    Dimensions,
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Easing,
    FlatList
} from 'react-native';
import { Carousel, Button } from 'teaset';
import { Avatar, Icon, Header, Divider } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import styleUtil from "../common/styleUtil";
import ZoomImage from 'react-native-zoom-image';
import config from '../common/config';

const { width, height } = Dimensions.get('window');

export default class HuaTiDetail extends Component {

    static navigationOptions = ({ navigation }) => ({
        // headerTitle: '',
        headerTintColor: '#ff7040',
        // headerTitleStyle: { // android 居中
        //     flex: 1,
        //     // textAlign: 'center',
        //     fontSize: 18,
        //     color: '#ff7040'
        // },
        // headerRight: (
        //     <Icon
        //         onPress={() => navigation.navigate('Search')}
        //         type="feather"
        //         name="search"
        //         color="#ff7040"
        //         containerStyle={{ paddingRight: 20 }}
        //     />
        // ),

    });

    constructor(props) {
        super(props);
        this.state = {
            isStar: false,
            ready: false,
            refreshing: false,
            user: {
                isFollow: false,
            },
            list: [],
            // activityDetail: {
            //     id: 1,
            //     title: '最新活动1',
            //     provider: '沉默不寡言文学社',
            //     content: '传承经典，书写芬芳 活动真在火热进行中，快来参加吧。也可以发表文章图片说说你的想法',
            //     startTime: '2019-04-01',
            //     endTime: '2019-04-03',
            //     moreTime: '晚上6:30',
            //     place: '2号楼北楼520',
            //     showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg',
            //     list: [
            //         {
            //             username: 'xiaoxiaojie',
            //             userImg: 'https://wx1.sinaimg.cn/mw690/7e70c99dgy1fxmrvurnp6j20u00u0aiy.jpg',
            //             title: '欢快的活动',
            //             content: '地方化的看法吧到了咖啡店烧开后拉克丝的发布会上带来了劳动法那随你卡卡剪短发，明明一点都不无聊嘛',
            //             updatetime: '2019-04-01',
            //             pageview: 123,
            //             imgList: [],
            //         },
            //         {
            //             username: 'xiaojie',
            //             userImg: 'https://wx1.sinaimg.cn/mw690/7e70c99dgy1fxmrvurnp6j20u00u0aiy.jpg',
            //             title: '小小期待',
            //             content: '地方化的看法吧到了咖啡店烧开后拉克丝的发布会上带来了劳动法那随你卡卡剪短发，明明一点都不无聊嘛',
            //             updatetime: '2019-03-29',
            //             pageview: 166,
            //             imgList: [],
            //         }
            //     ],
            // }
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const { params: { detail } } = this.props.navigation.state;
        config.getUser().then(user => {
            // this.setState({ nowUser: user });
            if (user.userId) {
                let body = {
                    huatiId: detail.huatiId,
                };
                let arrList = [];
                fetch(config.api.URI + '/huati/getDetail', {
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
                            // if(item.imgList[0] == ''){
                            //     item.showImage = 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg';
                            // } else item.showImage = item.imgList[1];
                            arrList.push({ ...item });
                        })
                    }
                    this.setState({ list: arrList, ready: false });
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                Toast.fail('用户未登陆');
                this.setState({ list: [], ready: false });
            }
        });

    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        const { list } = this.state;
        return (
            <TouchableOpacity
                onPress={() => { navigate('Detail', { olddetail: item }) }}
                activeOpacity={0.9}
                style={{ backgroundColor: '#fff', marginTop: 10 }}
            >
                <View style={[styles.hotList, item.key + 1 == list.length && styles.lastList]}>
                    <View style={{ width, justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                        <View style={{
                            flex: 0,
                            flexDirection: 'row',
                            // alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            paddingLeft: 10,
                            // paddingTop: 10,
                        }}>
                            <Avatar rounded source={{ uri: item.userImg }} />
                            <Text style={{ marginLeft: 5, marginTop: 5 }}>{item.username}</Text>
                        </View>
                        <View style={{
                            flex: 0,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            paddingRight: 10,
                        }}>
                            <Text style={{ fontSize: 12 }}>{item.updatetime}</Text>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                            }}>
                                <Icon name="eye" size={15} color={'#848484'} type='feather' />
                                <Text style={{ fontSize: 12, marginLeft: 5 }}>{item.pageview}</Text>
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
                        <Text style={styles.content} numberOfLines={3} ellipsizeMode={'tail'}>{item.content}</Text>
                    </View>
                    <View style={styles.tags}>
                        {item.imgList && item.imgList.map((v, i) => {
                            return (<View key={i} style={{ marginTop: 5, marginLeft: 10 }}>
                                <ZoomImage
                                    source={{ uri: v }}
                                    imgStyle={{ width: 100, height: 100 }}
                                    // style={styles.img}
                                    duration={200}
                                    enableScaling={false}
                                    easingFunc={Easing.ease}
                                />
                            </View>)
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderContent = () => {
        const { navigate, goBack } = this.props.navigation;
        const { params: { detail } } = this.props.navigation.state;
        const { user, list, isStar } = this.state;
        const content = [];
        if (detail.content) {
            const param = detail.content.split('/n')
            param && param.forEach((v, i) => {
                content.push(<Text style={styles.content} key={i}>{v}</Text>)
            })
        }
        return (
            <View style={{ flexDirection: 'column', minHeight: height }}>

                <View style={styles.activityDetail}>
                    <Text style={styles.title}>{detail.title}</Text>
                    {content}
                </View>
                <Divider style={{ marginTop: 10 }} />
                <View style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ fontSize: 14, marginLeft: 10, color: '#ff7040' }}>已有{list.length}条回答</Text>
                    </View>
                    <View style={{ paddingRight: 10 }}>
                        <Button title='投稿' size='sm' type='secondary' onPress={() => { navigate('HuaTiArticle', { detail: detail }) }} />
                    </View>
                </View>
                {this.state.ready ? <ActivityIndicator size="large" style={styles.loadding} />
                    : <FlatList
                        data={list}
                        onRefresh={this.refreshData}
                        refreshing={this.state.refreshing}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    />
                }
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='#333333' barStyle={'light-content'} />
                <ScrollView>
                    {this.renderContent()}
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
    loadding: {
        marginTop: 100,
    },
    typeList: {
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginTop: 25,
        flexDirection: 'row',
    },
    typeName: {
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginBottom: 25,
        flexDirection: 'row',
        marginTop: 5,
    },
    typeNameText: {
        fontSize: 12,
    },
    activityDetail: {
        paddingVertical: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    hotList: {
        // minHeight: 180,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 10,
        // borderBottomWidth: 1,
        // backgroundColor: '#fff',
        // borderBottomColor: '#f2f2f2'
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
        lineHeight: 23
    },
    tags: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 5,
    }
})