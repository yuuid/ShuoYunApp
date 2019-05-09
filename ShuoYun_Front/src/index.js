import React, { Component } from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import {
  Easing,
  Animated
} from 'react-native'

// import Icon from "react-native-vector-icons/Ionicons";
import {Icon} from 'react-native-elements'
// import {TabView, NavigationBar} from 'teaset'
import ChuangWen from './components/ArticleList';
import HuiGu from './components/Activity/HuiShou';
import ShouYe from './components/ShouYe';
import GuanZhu from './components/Home/DingYue';
// import Find from './components/Find/Find';
import Export from './components/Export/FaBiao';
import Mail from './components/Message/Message';
import Mine from './components/User/UserPage';
import StartPage from './components/Login/StartPage';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Search from './components/Find/Search';
import DetailList from './components/User/DetailList';
import UserList from './components/User/UserList';
import UserSetting from './components/User/UserSetting';
import PingLunDetail from './components/Message/PingLunDetail';
import Detail from './components/Detail';
import Activity from './components/Activity/activity';
import ActivityDetail from './components/Activity/ActivityDetail';
import GuanYu from './components/User/GuanYu';
import Palace from './components/Home/Palace';
import Book from './components/Home/Book';
import ZhengWen from './components/Export/Zhengwen';
import HuaTiDetail from './components/HuaTiDetail';
import HuaTiExport from './components/Export/HuaTiExport';
import HuaTi from './components/Home/HuaTi';
import AllUsers from './components/User/AllUser';
import ShenHe from './components/User/ShenHe';
import HuaTiArticle from './components/Export/HuaTiArticleExport';


const BottomTab = createBottomTabNavigator({
  ShouYun: {
    screen: ShouYe,
    navigationOptions: {
      tabBarLabel: '首页',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" type='feather' size={20} color={tintColor} />
      ),
    },
  },
  Seek: {
    screen: GuanZhu,
    navigationOptions: {
      tabBarLabel: '关注',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="eye" type='feather' size={20} color={tintColor} />
      ),
    },
    
  },
  Export: {
    screen: Export,
    navigationOptions: {
      tabBarLabel: '创作',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="edit-3" type='feather' size={20} color={tintColor} />
      ),
    },
    
  },
  Message: {
    screen: Activity,
    navigationOptions: {
      tabBarLabel: '活动',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="globe" type='feather' size={20} color={tintColor} />
      ),
    },
  },
  Mine: {
    screen: Mine,
    navigationOptions: {
    
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="user" type='feather' size={20} color={tintColor} />
      ),
    },
  }
},
{
    tabBarOptions: {
      activeTintColor: '#FF7040',
      inactiveTintColor: '#979797',
      labelStyle: {
        fontSize: 12,
        marginBottom: 5,
      },
      style: {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        height: 50,
        backgroundColor: '#fff'
      },
    }

});

const MyApp = createStackNavigator({
  StartPage,
  Home: {
    screen: BottomTab,
    navigationOptions: {
      header: null
    }
  },
  Detail: {
    screen: Detail,
    navigationOptions: {
      header: null
    }
  },
  
  Search,
  StartPage,
  DetailList,
  UserList,
  UserSetting,
  PingLunDetail,
  Login,
  Register,
  ActivityDetail,
  Mail,
  GuanYu,
  ChuangWen,
  HuiGu,
  Palace,
  Book,
  HuaTi,
  ZhengWen,
  HuaTiDetail,
  HuaTiExport,
  AllUsers,
  ShenHe,
  HuaTiArticle
  // Seek
},
  {
    headerMode: 'screen',
    // headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const width = layout.initWidth;
        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [width, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateX }] };
      },
    }),
  }
);
export default MyApp
