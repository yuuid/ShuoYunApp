import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import config from '../../common/config';
import { StackActions, NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
// import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

class StartPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFocus: 0,
      isLogined: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  componentDidMount() {
    //是否登录过
    config.getUser().then(user => {
      if (user.userId) {
        // this.setState({ isLogined: true })
        let resetActiom = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home' })
          ]
        })
        this.props.navigation.dispatch(resetActiom)
      }
    })
  }




  render() {
    const { isFocus } = this.state
    const { navigate } = this.props.navigation;
    // const { navigatenavigate } = this.props.navigation;    
    return (
      <View style={styles.container}>

        <View style={styles.title}>
          <Text style={{ fontSize: 36, color: '#ff7040', paddingBottom: 30 }}>
            创作
          </Text>
          <Text style={{ fontSize: 30, color: '#ff7040', paddingBottom: 30 }}>
            |
          </Text>
          <Text style={{ fontSize: 36, color: '#ff7040', paddingBottom: 30 }}>
            分享
          </Text>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.loginButton]}
            onPress={() => {
              navigate('Login');
            }}
          >
            <Text style={styles.loginText}>登录</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.registerButton]}
            onPress={() => {

              navigate('Register');
            }}
          >
            <Text style={styles.registerText}>注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.8,
    paddingHorizontal: 20,
  },
  btns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.9,
    paddingHorizontal: 20,
  },
  loginButton: {
    height: 50,
    width: 130,
    borderRadius: 28,
    backgroundColor: '#FF7040',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  registerButton: {
    height: 50,
    width: 130,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FF7040',
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
  },
  registerText: {
    color: '#FF7040',
    textAlign: 'center',
  }
})

const mapStateToProps = state => ({
  state
})

const mapDispatchToProps = dispatch => ({
  //   login: (payload) => dispatch(doLogin(payload))
})

export default StartPage
