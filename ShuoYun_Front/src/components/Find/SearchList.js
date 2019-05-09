import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
}
  from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements'

export default class SearchInput extends Component {
  static defaultProps = {
    city: true
  }
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.header}>

        <TouchableOpacity style={styles.search} onPress={() => navigate('Search')}>
          <Icon name="search" type='feather' size={15} color="#8B8B8B" />
          <Text style={{
            textAlign: 'center',
            lineHeight: 30,
            color: '#8B8B8B'
          }}>文章/作者/专题</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    backgroundColor: '#FF7040',
  },
  search: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#FFF',
    flex: 5,
    height: 40,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
