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
import { ListRow, Overlay, Button, Toast, Label } from 'teaset';
import config from '../../common/config';
// import Icon from 'react-native-vector-icons/SimpleLineIcons';

const { width, height } = Dimensions.get('window');

export default class DianZan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowUser: {},
            ready: true,
            refreshing: false,
            list: [],
        }
        // this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount() {
        this.fetchData();
    }
    fetchData = () => {
        config.getUser().then(user => {
            this.setState({ nowUser: user });
            let body = {
                userId: user.userId,
            };
            fetch(config.api.URI + '/message/getUserMessage', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(body),
            }).then((response) => {
                this.setState({ refreshing: false });
                return response.json();
            }).then((responseText) => {
                this.setState({ ready: false, refreshing: false, list: responseText.result.data });
            }).catch((error) => {
                console.error(error);
            });
        })
    }


    refreshData = () => {
        this.setState({ refreshing: true });
        this.fetchData();
    }
    //   filterCount = (count) => count > 10000 ? (count / 10000).toFixed(1) + '万' : count

    //删除操作
    handleDelete = (item) => {
        //取消关注、移除粉丝、删除文章
        let body = {
            id: item.articleId,
        };
        fetch(config.api.URI + '/message/deleteMessage', {
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
                // this.init();
                this.fetchData();
            } else {
                Toast.fail(responseText.result.msg);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    keyExtractor = (item, index) => index.toString();

    setIsRead = (item) => {
        if (item.isread == 0) {
            let body = {
                idmessage: item.idmessage,
            };
            fetch(config.api.URI + '/message/setisread', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(body),
            }).then((response) => {
                return response.json();
            }).then((responseText) => {
                if(responseText.result.code == 200){
                    this.fetchData();
                }

            }).catch((error) => {
                console.error(error);
            });
        }

    }

    renderItem = ({ item }) => {
        // var overlayView = (
        //     <Overlay.PopView
        //         style={{ alignItems: 'center', justifyContent: 'center' }}
        //     >
        //         <View style={{ backgroundColor: '#fff', minWidth: 260, minHeight: 180, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
        //             <Label type='title' text='确定要删除该文章吗？' />
        //             <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-around' }}>
        //                 <Button title='取消' onPress={() => { Overlay.hide(overlayView) }} />
        //                 <Button title='确定' type='danger' style={{ marginLeft: 20 }} onPress={() => { this.handleDelete(item); Overlay.hide(overlayView) }} />
        //             </View>
        //         </View>
        //     </Overlay.PopView>
        // );
        return (
            <ListRow
                title={item.title.length > 10 ? `${item.title.slice(0, 10)}...` : item.title}
                titleStyle={{ fontSize: 18, color: '#333', fontWeight: 'bold' }}
                // titlePlace='top'
                detail={item.content}
                // swipeActions={[
                //     <ListRow.SwipeActionButton title='取消' />,
                //     <ListRow.SwipeActionButton title='删除' type='danger' onPress={() => Overlay.show(overlayView)} />,
                // ]}
                icon={item.isread == 0 ? require('../../assets/icons/new.png') : require('../../assets/icons/old.png')}
                accessory={'none'}
                onPress={() => this.setIsRead(item)}
            />
        )
    }

    render() {
        const { navigate } = this.props.navigation;
        const { list } = this.state;
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
                    data={list}
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
        paddingLeft: 5
    },
    title: {
        color: '#a2a2a2',
        fontSize: 20,
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