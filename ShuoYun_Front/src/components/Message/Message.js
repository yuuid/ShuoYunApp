import { Dimensions, View } from 'react-native';
import React, { Component } from 'react';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { SegmentedView } from 'teaset';
import PingLun from './PingLun';
import DianZan from './DianZan';
import SiXin from './SiXin';
import config from '../../common/config';

const { width, height } = Dimensions.get('window');

export default class ShouYe extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      nowUser: {},
      newMessage: 0,
    }
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
      fetch(config.api.URI + '/message/getUserMessageCount', {
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
        this.setState({ newMessage: responseText.result.data.total });
      }).catch((error) => {
        console.error(error);
      });
    })
  }
  render() {
    if (this.state.newMessage == 0) {
      return (
        <SegmentedView style={{ flex: 1 }} type='carousel' indicatorLineColor='#FF7040' barStyle={{ height: 60 }}>
          <SegmentedView.Sheet title='评论' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
            <View style={{ flex: 1 }}>
              <PingLun navigation={this.props.navigation} />
            </View>
          </SegmentedView.Sheet>
          <SegmentedView.Sheet title='系统' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
            <View style={{ flex: 1 }}>
              <DianZan navigation={this.props.navigation} />
            </View>
          </SegmentedView.Sheet>
        </SegmentedView>
      );
    }
    return (
      <SegmentedView style={{ flex: 1 }} type='carousel' indicatorLineColor='#FF7040' barStyle={{ height: 60 }}>
        <SegmentedView.Sheet title='评论' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <PingLun navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title='系统' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }} badge={this.state.newMessage}>
          <View style={{ flex: 1 }}>
            <DianZan navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>
      </SegmentedView>
    );
  }
}
