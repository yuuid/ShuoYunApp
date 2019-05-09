import React, { Component } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,

} from 'react-native';
import { SegmentedView } from 'teaset';
import styleUtil from "../../common/styleUtil";
import DingYue from './DingYue';
import HuoDong from './HuoDong';
import Palace from './Palace';

const { width, height } = Dimensions.get('window');

export default class GuanZhu extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  renderContent = () => {
    const { navigate } = this.props.navigation;
    return (
      <SegmentedView style={{ flex: 1 }} type='carousel' indicatorLineColor='#FF7040' barStyle={{ height: 60 }}>
        {/* <SegmentedView.Sheet title='广场' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <Palace navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet> */}
        <SegmentedView.Sheet title='订阅' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <DingYue navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>
        <SegmentedView.Sheet title='活动' activeTitleStyle={{ color: '#FF7040', fontSize: 16 }}>
          <View style={{ flex: 1 }}>
            <HuoDong navigation={this.props.navigation} />
          </View>
        </SegmentedView.Sheet>
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