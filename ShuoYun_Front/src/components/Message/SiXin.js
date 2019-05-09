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

export default class SiXin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            messageData: [
                {
                    id: 1,
                    username: "朋友君",
                    userId: 1,
                    userImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                    articleId: 1,
                    updateTime: "2019-02-13",
                    data: [],
                },
                {
                    id: 2,
                    username: "阿布",
                    userId: 3,
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

    renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.likes]}>
            <View style={styles.avatar}>
                <Avatar rounded source={{ uri: item.userImg }} size='medium' />
            </View>
            <View style={styles.like}>
                <Text style={styles.username}>{`${item.username}赞了我的文章`}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.updateTime}>{item.updateTime}</Text>
            </View>

        </TouchableOpacity>
    )

    render() {
        const { navigate } = this.props.navigation;
        const { likeData } = this.state;
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
                    data={likeData}
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
    likes: {
        width,
        minHeight: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#9999FF',
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
        paddingLeft: 5
    },
    title: {
        color: '#a2a2a2',
        fontSize: 20,
        paddingTop: 5,
        paddingLeft: 5
    },
    updateTime: {
        color: '#f2f2f2',
        fontSize: 12,
        paddingTop: 5,
        paddingLeft: 5
    }
})
