import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import styleUtil from "../../common/styleUtil";
import { Icon, Avatar, Text } from 'react-native-elements';
import { Toast, Overlay, Label, Button, ListRow } from 'teaset';
// import Swipeout from 'react-native-swipeout';
import config from '../../common/config';
// import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

export default class DetailList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: '#000',
            articleList: [],

        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '',
        headerTintColor: '#b2b2b2',
        headerTitleStyle: { // android 居中
            flex: 1,
            // textAlign: 'center',
            fontSize: 18,
        }
    });

    componentDidMount() {
        this.init();
    }

    init = () => {
        const { params: { id } } = this.props.navigation.state;
        let body = {
            userId: id,
        };
        fetch(config.api.URI + '/getUserArticle', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            return response.json();
        }).then((responseText) => {
            let arrList = [];
            if (responseText.result.code === 200) {
                responseText.result.data && responseText.result.data.forEach((item, index) => {

                    arrList.push({ ...item });
                })
            }
            this.setState({ articleList: arrList });
        }).catch((error) => {
            console.error(error);
        });
    };

    //删除操作
    handleDelete = (item) => {
        //取消关注、移除粉丝、删除文章
        let body = {
            id: item.articleId,
        };
        fetch(config.api.URI + '/deleteArticle', {
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
                Toast.success(responseText.result.msg);
                this.init();
            } else {
                Toast.fail(responseText.result.msg);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    keyExtractor = (item, index) => index.toString();


    renderItem = ({ item }) => {
        var overlayView = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <View style={{ backgroundColor: '#fff', minWidth: 260, minHeight: 180, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Label type='title' text='确定要删除该文章吗？' />
                    <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Button title='取消' onPress={() => { Overlay.hide(overlayView) }} />
                        <Button title='确定' type='danger' style={{ marginLeft: 20 }} onPress={() => { this.handleDelete(item); Overlay.hide(overlayView) }} />
                    </View>
                </View>
            </Overlay.PopView>
        );
        return (
            // <TouchableOpacity style={[styles.likes]}>
            // <Swipeout right={swipeoutBtns} style={[styles.likes]}>
            //     <View style={styles.like}>
            //         <View style={{ flexDirection: 'column' }}>
            //             {/* <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            //                     <View style={styles.avatar}>
            //                         <Avatar rounded source={{ uri: item.userImg }} size='medium' />
            //                         <Text style={styles.username}>{item.username}</Text>
            //                     </View>
            //                     <View style={{ justifyContent: 'flex-end' }}>
            //                         <Button title='删除' type='danger' style={{ marginBottom: 20 }} />
            //                     </View>
            //                 </View> */}
            //             <Text style={styles.title}>{item.title}</Text>
            //             <Text style={styles.content}>{`${item.content.slice(0, 36)}...`}</Text>
            //             <Text style={styles.updateTime}>{item.updatetime}</Text>
            //         </View>

            //     </View>
            // </Swipeout>
            // </TouchableOpacity>
            <ListRow
                title={<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold' }}>{item.title}</Text>
                <Button title={item.isCheck == 1 ? '已审核' : '待审核'} type={item.isCheck == 1 ? 'primary' : 'danger'} size='sm' />
                </View>}
                titlePlace='top'
                detail={`${item.content.slice(0, 40)}...`}
                swipeActions={[
                    <ListRow.SwipeActionButton title='取消' />,
                    <ListRow.SwipeActionButton title='删除' type='danger' onPress={() => Overlay.show(overlayView)} />,
                ]}
            />
        )

    }


    render() {
        const { navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        const { articleList } = this.state

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ paddingTop: 5 }}>
                        {this.state.ready
                            ? <ActivityIndicator size="large" style={styles.loadding} />
                            : <FlatList
                                keyExtractor={this.keyExtractor}
                                data={articleList}
                                onRefresh={this.refreshData}
                                refreshing={this.state.refreshing}
                                renderItem={this.renderItem}
                            />}

                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>到底啦</Text>
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
        // flex: 0.2,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    like: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    username: {
        color: '#a2a2a2',
        fontSize: 15,
        paddingTop: 8,
        paddingLeft: 5
    },
    title: {
        // color: '#000',
        fontSize: 20,
        paddingTop: 5,
        paddingLeft: 5,
        fontWeight: 'bold',
    },
    content: {
        color: '#a2a2a2',
        fontSize: 14,
        paddingTop: 5,
        paddingLeft: 5
    },
    updateTime: {
        color: '#d2d2d2',
        fontSize: 12,
        paddingTop: 5,
        paddingLeft: 5
    }
})
