'use strict'

import QueryString from 'query-string'
// import { Alert } from 'react-native';
// import _ from 'lodash'
import { Toast } from "teaset";
import config from './config';
// import navigate from "../screens/navigate";
// import PhoneLogin from "../components/Login/Login";

/**
 * http请求
 */
// import { Alert } from 'react-native';
 

export const CTX = 'http://192.168.22.56:3000';

export function processError(data) {
    if (data.status === -2) { // 用户未登陆
        navigation.push('Login')
    } else {
        Alert.alert('错误提示', data.msg);
    }
}
 
export function httpGet(uri) {
    uri = CTX + uri;
    let init = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    return new Promise(function (resolve, reject) {
        fetch(uri, init)
            .then(response => response.json())
            .then(data => {
                if (data.status === 0) {
					
					resolve(data);
					
                } else {
                    processError(data);
                }
            }).catch(function (ex) {
                reject(ex);
                Toast.fail('错误提示');
            });
    });
}
 
export function httpPost(uri, params) {
    uri = CTX + uri;
    let init = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    };
    return new Promise(function (resolve, reject) {
        fetch(uri, init)
            .then(response => response.json())
            .then(data => {
                if (data !== []) {
					// Toast.success('登录成功');
                    resolve(data);
                } else {
                    processError(data);
                }
            }).catch(function (ex) {
                reject(ex);
                Toast.fail('错误提示', '网络链接出错');
            });
    });
}

export function httpUpload(uri, params) {
    uri = CTX + uri;
    let init = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: params
    };
    return new Promise(function (resolve, reject) {
        fetch(uri, init)
            .then(response => response.json())
            .then(data => {
                if (data.status === 0) {
                    resolve(data);
                } else {
                    processError(data);
                }
            }).catch(function (ex) {
                reject(ex);
                Toast.fail('错误提示', '网络链接出错');
            });
    });
}


export function uploadImage(imageUri, imageName, token) {
    return new Promise((resolve, reject) => {
        let data = new FormData()
        if (imageUri) {
            data.append('images', { uri: imageUri, name: imageName, type: 'multipart/form-data' })//加入图片
        }
        const bodyData = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                // 'Content-Language': React.NativeModules.RNI18n.locale,
                // 'Authorization': token,
            },
            body: data,
        }
        fetch(config.api.URI + '/upload/img', bodyData)
            .then(function (response) {
                return response.json();
            }).then((responseData) => {
                // console.log('responseData', responseData);
                if (responseData.code == 200) {
                    return resolve(config.api.URI + '/public/images/' + responseData.imageName);
                    //返回的是文件名，这里将它加入服务器的名称
                } else {
                    return reject(responseData.imageName || 'Unknow Error');
                }
            }).catch((error) => {
                return reject(error);
            });
    });
}