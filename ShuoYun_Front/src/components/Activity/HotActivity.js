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
    ActivityIndicator
} from 'react-native';
import { Carousel } from 'teaset';
import { Card, Button, Icon } from 'react-native-elements';
import SearchInput from '../Find/SearchList';
import config from '../../common/config';
import styleUtil from "../../common/styleUtil";

const { width, height } = Dimensions.get('window');

export default class HotActivity extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            // activityList: [
            //     {
            //         id: 1,
            //         title: '最新活动1',
            //         provider: '沉默不寡言文学社',
            //         content: '传承经典，书写芬芳',
            //         startTime: '2019-04-01',
            //         endTime: '2019-04-03',
            //         // moreTime: '晚上6:30',
            //         // place: '2号楼北楼520',
            //         showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg'
            //     },
            //     {
            //         id: 2,
            //         title: '最新活动2',
            //         provider: '沉默不寡言文学社',
            //         content: '传承经典，书写芬芳',
            //         startTime: '2019-04-01',
            //         endTime: '2019-04-03',
            //         // moreTime: '晚上6:30',
            //         // place: '2号楼北楼520',
            //         showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg'
            //     },
            //     {
            //         id: 3,
            //         title: '最新活动3',
            //         provider: '沉默不寡言文学社',
            //         content: '传承经典，书写芬芳',
            //         startTime: '2019-04-01',
            //         endTime: '2019-04-03',
            //         // moreTime: '晚上6:30',
            //         // place: '2号楼北楼520',
            //         showImage: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg'
            //     }
            // ],
            activityList: [],
            ready: true,
            refreshing: false,
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
                // let body = {
                //     userId: user.userId,
                // };
                let arrList = [];
                fetch(config.api.URI + '/activity/newActivity', {
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
                    this.setState({ activityList: arrList, ready: false });
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                Toast.fail('用户未登陆');
                this.setState({ activityList: [], ready: false });
            }
        });

    }

    renderContent = () => {
        const { navigate } = this.props.navigation;
        const { activityList } = this.state;
        return (
            <View style={{ flexDirection: 'column', minHeight: height }}>
                {/* <SearchInput navigation={this.props.navigation} /> */}
                <View style={styles.hotActivity}>
                    {/* <Text style={{ color: '#979797', textAlign: 'center' }}>最新活动</Text> */}
                    <View style={{ flexDirection: 'column', marginVertical: 5 }}>
                        {activityList.length > 0 && activityList.map((element, index) => {
                            if (index % 2 == 0) {
                                return (
                                    <Card
                                        image={{ uri: element.imgList[0] || 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg' }}
                                        title={element.title}
                                        titleStyle={{ fontSize: 16 }}
                                        containerStyle={{ width: width * 0.92 }}
                                        key={element.id}
                                    >
                                        <Text style={{ marginBottom: 5 }}>
                                            主办人: {element.provider}
                                        </Text>
                                        <Text style={{ marginBottom: 5 }} numberOfLines={3} ellipsizeMode={'tail'}>
                                            {element.content}
                                        </Text>
                                        <Text style={{ marginBottom: 5 }}>
                                            时间: {element.startTime}至{element.endTime}
                                        </Text>
                                        {/* <Text style={{ marginBottom: 10 }}>
                                            地点: {element.place}
                                        </Text> */}
                                        <Button
                                            icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                            // backgroundColor='#ff4d4d'
                                            buttonStyle={{ backgroundColor: '#ff7040', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                            title='了解活动'
                                            onPress={() => { navigate('ActivityDetail', { detail: element }) }}
                                        />
                                    </Card>
                                )
                            }
                            return (
                                <Card
                                    image={{ uri: element.imgList[0] || 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg' }}
                                    title={element.title}
                                    containerStyle={{ width: width * 0.92 }}
                                    key={element.id}
                                >
                                    <Text style={{ marginBottom: 5 }}>
                                        主办人: {element.provider}
                                    </Text>
                                    <Text style={{ marginBottom: 5 }} numberOfLines={3} ellipsizeMode={'tail'}>
                                        {element.content}
                                    </Text>
                                    <Text style={{ marginBottom: 5 }}>
                                        时间: {element.startTime}至{element.endTime}
                                    </Text>
                                    {/* <Text style={{ marginBottom: 10 }}>
                                        地点: {element.place}
                                    </Text> */}
                                    <Button
                                        icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                        // backgroundColor='#ff4d4d'
                                        buttonStyle={{ backgroundColor: '#ff4d4d', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                        title='了解活动'
                                        onPress={() => { navigate('ActivityDetail', { detail: element }) }}
                                    />
                                </Card>
                            )
                        })}
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'#FF7040'} barStyle={'light-content'} />
                <ScrollView>
                    {this.state.ready
                        ? <ActivityIndicator size="large" style={styles.loadding} />
                        : this.renderContent()
                    }


                </ScrollView>
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
        backgroundColor: styleUtil.backgroundColor,
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
    hotActivity: {
        // paddingVertical: 10,
    }
})