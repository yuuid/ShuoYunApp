import React, { Component } from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  Image,
  StyleSheet,

} from 'react-native';
import { SegmentedView } from 'teaset';
import styleUtil from "../../common/styleUtil";
import NewActivity from './NewActivity';
import HotActivity from './HotActivity';
import ActivityExport from '../Export/ActivityExport';
import config from '../../common/config';
const { width, height } = Dimensions.get('window');

export default class Activity extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    config.getUser().then(user => {

      if (user.userId) {
        this.setState({ user: user });
      } else {
        Toast.info('请登录');
        let resetActiom = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ]
        })
        this.props.navigation.dispatch(resetActiom)
      }
    });
  };

  renderContent = () => {
    const { navigate } = this.props.navigation;
    const { user } = this.state
    return (
      <SegmentedView style={{ flex: 1 }} type='carousel' indicatorLineColor='#FF7040' barStyle={{ height: 60 }}>
        <SegmentedView.Sheet title='线下' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <NewActivity navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title='线上' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <HotActivity navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>
        {user.usertype == 1 && <SegmentedView.Sheet title='发布活动' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <ActivityExport navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>}
      </SegmentedView>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <StatusBar backgroundColor={'#FF7040'} barStyle={'light-content'} /> */}
        {/* <ScrollView> */}
        {this.renderContent()}
        {/* </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleUtil.backgroundColor,
  },
  typeList: {
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginTop: 25,
    flexDirection: 'row',
  },
  typeName: {
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 25,
    flexDirection: 'row',
    marginTop: 5,
  },
  typeNameText: {
    fontSize: 12,
  },
  hotActivity: {
    paddingHorizontal: 10,
  }
})