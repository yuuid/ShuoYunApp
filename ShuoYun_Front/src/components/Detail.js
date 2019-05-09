import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    ActivityIndicator,
    Easing,
    Image,
    TouchableOpacity
} from 'react-native';
import { Icon, Avatar, Divider } from 'react-native-elements';
import { Drawer, Label } from 'teaset';
import ZoomImage from 'react-native-zoom-image';
import styleUtil from "../common/styleUtil";
import config from '../common/config';

const { width, height } = Dimensions.get('window');
// let index = 1
export default class Detail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            isInit: false,
            isStar: false,
            detail: {},
            nowUser: {},
        }
        // this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount() {
        this.init();

    }

    init = () => {
        config.getUser().then(user => {
            this.setState({ nowUser: user });
        })
        const { params: { olddetail } } = this.props.navigation.state;
        let body = {
            id: olddetail.articleId,
        };
        fetch(config.api.URI + '/addpageView', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            return response.json();
        }).then((responseText) => {
            this.setState({ detail: responseText.result.data, isInit: true });
            this.renderContent();
        }).catch((error) => {
            console.error(error);
        });
    }

    showShare = () => {
        let view = (
            <View style={{ backgroundColor: '#fff', height: 110 }}>
                <View style={{ marginTop: 5, marginLeft: 10 }}>
                    <Text style={{ color: '#797979', fontSize: 12 }}>分享至</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingHorizontal: 10, marginTop: 20 }}>
                        <Image style={{ width: 50, height: 50 }} source={require('../assets/icons/QQ.png')} />
                        <Image style={{ width: 50, height: 50 }} source={require('../assets/icons/wechat-fill.png')} />
                        <Image style={{ width: 50, height: 50 }} source={require('../assets/icons/weibo.png')} />
                    </View>
                </View>
            </View>
        );
        let drawer = Drawer.open(view, 'bottom');

    }

    setArticleType = (type) => {
        const { params: { olddetail } } = this.props.navigation.state;
        const { goBack } = this.props.navigation;
        let body = {
            id: olddetail.articleId,
            isCheck: type,
        };
        fetch(config.api.URI + '/setCheck', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            return response.json();
        }).then((responseText) => {
            if (responseText.result.code === 200) {
                if (type == 1) {
                    const body = {
                        touserId: olddetail.userId,
                        content: '您的文章已通过审核',
                        articleId: olddetail.articleId,
                    }
                    fetch(config.api.URI + '/message/insert', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify(body),
                    })
                } else {
                    const body = {
                        touserId: olddetail.userId,
                        content: '您的文章未通过审核',
                        articleId: olddetail.articleId,
                    }
                    fetch(config.api.URI + '/message/insert', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        body: JSON.stringify(body),
                    })
                }
                goBack();
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    renderContent = () => {
        const { params: { olddetail } } = this.props.navigation.state;
        const { isInit, detail, isStar, nowUser } = this.state
        const { navigate } = this.props.navigation;
        if (isInit) {
            const content = []
            if (detail.content) {
                const param = detail.content.split('/n')
                param && param.forEach((v, i) => {
                    content.push(<Text style={styles.content} key={i}>{v}</Text>)
                })

            }
            return (
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ width, justifyContent: 'space-between', flexDirection: 'row', paddingTop: 10, backgroundColor: '#fff' }}>
                        <View style={{
                            flex: 0,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingLeft: 10
                        }}>

                            <Avatar rounded source={{ uri: olddetail.userImg }} size={36} />
                            <Text style={{ marginLeft: 5, marginTop: 5, fontSize: 14 }}>{olddetail.username}</Text>
                        </View>
                        <View style={{
                            flex: 0,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            paddingRight: 10
                        }}>
                            <Text style={{ fontSize: 11 }}>{detail.updatetime}</Text>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                            }}>
                                <Icon name="eye" size={15} color={'#848484'} type='feather' />
                                <Text style={{ fontSize: 12, marginLeft: 5 }}>{detail.pageview}</Text>
                            </View>
                        </View>
                    </View>
                    <Divider style={{ backgroundColor: '#d2d2d2', marginVertical: 5 }} />
                    <View style={{ backgroundColor: '#fff' }}>
                        <Text style={styles.title}>{detail.title}</Text>
                    </View>
                    {content}
                    <View style={styles.tags}>
                        {detail.imgList && detail.imgList.map((v, i) => {
                            if (v != '') {
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
                    <Divider style={{ backgroundColor: '#d2d2d2', marginVertical: 5 }} />
                    {nowUser.usertype == 1 && olddetail.isCheck == 0
                        ? <View style={styles.footer}>
                            <TouchableOpacity onPress={() => this.setArticleType(1)} activeOpacity={0.9}>
                                <Label text='过审' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setArticleType(2)} activeOpacity={0.9}>
                                <Label text='退稿' />
                            </TouchableOpacity>

                        </View>
                        : <View style={styles.footer}>
                            <Icon type='feather' name='star' color={isStar ? '#ff4040' : '#fecb37'} size={28} onPress={() => { this.setState({ isStar: !isStar }) }} />
                            <Icon
                                type='feather'
                                name='message-circle'
                                color='#ff7040'
                                onPress={() => navigate('PingLunDetail', { item: detail })}

                                size={28}
                            />
                            <Icon type='feather' name='share-2' color='#1296db' size={28} onPress={this.showShare} />

                        </View>}
                </View>
            );
        }
        else {
            return <View style={{ width, justifyContent: 'center', paddingTop: 20 }}>
                <Text>加载中...</Text>
            </View>
        }

    }

    render() {

        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.renderContent()}
                </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleUtil.backgroundColor,
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
        fontSize: 14,
        backgroundColor: '#fff',
        lineHeight: 28,
        // color: '#979797'
    },
    footer: {
        width,
        justifyContent: 'space-around',
        flexDirection: 'row',
        height: 40,
        paddingHorizontal: 10
        // position: 'absolute',
        // bottom: 0,
        // marginTop: 200,
    },
    tags: {
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 5,
    },
    typeName: {
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        flexDirection: 'row',
        paddingTop: 5,
    },
})
