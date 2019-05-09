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
import config from '../../common/config';

const { width, height } = Dimensions.get('window');
const cancelItem = { title: '取消' };
export default class GuanYu extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        headerTitle: '关于说云文学社',
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


    render() {
        // const { navigate } = this.props.navigation;
        const { params: { user } } = this.props.navigation.state;
        const { username, avatarSource, oldpsd, newpsd } = this.state

        const renderContent = () => {
            return (
                <View style={{ width, height: height * 0.8, flexDirection: 'column', justifyContent: 'center' }}>
                    <View style={styles.avatarview}>
                        <Avatar
                            source={{ uri: config.api.URI + '/public/images/guanfangAdvata.png' }}
                            rounded
                            size='large'
                            containerStyle={{ justifyContent: 'center' }}
                        />
                    </View>
                    <Text style={{ textAlign: 'center' }}>版本号：1.1.0</Text>
                    <Text style={[styles.detail, { marginTop: 20 }]}>这里可能不是浙理的第一个文学社</Text>
                    <Text style={styles.detail}>但在这里绝对能找到更好的自己！</Text>
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
    avatarview: {
        alignItems: 'center',
        marginBottom: 10,
    },
    detail: {
        color: '#797979',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20
    }
})
