import { Dimensions, View } from 'react-native';
import React, { Component } from 'react';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import TuiJian from './TuiJian';
import ZhuanTi from './ZhuanTi';
import SearchInput from './SearchList';

const { width, height } = Dimensions.get('window');

export default class Find extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={{ width: width, height: height, paddingTop: 25, backgroundColor: '#fff' }}>
        <SearchInput
          // city={true}
          navigation={this.props.navigation}
        />
        <ScrollableTabView
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
          <View tabLabel='推荐' style={{ marginBottom: 50 }}>
            <TuiJian navigation={this.props.navigation} />
          </View>
          <View tabLabel='专题' style={{ marginBottom: 50 }}>
            <ZhuanTi navigation={this.props.navigation} />
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}
