import React, { Component } from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Carousel } from 'teaset';
import { Tile, Divider, Icon, Avatar } from 'react-native-elements';
import { ListRow, Button } from 'teaset'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import SearchInput from './Find/SearchList';
import styleUtil from "../common/styleUtil";
import config from '../common/config';

const { width, height } = Dimensions.get('window');

export default class ShouYe extends Component {

  // static navigationOptions = {
  //   header: null
  // };
  static navigationOptions = ({ navigation }) => ({
    headerTitle: '说云文学社',
    headerTintColor: '#ff7040',
    headerTitleStyle: { // android 居中
      flex: 1,
      // textAlign: 'center',
      fontSize: 18,
      color: '#ff7040'
    },
    headerRight: (
      <Icon
        onPress={() => navigation.navigate('Search')}
        type="feather"
        name="search"
        color="#ff7040"
        containerStyle={{ paddingRight: 20 }}
      />
    ),

  });


  constructor(props) {
    super(props);
    this.state = {
      // todaytalk: [
      //   {
      //     title: '什么回忆让你珍藏至今？',
      //     total: 25,
      //   },
      //   {
      //     title: '今天的你认真听过一节课吗？',
      //     total: 15,
      //   }
      // ],
      todaytalk: [],
      todaybook: {
        title: '今日暂无',
        content: '今日暂无...'
      },
      lastestActivity: {},
      // todaybook: {
      //   title: '平凡的世界',
      //   content: '用温暖的现实主义的方式来讴歌普通劳动者',
      //   bookimg: '',
      // },
      articleList: [],
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    config.getUser().then(user => {
      // this.setState({ nowUser: user });
      if (user.userId) {
        // let body = {
        //     huatiId: detail.huatiId,
        // };
        let arrList = [];
        let arrList2 = [];
        // let arrList3 = {};

        //话题
        fetch(config.api.URI + '/huati/getToday', {
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
              arrList.push({ ...item });
            })
          }
          this.setState({ todaytalk: arrList, ready: false });
        }).catch((error) => {
          console.error(error);
        });

        //优文
        fetch(config.api.URI + '/getTopArticle', {
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
              arrList2.push({ ...item });
            })
          }
          this.setState({ articleList: arrList2, ready: false });
        }).catch((error) => {
          console.error(error);
        });

        //书屋
        fetch(config.api.URI + '/getBookHouse', {
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
            if (responseText.result.data)
              this.setState({ todaybook: responseText.result.data, ready: false });
          }

        }).catch((error) => {
          console.error(error);
        });

        //最新活动
        fetch(config.api.URI + '/activity/lastestActivity', {
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
            if (responseText.result.data)
              this.setState({ lastestActivity: responseText.result.data, ready: false });
          }

        }).catch((error) => {
          console.error(error);
        });
      } else {
        Toast.fail('用户未登陆');
        this.setState({ todaybook: {}, ready: false });
      }


    });

  }

  renderContent = () => {
    const { navigate } = this.props.navigation;
    const { todaybook, todaytalk, articleList, lastestActivity } = this.state;
    return (
      <View style={{ flexDirection: 'column', minHeight: height }}>
        {/* <SearchInput navigation={this.props.navigation} /> */}
        <Carousel style={{ height: 180 }} >
          <TouchableOpacity onPress={() => { navigate('HuiGu') }} activeOpacity={0.9}>
            <Image style={{ width, height: 180 }} resizeMode='cover' source={require('../assets/image/banner1.png')} />
          </TouchableOpacity>
          <Image style={{ width, height: 180 }} resizeMode='cover' source={require('../assets/image/banner3.png')} />
        </Carousel>
        <View style={styles.typeBox}>
          <View style={styles.typeList}>
            <TouchableOpacity onPress={() => { navigate('Palace') }} activeOpacity={0.9}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/yiwen2.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigate('Book') }} activeOpacity={0.9}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/yishu2.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigate('HuaTi') }} activeOpacity={0.9}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/xinhuo2.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigate('ChuangWen') }} activeOpacity={0.9}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/chuangwen2.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigate('HuiGu') }} activeOpacity={0.9}>
              <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/huishou2.png')} />
            </TouchableOpacity>

          </View>
          {/* <Palace navigation={this.props.navigation} /> */}

          <View style={styles.typeName}>
            <Text style={styles.typeNameText}>一文</Text>
            <Text style={styles.typeNameText}>一书</Text>
            <Text style={styles.typeNameText}>一说</Text>
            <Text style={styles.typeNameText}>创文</Text>
            <Text style={styles.typeNameText}>回首</Text>
          </View>
        </View>
        <View style={styles.todaytalk}>

          <View style={{ marginVertical: 10, flexDirection: 'column', justifyContent: 'center' }}>
            {/* <Icon type='feather' name='feather' size={10} /> */}
            <Text style={{ color: '#ff7040', textAlign: 'center' }}>今日说</Text>
            <Divider style={{ backgroundColor: '#ff7040', marginTop: 3, width: 48, height: 1.5, marginLeft: width * 0.39 }} />
          </View>
          {todaytalk.length > 0 && todaytalk.map((element, i) => {
            if (i % 2 == 0) {
              return (
                <TouchableOpacity activeOpacity={0.9} onPress={() => { navigate('HuaTiDetail', { detail: element }) }} key={element.huatiId}>
                  <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 10, height: 40 }} >
                    <View style={{ flexDirection: 'column', height: 40 }}>
                      <Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold' }}>{element.title}</Text>
                      <Text style={{ fontSize: 12, color: '#797979', marginTop: 10 }}>已有{<Text style={{ fontSize: 12, color: '#ff7040' }}>15</Text>}人讨论</Text>
                    </View>
                  </View>
                  <Divider style={{ backgroundColor: '#797979', marginVertical: 10 }} />
                </TouchableOpacity>
              )
            }
            return (
              <TouchableOpacity key={element.huatiId} activeOpacity={0.9} onPress={() => { navigate('HuaTiDetail', { detail: element }) }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 10, height: 40 }}>
                  <View style={{ flexDirection: 'column', height: 40 }}>
                    <Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold' }}>{element.title}</Text>
                    <Text style={{ fontSize: 12, color: '#797979', marginTop: 10 }}>已有{<Text style={{ fontSize: 12, color: '#ff4040' }}>25</Text>}人讨论</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}

        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={() => { navigate('ActivityDetail', { detail: lastestActivity }) }}>
          <View style={[styles.todaybook, { height: 'auto' }]}>
            <View style={{ marginVertical: 10, flexDirection: 'column', justifyContent: 'center' }}>

              <Text style={{ color: '#ff7040', textAlign: 'center' }}>最新活动</Text>
              <Divider style={{ backgroundColor: '#ff7040', marginTop: 3, width: 53, height: 1.5, marginLeft: width * 0.37 }} />
            </View>

            <View style={{ flexDirection: 'column' }}>
              <View style={{ marginTop: 10 }}>
                <Image source={{ uri: lastestActivity.imgs } || require('../assets/image/banner3.png')} style={{ width: width * 0.89, height: 200, borderRadius: 3 }} resizeMode='cover' />
              </View>
              <Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold', marginTop: 10 }}>{lastestActivity.title}</Text>
              <Text style={{ color: '#797979', marginBottom: 10 }} numberOfLines={2} ellipsizeMode={'tail'}>{lastestActivity.content}</Text>
              {/* <Text style={{color: '#ff4040'}}>前往了解</Text> */}
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { navigate('Detail', { olddetail: todaybook }) }}>
          <View style={styles.todaybook}>
            <View style={{ marginVertical: 10, flexDirection: 'column', justifyContent: 'center' }}>
              {/* <Icon type='feather' name='feather' size={10} /> */}
              <Text style={{ color: '#ff7040', textAlign: 'center' }}>今日书屋</Text>
              <Divider style={{ backgroundColor: '#ff7040', marginTop: 3, width: 53, height: 1.5, marginLeft: width * 0.37 }} />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 18, color: '#333', fontWeight: 'bold' }}>{todaybook.title}</Text>
              <Text style={styles.content} numberOfLines={2} ellipsizeMode={'tail'}>{todaybook.content}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Image source={{ uri: 'https://wx4.sinaimg.cn/mw690/4ca9b00fgy1g1fdftkw1xj20zk0k0myt.jpg' }} style={{ width: width * 0.89, height: 130, borderRadius: 3 }} resizeMode='cover' />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.goodarticle}>
          <View style={{ marginVertical: 10, flexDirection: 'column', justifyContent: 'center' }}>
            {/* <Icon type='feather' name='feather' size={10} /> */}
            <Text style={{ color: '#ff7040', textAlign: 'center' }}>优文</Text>
            <Divider style={{ backgroundColor: '#ff7040', marginTop: 3, width: 33, height: 1.5, marginLeft: width * 0.4 }} />
          </View>
          {articleList.length > 0 && articleList.map((item, i) => {
            return (
              <TouchableOpacity
                onPress={() => { navigate('Detail', { olddetail: item }) }}
                activeOpacity={0.9}
                key={i}
              >
                <View style={styles.hotList}>
                  <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5 }}>
                    <View style={{
                      flex: 0,
                      flexDirection: 'row',
                      // alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      paddingLeft: 10,
                    }}>
                      <Avatar rounded source={{ uri: item.userImg }} />
                      <Text style={{ marginLeft: 5, marginTop: 5 }}>{item.username}</Text>
                    </View>
                    <View style={{
                      flex: 0,
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      paddingRight: 10
                    }}>
                      <Text style={{ fontSize: 11 }}>{item.updatetime}</Text>
                      <View style={{
                        flex: 0,
                        flexDirection: 'row',
                      }}>
                        <Icon name="eye" type='feather' size={15} color={'#797979'} />
                        <Text style={{ fontSize: 11, marginLeft: 5 }}>{item.pageview}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{
                    flex: 0,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // alignItems: 'left',
                  }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.content} numberOfLines={2} ellipsizeMode={'tail'}>{item.content}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}

        </View>





      </View >
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#FF7040'} barStyle={'light-content'} />
        {/* <ScrollableTabView
          renderTabBar={() => <DefaultTabBar />}
          tabBarUnderlineStyle={{
            backgroundColor: '#9999ff',
            height: 2
          }}
          tabBarBackgroundColor='#FFFFFF'
          tabBarActiveTextColor='#9999ff'
          tabBarInactiveTextColor='#959595'
          tabBarTextStyle={{ fontSize: 14 }}
          locked={false}
        >
          <View tabLabel='关注'>
            <GuanZhu navigation={this.props.navigation} />
          </View>
          <View tabLabel='订阅' style={{ marginBottom: 50 }}>
            <DingYue navigation={this.props.navigation} />
          </View>
        </ScrollableTabView> */}
        <ScrollView>
          {this.renderContent()}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    // backgroundColor: styleUtil.backgroundColor,
  },
  typeBox: {
    backgroundColor: '#fff',
  },
  typeList: {
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginTop: 25,
    flexDirection: 'row',
    // backgroundColor: '#fff',
  },
  typeName: {
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 25,
    flexDirection: 'row',
    marginTop: 5,
    // backgroundColor: '#fff'
  },
  typeNameText: {
    fontSize: 12,
  },
  hotActivity: {
    paddingHorizontal: 10,
  },
  todaytalk: {
    height: 198,
    paddingHorizontal: 10,
    borderColor: '#979797',
    borderRadius: 5,
    borderStyle: 'solid',
    // borderWidth: 1,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 10
  },
  todaybook: {
    height: 270,
    paddingHorizontal: 10,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  goodarticle: {
    // height: 230,
    paddingHorizontal: 10,
    borderColor: '#979797',
    borderRadius: 5,
    borderStyle: 'solid',
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  hotList: {
    // minHeight: 180,
    flexDirection: 'column',
    // justifyContent: 'space-between',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#f2f2f2'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 5,
    color: '#333',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
    color: '#797979',
    lineHeight: 23,
  },
})