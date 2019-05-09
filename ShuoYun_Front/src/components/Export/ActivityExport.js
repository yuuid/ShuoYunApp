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
import { Toast, ActionSheet, TransformView, ListRow, Button } from 'teaset';
import ZoomImage from 'react-native-zoom-image';
import ImagePicker from 'react-native-image-picker';
// import DatePicker from 'react-native-datepicker';
import CNRichTextEditor, { CNToolbar, getInitialObject, getDefaultStyles } from "react-native-cn-richtext-editor";
import config from '../../common/config';
import { StackActions, NavigationActions } from 'react-navigation';
import { uploadImage } from '../../common/request';
import DatePicker from './DatePicker';
const { width, height } = Dimensions.get('window');

const defaultStyles = getDefaultStyles();
const cancelItem = { title: '取消' };
export default class ActivityExport extends Component {
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
            type: 0,
            activityType: '线下',
            start: '',
            end: '',
            isShowstartDatePicker: false,
            isShowendDatePicker: false,
        }
        this.editor = null;
    }

    static navigationOptions = {
        header: null
    };

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
        // const { params: { user } } = this.props.navigation.state;
        const { user } = this.state
        const { navigate } = this.props.navigation;

        //发表新活动
        let body = {
            username: user.username,
            start: this.state.start,
            end: this.state.end,
            title: this.state.title,
            content: this.state.value,
            type: this.state.type,
            userId: user.userId,
            imgList: this.state.imgList === [] ? null : this.state.imgList,
        };
        fetch(config.api.URI + '/activity/insertActivity', {
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
            }
        });
    }

    handleType = () => {
        const sexOption = [
            { title: '线上', onPress: () => this.setState({ activityType: '线上', type: 1 }) },
            { title: '线下', onPress: () => this.setState({ activityType: '线下', type: 0 }) },
        ];
        ActionSheet.show(sexOption, cancelItem)
    }

    renderContent = () => {
        const { imgList, type, activityType, isShowstartDatePicker, isShowendDatePicker } = this.state
        const startDateProps = {
            setTime: (date) => {
                this.setState({ start: date, isShowstartDatePicker: false })
            }

        }
        const endDateProps = {
            setTime: (date) => {
                this.setState({ end: date, isShowendDatePicker: false })
            }
        }
        return (
            <View style={{ flexDirection: 'column', minHeight: height }}>
                {/* <Header
                    containerStyle={{ height: 48 }}
                    backgroundColor={'#FF7040'}
                    leftComponent={user.usertype == 1 ? { text: '新活动', style: { color: '#fff', fontSize: 16 }, onPress: this.showActivity } : {}}
                    centerComponent={{ text: '文章', style: { color: '#fff', fontSize: 18 }, onPress: this.showArticle }}
                    rightComponent={<Icon type='feather' name='check' color='#fff' onPress={this.handleExport} />}
                /> */}

                <View style={{ flexDirection: 'column', minHeight: height }}>

                    <View style={{ marginTop: 5 }}>
                        <ListRow
                            icon={<Icon name='feather' type='feather' color='#FF7040' />}
                            title={activityType}
                            onPress={this.handleType}
                            topSeparator={'full'}
                            bottomSeparator={'full'}
                        />
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 10 }}>
                        <TextInput
                            placeholder='开始时间'
                            style={styles.timeInput}
                            underlineColorAndroid={'transparent'}
                            selectionColor='#333333'
                            onChangeText={(text) => { this.setState({ start: text }) }}
                        />
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 10 }}>
                        {/* <ListRow
                            icon={<Icon name='calendar' type='feather' color='#FF7040' />}
                            title={'结束时间'}
                            detail={end}
                            onPress={this.selectTime2}
                            topSeparator={'full'}
                            bottomSeparator={'full'}
                        /> */}
                        <TextInput
                            placeholder='结束时间'
                            style={styles.timeInput}
                            underlineColorAndroid={'transparent'}
                            selectionColor='#333333'
                            onChangeText={(text) => { this.setState({ end: text }) }}
                        />
                    </View>
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
                                placeholder='活动名称'
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
                                    placeholder='文章内容'
                                    selectionColor='#333333'
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        {/* <View style={{
                        minHeight: 40
                    }}>

                        <CNToolbar
                            size={28}
                            bold={<Text style={[styles.toolbarButton, styles.boldButton]}>B</Text>}
                            italic={<Text style={[styles.toolbarButton, styles.italicButton]}>I</Text>}
                            underline={<Text style={[styles.toolbarButton, styles.underlineButton]}>U</Text>}
                            lineThrough={<Text style={[styles.toolbarButton, styles.lineThroughButton]}>S</Text>}
                            body={<Text style={styles.toolbarButton}>T</Text>}
                            title={<Text style={styles.toolbarButton}>h1</Text>}
                            heading={<Text style={styles.toolbarButton}>h3</Text>}
                            ul={<Text style={styles.toolbarButton}>ul</Text>}
                            ol={<Text style={styles.toolbarButton}>ol</Text>}

                            selectedTag={this.state.selectedTag}
                            selectedStyles={this.state.selectedStyles}
                            onStyleKeyPress={this.onStyleKeyPress} />
                    </View> */}

                        <View style={{ height: imgList.length > 5 ? 100 * 3 : imgList.length > 2 ? 100 * 2 : 80, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {imgList.length < 9 && <Avatar
                                size={105}
                                icon={{ name: 'plus', type: 'feather', color: '#d2d2d2' }}
                                activeOpacity={0.8}
                                overlayContainerStyle={{ backgroundColor: '#f5f5f5', marginTop: 5, marginLeft: 10 }}
                                onPress={this.selectPhotoTapped}
                            />}
                            {imgList.length > 0 && imgList.map((element, index) => {
                                return (<View key={index} style={{ marginTop: 5, marginLeft: 10 }}>
                                    {/* <Avatar
                                    size={100}
                                    source={element.v}
                                    activeOpacity={0.8}
                                    overlayContainerStyle={{ backgroundColor: 'white' }}
                                /> */}
                                    <ZoomImage
                                        source={element}
                                        imgStyle={{ width: 100, height: 100 }}
                                        // style={styles.img}
                                        duration={200}
                                        enableScaling={false}
                                        easingFunc={Easing.ease}
                                    />
                                    <Badge
                                        status="error"
                                        badgeStyle={{ width: 22, height: 22, borderRadius: 15 }}
                                        containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                        value={<Icon name='x' type='feather' color='#fff' size={18} />}
                                        onPress={() => {
                                            var newList = [...imgList];
                                            newList.splice(index, 1)
                                            this.setState({ imgList: newList })
                                        }}
                                    />
                                </View>)
                            })}


                        </View>
                        <View style={{ justifyContent: 'center'}}>
                            <Button title='确认' type='primary' onPress={this.handleExport} />
                        </View>
                        <Overlay
                            isVisible={isShowstartDatePicker}
                            width="auto"
                            height={280}
                            onBackdropPress={() => this.setState({ isShowstartDatePicker: false })}
                        >
                            <DatePicker {...startDateProps} />

                        </Overlay>
                        <Overlay
                            isVisible={isShowendDatePicker}
                            width="auto"
                            height={280}
                            onBackdropPress={() => this.setState({ isShowendDatePicker: false })}
                        >
                            <DatePicker {...endDateProps} />

                        </Overlay>
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
        marginHorizontal: 10,
        paddingHorizontal: 10,
    },
    titleInput: {
        fontSize: 20,
    },
    timeInput: {
        fontSize: 16,
    },
    toolbarButton: {
        fontSize: 12,
        width: 28,
        height: 28,
        textAlign: 'center'
    },
    italicButton: {
        fontStyle: 'italic'
    },
    boldButton: {
        fontWeight: 'bold'
    },
    underlineButton: {
        textDecorationLine: 'underline'
    },
    lineThroughButton: {
        textDecorationLine: 'line-through'
    },
})