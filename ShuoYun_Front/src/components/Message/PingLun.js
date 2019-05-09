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

// import Icon from 'react-native-vector-icons/SimpleLineIcons';

const { width, height } = Dimensions.get('window');

export default class PingLun extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            commit: [
                {
                    id: 1,
                    username: "朋友君",
                    content: "这样子呢？",
                    userId: 1,
                    userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                    articleId: 1,
                    title: "这里这里那里那里",
                    updateTime: "2019-02-13",
                    // data: [],
                },
                {
                    id: 2,
                    username: "小朋友君",
                    content: "谢谢！非常有帮助了，写的真好！",
                    userId: 4,
                    userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652399762&di=7e1d16166489156b44c5fb50cfdc7946&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201412%2F09%2F20141209162618_zHHaS.jpeg',
                    articleId: 1,
                    title: "大神来袭",
                    updateTime: "2019-02-10",
                    // data: [],
                }
            ],
        }
        // this.fetchData = this.fetchData.bind(this)
    }

    //   componentDidMount() {
    //     this.fetchData();
    //   }
    // fetchData = () => {
    //     fetch('https://api.douban.com/v2/movie/in_theaters')
    //         .then((response) => {
    //             this.setState({ refreshing: false });
    //             return response.json();
    //         }).then((responseText) => {
    //             let arrData = responseText.subjects;
    //             let arrList = [];
    //             arrData.map((item, index) => {
    //                 arrList.push({ key: index.toString(), value: item });
    //             })
    //             this.setState({ ready: false, refreshing: false });
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    // }
    // refreshData = () => {
    //     this.setState({ refreshing: true });
    //     this.fetchData();
    // }
    //   filterCount = (count) => count > 10000 ? (count / 10000).toFixed(1) + '万' : count

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => {
        const { navigate } = this.props.navigation;
        return (
            <TouchableOpacity style={[styles.commits]} onPress={() => navigate('PingLunDetail', { item })}>
                <View style={styles.header}>
                    <View style={{ justifyContent: 'flex-start', flexDirection: 'row' }}>
                        <Avatar rounded source={{ uri: item.userImg }} />
                        <Text style={styles.username}>{item.username}</Text>
                    </View>
                    <Text style={styles.updateTime}>{item.updateTime}</Text>
                </View>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>{item.content}</Text>
                <View style={styles.title} onPress={() => navigate('Detail', { id: item.id })}>
                    <Text style={{ fontSize: 16, marginTop: 5, paddingHorizontal: 5 }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )

    }

    render() {
        const { navigate } = this.props.navigation;
        const { commit } = this.state;
        return (
            <View style={{ paddingTop: 5, backgroundColor: '#f2f2f2' }}>
                {/* {this.state.ready
          ? <ActivityIndicator size="large" style={styles.loadding} />
          : <FlatList
                    keyExtractor={this.keyExtractor}
                    data={commits}
                    onRefresh={this.refreshData}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderItem}
                />} */}
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={commit}
                    onRefresh={this.refreshData}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderItem}
                />
            </View>
        );

    }
}

const styles = StyleSheet.create({
    loadding: {
        marginTop: 100,
    },
    commits: {
        width,
        minHeight: 120,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        backgroundColor: '#fff',
        // paddingVertical: 5,
        paddingHorizontal: 10
    },
    header: {
        // height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    title: {
        height: 45,
        borderRadius: 6,
        backgroundColor: '#f2f2f2',
        paddingVertical: 5
    },
    username: {
        color: '#a2a2a2',
        fontSize: 15,
        paddingTop: 5,
        paddingLeft: 5
    },
    updateTime: {
        color: '#a2a2a2',
        fontSize: 15,
        justifyContent: 'flex-end',
        paddingTop: 5
    }
})
