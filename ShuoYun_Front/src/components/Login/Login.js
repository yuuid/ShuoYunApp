import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    TextInput,
    Platform,
    StatusBar
} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { Button, Toast } from 'teaset';
import styleUtil from "../../common/styleUtil";
import config from "../../common/config";
import { StackActions, NavigationActions } from 'react-navigation';

// import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFocus: 0,
            username: '',
            password: '',
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '登录',
        headerTintColor: '#fff',
        headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            fontSize: 16,
            paddingRight: 40,

        },
        headerStyle: {
            backgroundColor: '#FF7040',

        }

    });

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow() {
        // alert('Keyboard Shown');
    }
    _keyboardDidHide() {
        // alert('Keyboard Hidden');
    }

    //登录
    _login = () => {
        const { navigate } = this.props.navigation;
        // let deviceInfo = this.getDeviceInfo();
        let body = {
            mobile: this.state.username,
            password: this.state.password,
            // ...deviceInfo
        };

        // toast.modalLoading();

        fetch(config.api.URI + '/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            this.setState({ isLogin: true });
            return response.json();
        }).then((responseText) => {
            if (responseText.result.code === 200) {
                Toast.success('登录成功');
                config.setUser(responseText.result.data);
                config.setIsLogined();
                let resetActiom = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' })
                    ]
                })
                this.props.navigation.dispatch(resetActiom)
            } else {
                Toast.fail(responseText.result.msg);
            }

        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        const { isFocus } = this.state
        const { navigate, goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'#FF7040'} barStyle={'light-content'} />
                <View style={styles.inputText}>
                    {/* <View> */}
                        <Input
                            leftIcon={<Icon name='telephone' type='foundation' size={18} color='#d2d2d2' />}
                            style={{ width }}
                            value={this.state.username}
                            placeholder='手机号'
                            selectionColor='#ff7040'
                            onChangeText={text => this.setState({ username: text })}
                            keyboardType='numeric'
                        />
                    {/* </View> */}
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Input
                            leftIcon={<Icon name='lock' size={18} color='#d2d2d2' />}
                            style={{ width, marginTop: 20 }}
                            value={this.state.password}
                            placeholder='密码'
                            selectionColor='#ff7040'
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ password: text })}
                        />
                    </View>
                </View>
                <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                    <Text style={{ color: '#979797', fontSize: 12 }} onPress={() => navigate('Register')}>注册账号</Text>
                    <Text style={{ color: '#979797', fontSize: 12 }}>忘记密码</Text>
                </View>
                <View style={styles.btns}>

                    <TouchableOpacity activeOpacity={0.9}
                        underlayColor={'#FFF'}
                        style={[styles.loginButton]}
                        onPress={this._login}
                    >

                        <Text style={styles.loginText}>登录</Text>
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
        backgroundColor: styleUtil.backgroundColor,
    },
    inputText: {
        width,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
    },
    btns: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width,
        paddingTop: 50,
    },
    loginButton: {
        height: 45,
        width: width * 0.9,
        borderRadius: 26,
        backgroundColor: '#FF7040',
        // overflow: 'hidden',
    },
    loginText: {
        color: 'white',
        textAlign: 'center',
        paddingVertical: 11,
        fontSize: 14
    },

})

const mapStateToProps = state => ({
    state
})

const mapDispatchToProps = dispatch => ({
    //   login: (payload) => dispatch(doLogin(payload))
})


