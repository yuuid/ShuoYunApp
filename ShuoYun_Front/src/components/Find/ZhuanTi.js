import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/SimpleLineIcons'

const { width, height } = Dimensions.get('window');
let index = 1
export default class ZhuanTi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            refreshing: false,
            myData: [
                {
                    tagId: 1,
                    tagName: '时尚',
                    total: 285,
                    isGuanZhu: false,
                    tagImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652353726&di=40b0d26d8335ca059d84594dcc7d9e0c&imgtype=0&src=http%3A%2F%2Fp2.gexing.com%2FG1%2FM00%2F10%2F7E%2FrBACE1Z_Zj7BujhSAAA6GsNQjOc871.jpg',
                },
                {
                    tagId: 2,
                    tagName: '明星',
                    total: 33,
                    isGuanZhu: false,
                    tagImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652399762&di=7e1d16166489156b44c5fb50cfdc7946&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201412%2F09%2F20141209162618_zHHaS.jpeg',
                },
                {
                    tagId: 3,
                    tagName: '抽卡',
                    total: 56,
                    isGuanZhu: true,
                    tagImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1549652399762&di=7e1d16166489156b44c5fb50cfdc7946&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201412%2F09%2F20141209162618_zHHaS.jpeg',
                },
            ],
        }
        // this.fetchData = this.fetchData.bind(this)
    }

    componentDidMount() {
        this.fetchData();
    }
    fetchData = () => {
        fetch('https://api.douban.com/v2/movie/in_theaters')
            .then((response) => {
                this.setState({ refreshing: false });
                return response.json();
            }).then((responseText) => {
                let arrData = responseText.subjects;
                let arrList = [];
                arrData.map((item, index) => {
                    arrList.push({ key: index.toString(), value: item });
                })
                this.setState({ ready: false, refreshing: false });
            }).catch((error) => {
                console.error(error);
            });
    }
    refreshData = () => {
        this.setState({ refreshing: true });
        this.fetchData();
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.taglist]}
        >
            <ListItem
                title={item.tagName}
                leftAvatar={{ source: { uri: item.tagImg } }}
                rightElement={
                    item.isGuanZhu ? <Button buttonStyle={styles.guanzhubtn} type='outline' title="已关注" />
                     : <Button buttonStyle={styles.guanzhubtn} type='outline' title="关注" />
                }
            // rightIcon={<Icon name="angle-right" size={15} color="#9999ff" type="font-awesome" />}
            />
        </TouchableOpacity>
    )

    render() {
        const { navigate } = this.props.navigation;
        const { myData } = this.state;
        return (
            <View style={{ paddingBottom: 50, height, backgroundColor: '#f2f2f2' }}>
                <ScrollView>
                    {this.state.ready
                        ? <ActivityIndicator size="large" style={styles.loadding} color='#9999FF' />
                        : <FlatList
                            keyExtractor={this.keyExtractor}
                            data={myData}
                            renderItem={this.renderItem}
                            onRefresh={this.refreshData}
                            refreshing={this.state.refreshing}
                        />}
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={myData}
                        renderItem={this.renderItem}

                    />
                </ScrollView>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    loadding: {
        marginTop: 100,
    },
    taglist: {
        // height: 60,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        backgroundColor: '#fff',


    },
    lastList: {
        borderBottomWidth: 0,
    },

    left: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    guanzhubtn: {
        height: 30,
        width: 65,
    },
    gztext: {
        color: 'white',
        textAlign: 'center',

        // paddingVertical: 8,
    }
})