import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import styleUtil from "../../common/styleUtil";
import ImagePicker from 'react-native-image-picker';
import { Icon, Avatar, Text, Overlay, Input, Badge } from 'react-native-elements';
import { ListRow, Button, Toast } from 'teaset';
import config from '../../common/config';
import LinearGradient from 'react-native-linear-gradient';
// import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

export default class UserPage extends Component {

  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      color: '#000',
      user: {},
      see: 0,
      fans: 0,
      articles: 0,
      noreadNum: 0,
      isLogin: false,
      isVisible: false,
    }
    this.init = this.init.bind(this)
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    config.getUser().then(user => {
      if (user.userId) {
        this.countFollow(user);
        this.countArticles(user);
        this.countFans(user);
        this.setState({ user: user, isLogin: true });
        if (user.usertype == 1) {
          this.getNoCheck();
          
        } else {
          this.getNoreadMessage(user);
        }
      }
    });
  };

  //统计关注数
  countFollow = (user) => {
    let body = {
      id: user.userId,
    };
    fetch(config.api.URI + '/countFollow', {
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

  //统计粉丝数
  countFans = (user) => {
    let body = {
      id: user.userId,
    };
    fetch(config.api.URI + '/countFan', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      return response.json();
    }).then((responseText) => {
      this.setState({ fans: responseText.result.data.total });
    }).catch((error) => {
      console.error(error);
    });
  }
  //统计文章数
  countArticles = (user) => {
    let body = {
      id: user.userId,
    };
    fetch(config.api.URI + '/countArticles', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      return response.json();
    }).then((responseText) => {
      this.setState({ articles: responseText.result.data.total });
    }).catch((error) => {
      console.error(error);
    });
  }

  //获取未读消息数
  getNoreadMessage = (user) => {
    let body = {
      userId: user.userId,
    };
    fetch(config.api.URI + '/message/getUserMessageCount', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      return response.json();
    }).then((responseText) => {
      this.setState({ noreadNum: responseText.result.data.total });
    }).catch((error) => {
      console.error(error);
    });
  }

  //获取未审核数
  getNoCheck = () => {
    fetch(config.api.URI + '/message/getNoCheckNum', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).then((response) => {
      return response.json();
    }).then((responseText) => {
      this.setState({ noreadNum: responseText.result.data.total });
    }).catch((error) => {
      console.error(error);
    });
  }

  //选择图片
  selectPhotoTapped() {
    const options = {
      title: '修改头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择照片',
      // customButtons: [
      //   { name: 'fb', title: 'Choose Photo from Facebook' },
      // ],
      cameraType: 'back',
      mediaType: 'photo',
      videoQuality: 'high',
      durationLimit: 10,
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
      angle: 0,
      allowsEditing: false,
      noData: false,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  showOverLay = () => {
    this.setState({ isVisible: true })
  }

  hideOverLay = () => {
    Toast.success('成功提交')
    this.setState({ isVisible: false })
  }



  logout = () => {
    Alert.alert(
      '提示',
      '退出后将不会再接收消息。确认退出登录吗？',
      [
        {
          text: '退出', onPress: () => {
            // request.post(config.api.baseURI + config.api.logout)
            //   .then(res => {
            //     if (res.code === 0) {
            //       config.removeUser();
            //       toast.success('已退出登录');
            //     }
            // })
            config.setIsLogined();
            config.removeUser();
            this.setState({ isLogin: false, user: {}, see: 0, fans: 0, articles: 0 })

          }
        },
        {
          text: '取消', onPress: () => {
          }, style: 'cancel'
        },
      ],
      { cancelable: true }
    )
  };

  signIn = () => {
    const { user } = this.state;
    if (user.usertype != 1) {
      this.showOverLay();
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { user, avatarSource, isLogin, see, fans, articles, noreadNum } = this.state;

    const adminlist = [
      {
        title: '审核',
        detail: noreadNum == 0 ? '暂无' :<Badge status='error' value={noreadNum} />,
        icon: <Icon type='feather' name='message-square' color='#fe88c1' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');
          } else {
            navigate('ShenHe', { id: user.userId })
          }
        }
      },
      {
        title: '所有社员',
        icon: <Icon type='feather' name='star' color='#fecb37' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');
          } else {
            navigate('AllUsers', { id: user.userId, type: '社员' })
          }
        }
      },
      {
        title: '个人设置',
        icon: <Icon type='feather' name='settings' color='#59b6ef' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');

          } else {
            navigate('UserSetting', { user: user })
          }
        }
      },
      {
        title: '关于说云文学社',
        icon: <Icon type='feather' name='info' color='#ff4040' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');

          } else {
            navigate('GuanYu', { user: user })
          }
        }
      },
    ];
    const userlist = [
      {
        title: '消息',
        detail: noreadNum==0 ? '暂无' :<Badge status='error' value={noreadNum} />,
        icon: <Icon type='feather' name='message-square' color='#fe88c1' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');
          } else {
            navigate('Mail', { id: user.userId })
          }
        }
      },
      {
        title: '我的收藏',
        icon: <Icon type='feather' name='star' color='#fecb37' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');
          } else {
            navigate('DetailList', { id: user.userId, type: '我的收藏' })
          }
        }
      },
      {
        title: '个人设置',
        icon: <Icon type='feather' name='settings' color='#59b6ef' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');

          } else {
            navigate('UserSetting', { user: user })
          }
        }
      },
      {
        title: '关于说云文学社',
        icon: <Icon type='feather' name='info' color='#ff4040' size={20} />,
        onPress: () => {
          if (!isLogin) {
            navigate('Login');

          } else {
            navigate('GuanYu', { user: user })
          }
        }
      },
    ];

    const renderContent = () => {
      return (
        <View>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#ff7040', '#ff4d4d']}>
            <ListRow
              style={{ backgroundColor: 'transparent' }}
              title={
                <View style={{
                  flexDirection: 'row',
                  marginLeft: 8,
                  alignItems: 'center',
                  height: 130,
                }}>
                  {isLogin && <Icon
                    name={user.sex === 1 ? 'gender-male' : user.sex === 2 ? 'gender-female' : 'gender-male-female'}
                    type={'material-community'}
                    size={20}
                    color={user.sex === 1 ? '#009ad6' : user.sex === 2 ? '#f391a9' : '#7D26CD'}
                    containerStyle={{ marginRight: 5 }}
                  />}
                  <Text style={{ fontSize: 20, color: '#fff' }}>
                    {user.username ? user.username : '请先登录'}
                  </Text>
                </View>
              }
              titleStyle={{ marginLeft: 10 }}

              icon={
                <Avatar
                  size='large'
                  rounded
                  onPress={this.selectPhotoTapped.bind(this)}
                  source={avatarSource === null ? { uri: user.userImg } : avatarSource}
                />
              }
              detail={
                <Button
                  title={user.usertype == 1 ? '社团认证用户' : '普通用户'}
                  titleStyle={{ color: '#fff', fontSize: 8, opacity: 1.0 }}
                  disabled={user.usertype == 1 ? true : false}
                  style={{
                    backgroundColor: user.usertype == 1 ? styleUtil.disabledColor : styleUtil.themeColor,
                    borderColor: user.usertype == 1 ? styleUtil.disabledColor : styleUtil.themeColor,
                    height: 20,
                    width: 'auto',
                    opacity: 1.0,
                  }}
                  onPress={this.signIn}
                  icon={<Icon type='feather' name='key' size={16} />}
                />
              }
              topSeparator={'none'}
              bottomSeparator={'none'}

            />

            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigate('UserList', { id: user.userId, type: 'follow' })}
                activeOpacity={0.8}>
                <Text style={styles.titleText}>关注</Text>
                <Text style={{ color: '#fff' }}>{see}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigate('UserList', { id: user.userId, type: 'fans' })}
                activeOpacity={0.8}>
                <Text style={styles.titleText}>粉丝</Text>
                <Text style={{ color: '#fff' }}>{fans}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigate('DetailList', { id: user.userId, type: '文章' })}
                activeOpacity={0.8}>
                <Text style={styles.titleText}>文章</Text>
                <Text style={{ color: '#fff' }}>{articles}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={{ marginTop: 20 }}>
            {user.usertype == 1 ? adminlist.map((v, i, arr) => (
              <ListRow
                key={i}
                title={v.title}
                detail={v.detail || null}
                onPress={v.onPress}
                icon={v.icon}
                topSeparator={i === 0 ? 'full' : 'none'}
                bottomSeparator={i + 1 === arr.length ? 'full' : 'indent'}
              />
            )) : userlist.map((v, i, arr) => (
              <ListRow
                key={i}
                title={v.title}
                onPress={v.onPress}
                icon={v.icon}
                topSeparator={i === 0 ? 'full' : 'none'}
                bottomSeparator={i + 1 === arr.length ? 'full' : 'indent'}
              />
            ))
            }
          </View>
          {
            isLogin ?
              <View style={{ marginTop: 20, marginBottom: 10 }}>
                <ListRow
                  title={'退出登录'}
                  titleStyle={styles.logoutText}
                  onPress={this.logout}
                  accessory={'none'}
                  topSeparator={'full'}
                  bottomSeparator={'full'}
                />
              </View>
              : <View style={{ marginTop: 20, marginBottom: 10 }}>
                <ListRow
                  title={'登录'}
                  titleStyle={styles.logoutText}
                  onPress={() => navigate('Login')}
                  accessory={'none'}
                  topSeparator={'full'}
                  bottomSeparator={'full'}
                />
              </View>
          }
          <Overlay
            isVisible={this.state.isVisible}
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            onBackdropPress={() => this.setState({ isVisible: false })}
            width={width * 0.7}
            height='auto'

          >
            <View>
              <Text style={{ textAlign: 'center', fontSize: 18, color: '#333' }}>认证为社团用户</Text>
              <Text style={{ textAlign: 'center', color: '#797979', fontSize: 10 }}>提交后会在2天内发送审核结果</Text>
              <Input
                leftIcon={<Icon name='bookmark' type='feather' size={18} color='#d2d2d2' />}
                style={{ width }}
                placeholder='社团名'
                style={{ fontSize: 14 }}
                selectionColor='#ff7040'
                onChangeText={text => this.setState({ stName: text })}
              />
              <Input
                leftIcon={<Icon name='feather' type='feather' size={18} color='#d2d2d2' />}
                style={{ width }}
                placeholder='社长真实姓名'
                style={{ fontSize: 14 }}
                selectionColor='#ff7040'
                onChangeText={text => this.setState({ szName: text })}
              />
              <Input
                leftIcon={<Icon name='phone' type='feather' size={18} color='#d2d2d2' />}
                style={{ width }}
                placeholder='联系方式'
                selectionColor='#ff7040'
                keyboardType='numeric'
                onChangeText={text => this.setState({ telephone: text })}
                style={{ fontSize: 14 }}
              />
              <Button
                title='提交'
                titleStyle={{ color: '#fff' }}
                style={{ backgroundColor: '#ff4040', borderColor: 'transparent', marginTop: 10 }}
                onPress={this.hideOverLay}
              />
            </View>
          </Overlay>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#333333'} barStyle={'light-content'} />
        <ScrollView>
          {renderContent()}
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
  itemContainer: {
    flex: 1,
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#9999ff',
    height: 80,
  },
  avatarContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 15
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 8
  },
  logoutText: {
    color: 'red',
    textAlign: 'center'
  },
  titleText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
})
