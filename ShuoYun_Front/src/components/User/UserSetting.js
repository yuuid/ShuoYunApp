import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import styleUtil from "../../common/styleUtil";
import { Avatar, Text, Input } from 'react-native-elements';
import { ListRow, Button, ActionSheet, Toast } from 'teaset';
import ImagePicker from 'react-native-image-picker';
import { StackActions, NavigationActions } from 'react-navigation'
import config from '../../common/config';
import { uploadImage } from '../../common/request';
// import { connect } from 'react-redux';

const { width } = Dimensions.get('window');
const cancelItem = { title: '取消' };
export default class UserSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: '#000',
            avatarSource: null,
            sex: null,
            sexText: '',
            username: '',
            oldpsd: '',
            newpsd: '',
            repsd: '',

        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: '设置',
        headerTintColor: '#ff7040',
        headerTitleStyle: { // android 居中
            flex: 1,
            // textAlign: 'center',
            fontSize: 18,
            color: '#ff7040'
        },
    });

    componentDidMount() {
    }

    //选择图片
    selectPhotoTapped = () => {
        const options = {
            title: '修改头像',
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
                    // console.log(imageUrl);

                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                    // let oldselectIssueData = this.state.selectIssueData;
                    // oldselectIssueData.IssueImageList.push({ uri: imageUrl });

                    const source = { uri: imageUrl }
                    // imgList.push(source)
                    this.setState({
                        avatarSource: source,
                    });
                    this.handleSaved();

                }).catch((err) => {
                    throw err;
                })
            }
        });
    }

    handleSex = () => {
        const sexOption = [
            { title: '男', onPress: () => this.setState({ sexText: '男', sex: 1 }) },
            { title: '女', onPress: () => this.setState({ sexText: '女', sex: 2 }) },
            { title: '保密', onPress: () => this.setState({ sexText: '保密', sex: 0 }) },
        ];
        ActionSheet.show(sexOption, cancelItem)
    }

    //保存信息
    handleSaved = () => {
        const { navigate } = this.props.navigation;
        const { params: { user } } = this.props.navigation.state;
        const { username, sex, avatarSource } = this.state

        let body1 = {
            username: username === '' ? user.username : username,
            sex: sex === null ? user.sex : sex,
            userImg: avatarSource === null ? user.userImg : avatarSource.uri,
            userId: user.userId,
        };
        fetch(config.api.URI + '/users/updateUserInfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body1),
        }).then((response) => {
            // this.setState({ isLogin: true });
            return response.json();
        }).then((responseText) => {
            if (responseText.result.code === 200) {
                Toast.success(responseText.result.msg);
                // config.removeUser();
                config.setUser(responseText.result.data);
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

    //修改密码
    handleSavedPsd = () => {
        // const { navigate } = this.props.navigation;
        const { params: { user } } = this.props.navigation.state;
        const { oldpsd, newpsd } = this.state
        if (oldpsd === '' || newpsd === '') {
            return;
        }
        let body2 = {
            oldpsd,
            newpsd,
            userId: user.userId,
        }
        fetch(config.api.URI + '/users/updatepsd', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body2),
        }).then((response) => {
            return response.json();
        }).then((responseText) => {
            if (responseText.result.code === 200) {
                Toast.success(responseText.result.msg);
                config.setIsLogined();
                config.removeUser();
                let resetActiom = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login' })
                    ]
                })
                this.props.navigation.dispatch(resetActiom)
                // navigate('Login');
            } else {
                Toast.fail(responseText.result.msg);
            }
        }).catch((error) => {
            console.error(error);
        });

    }

    render() {
        // const { navigate } = this.props.navigation;
        const { params: { user } } = this.props.navigation.state;
        const { username, avatarSource, oldpsd, newpsd } = this.state

        const renderContent = () => {
            return (
                <View style={{ marginTop: 20 }}>
                    <View>
                        <ListRow
                            title={
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 8,
                                    alignItems: 'center',

                                }}>
                                    <Text style={{ color: '#b2b2b2' }}>编辑头像</Text>
                                </View>
                            }
                            onPress={this.selectPhotoTapped}
                            icon={
                                <Avatar
                                    size='large'
                                    rounded
                                    // source={{ uri: user.userImg } || require('../../assets/image/avatar.png')}
                                    source={avatarSource === null ? { uri: user.userImg } : avatarSource}
                                />
                            }
                            topSeparator={'full'}
                            bottomSeparator={'full'}
                        />
                    </View>
                    <View style={{ width, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginLeft: 10, justifyContent: 'flex-start' }}>个人信息</Text>
                            <Button
                                title="保存"
                                type='link'
                                onPress={this.handleSaved}
                                titleStyle={{ color: '#ff4040' }}
                                style={{ justifyContent: 'flex-end', marginBottom: 10 }}
                            />
                        </View>
                        <ListRow
                            title='昵称'
                            detail={<Input
                                // placeholder={user.username}
                                value={username === '' ? user.username : username}
                                onChangeText={text => this.setState({ username: text })}
                            />}
                            // topSeparator={'none'}
                            bottomSeparator={'none'}
                        />
                        <ListRow
                            title='手机'
                            detail={<Input
                                value={user.mobile}
                                editable={false} />}
                            topSeparator={'none'}
                            bottomSeparator={'none'}
                        />
                        <ListRow
                            title='性别'
                            detail={<Input
                                value={user.sex === 1 ? '男' : user.sex === 2 ? '女' : '未知'}
                                editable={false}
                            />}
                            topSeparator={'none'}
                            // bottomSeparator={'none'}
                            onPress={this.handleSex}
                            accessory={'none'}
                        />

                    </View>

                    <View style={{ width, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginLeft: 10, justifyContent: 'flex-start' }}>修改密码</Text>
                            <Button
                                title="保存"
                                type='link'
                                onPress={this.handleSavedPsd}
                                titleStyle={{ color: '#ff4040' }}
                                style={{ marginBottom: 10, justifyContent: 'flex-end' }}
                            />
                        </View>
                        <ListRow
                            title='旧密码'
                            detail={<Input
                                value={oldpsd}
                                onChangeText={text => this.setState({ oldpsd: text })}
                            />}
                            bottomSeparator={'none'}
                        />
                        <ListRow
                            title='新密码'
                            detail={<Input
                                value={newpsd}
                                onChangeText={text => this.setState({ newpsd: text })} />}
                            bottomSeparator={'none'}
                        />
                    </View>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                    {renderContent()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: styleUtil.backgroundColor,
    },
    avatarContainer: {
        width: 75,
        height: 75,
        borderRadius: 8,
        marginRight: 15
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 8
    },
})
