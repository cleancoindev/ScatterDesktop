import fetch from '../utils/Request';
import { IM } from './url';

export function login(data) {
    return fetch.post(IM.LOGIN, data);
}

export function getFollowList(params) {
    return fetch.get(IM.FOLLOW_LIST, { params });
}

export function getIsFollow(params) {
    return fetch.get(IM.IS_FOLLOW, { params });
}

export function followAccount(data) {
    return fetch.post(IM.FOLLOW_ACCOUNT, data);
}

export function unFollowAccount(data) {
    return fetch.post(IM.UN_FOLLOW_ACCOUNT, data);
}
