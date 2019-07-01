import fetch from '../utils/Request';
import { DApp } from './url';

export function getBannerList(params) {
    return fetch.get(DApp.GET_BANNER_LIST, {params});
}

export function getActivityList(params) {
    return fetch.get(DApp.GET_ACTIVITY_LIST, {params});
}

export function getCategoryList(params) {
    return fetch.get(DApp.GET_CATEGORY_LIST, { params });
}

export function getDAppList(params) {
    return fetch.get(DApp.GET_DAPP_LIST, { params });
}

export function getTokenListbyacc(params) {
    return fetch.get(DApp.GET_ASSET, { params });
}

