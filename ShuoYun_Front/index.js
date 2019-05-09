/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React, { Component } from 'react'
import { AppRegistry, YellowBox } from 'react-native';
// import App from './App';
import App from './src/index';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

class myApp extends Component {

  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (<App />)
  }
}

AppRegistry.registerComponent(appName, () => myApp);
