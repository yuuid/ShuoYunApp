import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Keyboard,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
// import Icon from "react-native-vector-icons/Ionicons";
import { Icon, Input, Avatar } from 'react-native-elements';
import { Button, Toast } from 'teaset';
import styleUtil from "../../common/styleUtil";
import ImagePicker from 'react-native-image-picker';
import config from '../../common/config';
import { uploadImage } from '../../common/request';
import { StackActions, NavigationActions } from 'react-navigation';
// import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

export default class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFocus: 0,
            username: '',
            password: '',
            mobile: '',
            avatarSource: '',
            truename: '',
            studentId: '',
            isVisible: false,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '注册',
        headerTintColor: '#fff',
        headerTitleStyle: { // android 居中
            flex: 1,
            textAlign: 'center',
            fontSize: 16,
            paddingRight: 45,
        },
        headerStyle: {
            backgroundColor: '#ff7040',
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

    //选择头像
    selectPhotoTapped() {
        const options = {
            title: '设置一个头像吧',
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

                uploadImage(response.uri, response.fileName, '').then((imageUrl) => {
                    const source = { uri: imageUrl }
                    // imgList.push(source)
                    this.setState({
                        avatarSource: source,
                    });
                }).catch((err) => {
                    throw err;
                })
            }
        });
    }

    _reg = () => {
        const { navigate } = this.props.navigation;
        let body = {
            username: this.state.username,
            mobile: this.state.mobile,
            password: this.state.password,
            userImg: this.state.avatarSource.uri,
            truename: this.state.truename,
            studentId: this.state.studentId,
        };

        fetch(config.api.URI + '/users/reg', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            // this.setState({ isLogin: true });
            return response.json();
        }).then((responseText) => {
            if (responseText.result.code === 200) {
                Toast.success(responseText.result.msg + ', 请登录');

                // var result = responseText;
                // navigate('Login');
                let resetActiom = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login' })
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

    showOverLay = () => {
        this.setState({ isVisible: true })
    }

    hideOverLay = () => {
        this.setState({ isVisible: false })
    }

    render() {
        const { isFocus, username, mobile, password, avatarSource } = this.state
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'#ff7040'} barStyle={'light-content'} />
                <View style={styles.avatarview}>
                    <Avatar
                        size='large'
                        rounded
                        onPress={this.selectPhotoTapped.bind(this)}
                        source={avatarSource == '' ? require('../../assets/image/normalAdvata.png') : avatarSource}
                    />
                </View>
                <View style={styles.inputText}>
                    <Input
                        leftIcon={<Icon name='user' type='feather' size={18} color='#d2d2d2' />}
                        style={{ width }}
                        placeholder='用户名'
                        selectionColor='#ff7040'
                        onChangeText={text => this.setState({ username: text })}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Input
                            leftIcon={<Icon name='phone' type='feather' size={18} color='#d2d2d2' />}
                            style={{ width }}
                            placeholder='手机号'
                            selectionColor='#ff7040'
                            onChangeText={text => this.setState({ mobile: text })}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Input
                            leftIcon={<Icon name='lock' type='feather' size={18} color='#d2d2d2' />}
                            style={{ width }}
                            placeholder='密码'
                            selectionColor='#ff7040'
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ password: text })}
                        />
                        {/* <Button
                            title='获取验证码'
                            titleStyle={{ color: '#fff' }}
                            style={{ backgroundColor: '#9999FF', borderColor: 'transparent' }}
                            
                        /> */}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Input
                            leftIcon={<Icon name='paperclip' type='feather' size={18} color='#d2d2d2' />}
                            style={{ width }}
                            placeholder='真实姓名'
                            selectionColor='#ff7040'
                            onChangeText={text => this.setState({ truename: text })}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Input
                            leftIcon={<Icon name='paperclip' type='feather' size={18} color='#d2d2d2' />}
                            style={{ width }}
                            placeholder='学号'
                            selectionColor='#ff7040'
                            onChangeText={text => this.setState({ studentId: text })}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ color: '#ff7040', fontSize: 12 }} onPress={() => { navigate('Login') }}>已有账号，去登录 > </Text>
                    </View>

                </View>

                <View style={styles.btns}>
                    <TouchableOpacity activeOpacity={0.8}
                        underlayColor={'#FFF'}
                        style={[styles.loginButton]}
                        onPress={this._reg}
                    >
                        <Text style={styles.loginText}>注册</Text>
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
    avatarview: {
        flex: 0.35,
        alignItems: 'center',
        paddingTop: 30,
    },
    inputText: {
        width,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
    },
    loginInput: {
        width: width * 0.9,
        height: 40,
        borderBottomWidth: 2
    },
    loginInput2: {
        width: width * 0.6,
        height: 40,
        borderBottomWidth: 2
    },
    testbtn: {
        height: 30,
        backgroundColor: '#9999ff',
        overflow: 'hidden',
        width: width * 0.3,
        borderRadius: 6,
        marginTop: 10,
    },
    btns: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width,
        paddingVertical: 30,
    },
    loginButton: {
        height: 45,
        width: width * 0.9,
        borderRadius: 26,
        backgroundColor: '#ff7040',
        overflow: 'hidden',
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


