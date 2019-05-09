import React, { Component } from 'react';
import {
    Dimensions,
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { Carousel } from 'teaset';
import { Card, Button, Icon } from 'react-native-elements';
import styleUtil from "../../common/styleUtil";
import config from '../../common/config';
var timeformate = require('../../common/timeUtil');
const { width, height } = Dimensions.get('window');

const time = new Date();
var today = timeformate.formatDate(time, 'yyyy-MM-dd');
export default class NewActivity extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            btnText: '报名参加',
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
                fetch(config.api.URI + '/activity/liveArticle', {
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
                            // if(item.imgList[0] == ''){
                            //     item.showImage = 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg';
                            // } else item.showImage = item.imgList[1];
                            arrList.push({ isCanYu: false, ...item });
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
        const { activityList, btnText } = this.state;
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
                                        image={{ uri: element.imgList[0].toString() || 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg' }}
                                        title={element.title}
                                        titleStyle={{ fontSize: 16 }}
                                        containerStyle={{ width: width * 0.92 }}
                                        key={element.id}
                                        onPress={() => { navigate('ActivityDetail', { detail: element }) }}
                                    >
                                        <Text style={{ marginBottom: 5 }}>
                                            {element.content}
                                        </Text>
                                        <Text style={{ marginBottom: 5 }}>
                                            主办人: {element.provider}
                                        </Text>
                                        <Text style={{ marginBottom: 5 }}>
                                            时间: {element.startTime}至{element.endTime}
                                        </Text>
                                        <Text style={{ marginBottom: 10 }}>
                                            地点: {element.moreTime}
                                        </Text>
                                        {today > element.startTime ? <Button
                                            icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                            // backgroundColor='#ff4d4d'
                                            buttonStyle={{ backgroundColor: '#ff7040', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                            title={'已过期'}
                                        />
                                            : <Button
                                                icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                                // backgroundColor='#ff4d4d'
                                                buttonStyle={{ backgroundColor: '#ff7040', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                                title={element.isCanYu ? '已报名' : '报名参加'}
                                                onPress={() => { element.isCanYu = !element.isCanYu }}
                                            />
                                        }
                                    </Card>
                                )
                            }
                            return (
                                <Card
                                    image={{ uri: element.imgList[0].toString() || 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg' }}
                                    title={element.title}
                                    containerStyle={{ width: width * 0.92 }}
                                    key={element.id}
                                    onPress={() => { navigate('ActivityDetail', { detail: element }) }}
                                >
                                    <Text style={{ marginBottom: 5 }}>
                                        {element.content}
                                    </Text>
                                    <Text style={{ marginBottom: 5 }}>
                                        主办人: {element.provider}
                                    </Text>
                                    <Text style={{ marginBottom: 5 }}>
                                        时间: {element.startTime}至{element.endTime}
                                    </Text>
                                    <Text style={{ marginBottom: 10 }}>
                                        地点: {element.moreTime}
                                    </Text>
                                    {today > element.startTime ? <Button
                                        icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                        // backgroundColor='#ff4d4d'
                                        buttonStyle={{ backgroundColor: '#ff7040', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                        title={'已过期'}
                                    />
                                        : <Button
                                            icon={<Icon name='globe' color='#ffffff' type='feather' />}
                                            // backgroundColor='#ff4d4d'
                                            buttonStyle={{ backgroundColor: '#ff7040', borderRadius: 5, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                                            title={element.isCanYu ? '已报名' : '报名参加'}
                                            onPress={() => { element.isCanYu = !element.isCanYu }}
                                        />
                                    }

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