import axios from 'axios';
import qs from 'qs';
// import { Message } from "element-ui";
import sha256 from 'js-sha256';

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function param(json) {
    if (!json) return '';
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return '';
            return key + '=' + json[key];
        })
    ).join('&');
}

export function fixDataSign(data) {

    // const form = {
    //   app_key: '23Jn4Pua88f1',
    // }
}

export function dataSign(items, besides, appKey = 'yuioplkjhgmnbvc', isReturnKey = true) {
    const obj = {};
    const form = { ...items, app_key: appKey, timestamp: Math.round(Date.now() / 1000) }


    Object.keys(form).sort().forEach(item => {
        obj[item] = form[item];
    });

    const stringify = param(obj);
    const sign = sha256(stringify);

    return isReturnKey
        ? { ...besides, ...form, app_key: 'tokenpocketpc', sign }
        : { ...form, sign };
}

function checkConfig(config) {
    switch (config.method.toLowerCase()) {
        case 'post':
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            config.data = qs.stringify(config.data);
            break;
    }

    return config;
}

const service = axios.create({
    // timeout: 1000 * 15,
    baseURL: 'https://preserver.mytokenpocket.vip'
    // baseURL: 'https://betaserver.mytokenpocket.vip'
    // baseURL: 'https://testserver.mytokenpocket.vip'
});

// request interceptor
service.interceptors.request.use(
    config => {
        return checkConfig(config);
    },
    error => {
        Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;
