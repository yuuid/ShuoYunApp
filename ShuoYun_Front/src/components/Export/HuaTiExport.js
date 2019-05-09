import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Keyboard,
    Image,
    ScrollView,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Easing,
    // NativeMethodsMixin
} from 'react-native';
import styleUtil from "../../common/styleUtil";
import { Header, Avatar, Icon, Badge, Overlay } from 'react-native-elements';
import { Toast, ActionSheet, TransformView, ListRow, Menu } from 'teaset';
import ZoomImage from 'react-native-zoom-image';
import ImagePicker from 'react-native-image-picker';

import CNRichTextEditor, { CNToolbar, getInitialObject, getDefaultStyles } from "react-native-cn-richtext-editor";
import config from '../../common/config';
import { StackActions, NavigationActions } from 'react-navigation';
import { uploadImage } from '../../common/request';

const { width, height } = Dimensions.get('window');

const defaultStyles = getDefaultStyles();

export default class HuaTiExport extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            tagValue: '',
            selectedTag: 'body',
            selectedStyles: [],
            value: [getInitialObject()],
            user: {},
            imgList: [],
        }
        this.editor = null;
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

    //点击发表
    handleExport = () => {
        const { navigate } = this.props.navigation;
        //发表新话题
        let body = {
            title: this.state.title,
            content: this.state.value,
        };
        fetch(config.api.URI + '/huati/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            return response.json();
        }).then((responseText) => {
            if (responseText.result.code === 200) {
                Toast.success(responseText.result.msg);
                let resetActiom = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Home' })
                    ]
                })
                this.props.navigation.dispatch(resetActiom)
                // navigate('Seek');
            } else {
                Toast.fail(responseText.result.msg);
            }

        }).catch((error) => {
            console.error(error);
        });

    }

    onStyleKeyPress = (toolType) => {
        this.editor.applyToolbar(toolType);
    }

    onSelectedTagChanged = (tag) => {
        this.setState({
            selectedTag: tag
        })
    }

    onSelectedStyleChanged = (styles) => {
        this.setState({
            selectedStyles: styles,
        })
    }

    onValueChanged = (value) => {
        this.setState({
            value: value
        });
    }

    //选择图片
    selectPhotoTapped = () => {
        const { imgList } = this.state
        const options = {
            title: '插入图片',
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
                    imgList.push(source)
                    this.setState({
                        imgList,
                    });

                }).catch((err) => {
                    throw err;
                })

                // const source = { uri: response.uri }
                // imgList.push(source)
                // this.setState({
                //     imgList,
                // });
            }
        });
    }

    renderContent = () => {
        const { imgList } = this.state

        return (
            <View style={{ flexDirection: 'column', minHeight: height }}>
                <Header
                    containerStyle={{ height: 48 }}
                    backgroundColor={'#FF7040'}
                    centerComponent={{ text: '', style: { color: '#fff', fontSize: 20 } }}
                    rightComponent={<Icon type='feather' name='check' color='#fff' onPress={this.handleExport} />}
                />
                <View style={{ flexDirection: 'column', minHeight: height }}>
                    <KeyboardAvoidingView
                        behavior="padding"
                        // enabled
                        keyboardVerticalOffset={0}
                        style={{
                            flex: 1,
                            paddingTop: 10,
                            backgroundColor: '#eee',
                            flexDirection: 'column',
                        }}
                    >
                        <View style={styles.title}>
                            <TextInput
                                placeholder='标题'
                                style={styles.titleInput}
                                underlineColorAndroid={'transparent'}
                                selectionColor='#333333'
                                onChangeText={(text) => { this.setState({ title: text }) }}
                            />
                        </View>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                            <View style={{ height: height * 0.45, paddingHorizontal: 10, marginTop: 5 }}>
                                <CNRichTextEditor
                                    ref={input => this.editor = input}
                                    onSelectedTagChanged={this.onSelectedTagChanged}
                                    onSelectedStyleChanged={this.onSelectedStyleChanged}
                                    value={this.state.value}
                                    style={{ backgroundColor: '#fff' }}
                                    styleList={defaultStyles}
                                    onValueChanged={this.onValueChanged}
                                    placeholder='内容'
                                    selectionColor='#333333'
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </View>
        )
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.renderContent()}
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
    title: {
        backgroundColor: '#fff',
        height: height * 0.08,
        borderStyle: 'dashed',
        borderBottomColor: '#FF7040',
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    titleInput: {
        fontSize: 20,

    },

})