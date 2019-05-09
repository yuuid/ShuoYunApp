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
import { Avatar, Card, Button, Icon } from 'react-native-elements';
import { Toast } from 'teaset';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ZoomImage from 'react-native-zoom-image';
import config from '../../common/config';

const { width, height } = Dimensions.get('window');
// let index = 1
export default class HuoDong extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            articleList: [],
            myarticles: [],
            nowUser: {},
            activityList: [
                {
                    id: 1,
                    title: '最热活动1',
                    provider: '沉默不寡言文学社',
                    content: '传承经典，书写芬芳',
                    startTime: '2019-04-01',
                    endTime: '2019-04-03',
                    moreTime: '晚上6:30',
                    place: '2号楼北楼520',
                    showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg'
                },
                {
                    id: 2,
                    title: '最热活动2',
                    provider: '沉默不寡言文学社',
                    content: '传承经典，书写芬芳',
                    startTime: '2019-04-01',
                    endTime: '2019-04-03',
                    moreTime: '晚上6:30',
                    place: '2号楼北楼520',
                    showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg'
                },
                {
                    id: 3,
                    title: '最热活动3',
                    provider: '沉默不寡言文学社',
                    content: '传承经典，书写芬芳',
                    startTime: '2019-04-01',
                    endTime: '2019-04-03',
                    moreTime: '晚上6:30',
                    place: '2号楼北楼520',
                    showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg'
                }
            ],
        }
        this.fetchData = this.fetchData.bind(this)
    }

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
        const { activityList } = this.state;

        const renderItem = ({ item, i }) => {
            if (i % 2 === 0) {
                return (
                    <View style={styles.hotActivity}>
                        <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                            <Card
                                image={{ uri: item.showImage }}
                                title={item.title}
                                containerStyle={{ width: width * 0.92 }}
                                key={item.id}
                            >
                                <Text style={{ marginBottom: 5 }}>
                                    主办人: {item.provider}
                                </Text>
                                <Text style={{ marginBottom: 5 }}>
                                    {item.content}
                                </Text>
                                <Text style={{ marginBottom: 5 }}>
                                    时间: {item.startTime}至{item.endTime} {item.moreTime}
                                </Text>
                                <Text style={{ marginBottom: 10 }}>
                                    地点: {item.place}
                                </Text>
                                <Button
                                    icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                    // backgroundColor='#ff4d4d'
                                    buttonStyle={{ backgroundColor: '#ff7040', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                    title='进入活动'
                                />
                            </Card>
                        </View>
                    </View>
                );
            }
            return (

                <View style={styles.hotActivity}>
                    <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                        <Card
                            image={{ uri: item.showImage }}
                            title={item.title}
                            containerStyle={{ width: width * 0.92 }}
                            key={item.id}
                        >
                            <Text style={{ marginBottom: 5 }}>
                                主办人: {item.provider}
                            </Text>
                            <Text style={{ marginBottom: 5 }}>
                                {item.content}
                            </Text>
                            <Text style={{ marginBottom: 5 }}>
                                时间: {item.startTime}至{item.endTime} {item.moreTime}
                            </Text>
                            <Text style={{ marginBottom: 10 }}>
                                地点: {item.place}
                            </Text>
                            <Button
                                icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                // backgroundColor='#ff4d4d'
                                buttonStyle={{ backgroundColor: '#ff4d4d', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                title='进入活动'
                            />
                        </Card>
                    </View>
                </View>
            );
            // return (
            // <TouchableOpacity
            //     onPress={() => { navigate('Detail', { olddetail: item }) }}
            //     activeOpacity={0.9}
            // >
            //     <View style={[styles.hotList, item.key + 1 == articleList.length && styles.lastList]}>
            //         <View style={{ width, justifyContent: 'space-between', flexDirection: 'row' }}>
            //             <View style={{
            //                 flex: 0,
            //                 flexDirection: 'row',
            //                 // alignItems: 'flex-start',
            //                 justifyContent: 'flex-start',
            //                 paddingLeft: 10,
            //             }}>
            //                 <Avatar rounded source={{ uri: item.userImg }} />
            //                 <Text style={{ marginLeft: 5, marginTop: 5 }}>{item.username}</Text>
            //             </View>
            //             <View style={{
            //                 flex: 0,
            //                 flexDirection: 'column',
            //                 justifyContent: 'flex-end',
            //                 paddingRight: 10
            //             }}>
            //                 <Text style={{ fontSize: 11 }}>{item.updatetime}</Text>
            //                 <View style={{
            //                     flex: 0,
            //                     flexDirection: 'row',
            //                 }}>
            //                     <Icon name="eye" size={15} color={'#848484'} />
            //                     <Text style={{ fontSize: 11, marginLeft: 5 }}>{item.pageview}</Text>
            //                 </View>
            //             </View>
            //         </View>

            //         <View style={{
            //             flex: 0,
            //             flexDirection: 'column',
            //             justifyContent: 'space-between',
            //             // alignItems: 'left',
            //         }}>
            //             <Text style={styles.title}>{item.title}</Text>
            //             <Text style={styles.content} numberOfLines={3} ellipsizeMode={'tail'}>{item.content}</Text>
            //         </View>
            //         <View style={styles.tags}>
            //             {item.imgList && item.imgList.map((v, i) => {
            //                 if (i < 3 && v !== '') {
            //                     return (
            //                         <View key={i} style={{ marginTop: 5, marginLeft: 10 }}>
            //                             <ZoomImage
            //                                 source={{ uri: v }}
            //                                 imgStyle={{ width: 100, height: 100 }}
            //                                 // style={styles.img}
            //                                 duration={200}
            //                                 enableScaling={false}
            //                                 easingFunc={Easing.ease}
            //                             />
            //                         </View>
            //                     )
            //                 }
            //             })}
            //         </View>
            //     </View>
            // </TouchableOpacity>

            // );
        }

        return (
            <View style={{ backgroundColor: '#f2f2f2' }}>

                {this.state.ready
                    ? <ActivityIndicator size="large" style={styles.loadding} />
                    : <FlatList
                        data={activityList}
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
        minHeight: 180,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderBottomColor: '#f2f2f2'
    },
    lastList: {
        borderBottomWidth: 0
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 10,
        marginTop: 5,
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    tags: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 5,
    }
})