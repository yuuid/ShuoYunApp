import React, { Component } from 'react';
import {
    StyleSheet,
    // Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import { Input, Button } from 'teaset';
import config from '../../common/config';

// import Icon from 'react-native-vector-icons/SimpleLineIcons';

const { width, height } = Dimensions.get('window');

export default class PingLunDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            commitsData: {
                id: 1,
                title: '大神来袭',
                content: '',
                data: [
                    {
                        commitId: 1,
                        content: "这样子呢？",
                        parent: null,
                        username: "阿布",
                        userId: 3,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652399762&di=7e1d16166489156b44c5fb50cfdc7946&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201412%2F09%2F20141209162618_zHHaS.jpeg',
                        articleId: 1,
                        updateTime: "2019-02-10",
                    },
                    {
                        commitId: 2,
                        content: "哈哈哈好棒啊！",
                        parent: null,
                        username: "朋友君",
                        userId: 1,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                        articleId: 1,
                        updateTime: "2019-02-13",
                    },
                    {
                        commitId: 3,
                        content: "谢谢呀ლ(°◕‵ƹ′◕ლ)~",
                        parent: '朋友君',
                        username: "YuuiD",
                        userId: 1,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                        articleId: 1,
                        updateTime: "2019-02-13",
                    },
                    {
                        commitId: 4,
                        content: "哈哈哈好棒啊！",
                        parent: null,
                        username: "朋友君",
                        userId: 1,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                        articleId: 1,
                        updateTime: "2019-02-13",
                    },
                    {
                        commitId: 5,
                        content: "哈哈哈好棒啊！",
                        parent: null,
                        username: "朋友君",
                        userId: 1,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                        articleId: 1,
                        updateTime: "2019-02-20",
                    },
                    {
                        commitId: 6,
                        content: "哈哈哈好棒啊！",
                        parent: null,
                        username: "朋友君",
                        userId: 1,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                        articleId: 1,
                        updateTime: "2019-02-21",
                    },
                    {
                        commitId: 7,
                        content: "哈哈我也觉得超级棒，大大加油！",
                        parent: '朋友君',
                        username: "不知名的人",
                        userId: 1,
                        userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550474798008&di=6746e912bf978310fe8ebcd13d9cbbeb&imgtype=0&src=http%3A%2F%2Fpic27.nipic.com%2F20130219%2F4499633_210442814002_2.jpg',
                        articleId: 1,
                        updateTime: "2019-02-25",
                    },

                ],
            },
        }
        // this.fetchData = this.fetchData.bind(this)
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '评论',
        headerTintColor: '#b2b2b2',
        headerTitleStyle: { // android 居中
            flex: 1,
            // textAlign: 'center',
            fontSize: 18,
        }
    });

    componentDidMount() {
        this.fetchData();
    }
    fetchData = () => {
        fetch('https://api.douban.com/v2/movie/in_theaters')
            .then((response) => {
                this.setState({ refreshing: false });
                return response.json();
            }).then((responseText) => {
                // let arrData = responseText.subjects;
                // let arrList = [];
                // arrData.map((item, index) => {
                //     arrList.push({ key: index.toString(), value: item });
                // })
                this.setState({ ready: false, refreshing: false });
            }).catch((error) => {
                console.error(error);
            });
    }
    refreshData = () => {
        this.setState({ refreshing: true });
        this.fetchData();
    }
    //   filterCount = (count) => count > 10000 ? (count / 10000).toFixed(1) + '万' : count

    keyExtractor = (item, index) => index.toString();

    submitContent = () => {
        config.getUser().then(user => {
            if (user.userId) {
                let body = {
                    userId: user.userId,
                    articleId: this.state.articleId,
                    username: user.username,
                    title: this.state.title,

                };
                fetch(config.api.URI + '/pinglun/insert', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify(body),
                }).then((response) => {
                    return response.json();
                }).then((responseText) => {
                    this.setState({ see: responseText.result.data.total });
                }).catch((error) => {
                    console.error(error);
                });
            }
        });

    }
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={[styles.likes]}>
                <View style={styles.avatar}>
                    <Avatar rounded source={{ uri: item.userImg }} />
                </View>
                <View style={styles.like}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.username}>{item.parent ? `${item.username}回复了${item.parent} ` : `${item.username}`}</Text>
                        <Text style={styles.updateTime}>{item.updateTime}</Text>
                    </View>
                    <Text style={styles.title}>{item.content}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const { navigate } = this.props.navigation;
        const { params: { item } } = this.props.navigation.state;
        const { commitsData } = this.state;
        return (
            <View style={styles.container}>
                {this.state.ready
                    ? <ActivityIndicator size="large" style={styles.loadding} />
                    : <FlatList
                        keyExtractor={this.keyExtractor}
                        data={commitsData.data}
                        onRefresh={this.refreshData}
                        refreshing={this.state.refreshing}
                        renderItem={this.renderItem}
                        style={{ flex: 1.8 }}
                    />
                }
                <View style={styles.InputStyle}>
                    <Input placeholder={`回复${item.username}:`} style={{ width: width * 0.8 }} />
                    <Button title='发送' type='link' style={{ marginBottom: 10 }} titleStyle={{ color: '#ff7040' }} onPress={this.submitContent} />
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        backgroundColor: '#f2f2f2',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 2,
    },
    loadding: {
        marginTop: 100,
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
        // height: 50,
        flex: 0.2,
        paddingVertical: 20,
    },
    like: {
        flex: 0.8,
    },
    username: {
        color: '#a2a2a2',
        fontSize: 15,
        paddingTop: 5,
        paddingLeft: 5,
        justifyContent: 'flex-start'
    },
    title: {
        color: '#a2a2a2',
        fontSize: 16,
        paddingTop: 5,
        paddingLeft: 5
    },
    updateTime: {
        color: '#d2d2d2',
        fontSize: 12,
        paddingTop: 5,
        paddingLeft: 5,
        justifyContent: 'flex-end'
    },
    InputStyle: {
        flex: 0.1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        paddingTop: 10
    }
})