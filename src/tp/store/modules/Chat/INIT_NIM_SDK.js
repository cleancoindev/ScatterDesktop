import { ipcAsync } from '../../../../util/ElectronHelpers';
import EosService from '../../../../plugins/defaults/eos';
import Crypto from '../../../../util/Crypto';
import md5 from 'js-md5';
import { dataSign } from '../../../utils/Request';
import { login } from '../../../api/im';
import SDK from '../../../NIM_WEB/NIM_Web_SDK';
import { Message } from 'element-ui';
import util from '../../../utils/chat';
import { modules } from 'eosjs';

const { ecc } = modules;

import Storage from '../../../utils/Storage';
import { formatSessions } from '../../../utils/chat/formatSessions';


export default {
    state: {
        nim: null,
        // 登录账户
        imAccountInfo: Storage.GET_STORAGE('IM_ACCOUNT_INFO') || {},
        concatNum: 1,
        imInfo: {},
        // 用户名片
        myInfo: Storage.GET_STORAGE('MY_INFO') || {},
        // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
        userInfos: {},
        // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
        userSubscribes: {},
    },

    getters: {
        nim: state => state.nim,
        imAccountInfo: state => state.imAccountInfo,
        concatNum: state => state.concatNum,
        imInfo: state => state.imInfo,
        myInfo: state => state.myInfo,
        imCurrentAccount: (state, getters) => {
            return state.imAccountInfo[getters.accountInfo.name]
                ? state.imAccountInfo[getters.accountInfo.name]
                : null;
        }
    },

    mutations: {
        NIM_SDK(state, nim) {
            state.nim = nim;
        },

        IM_ACCOUNT_INFO(state, info) {
            const { type } = info;
            switch (type) {
                case 'update':
                    state.imAccountInfo[info.name] = info.data;
                    Storage.SET_STORAGE({
                        key: 'IM_ACCOUNT_INFO',
                        value: state.imAccountInfo
                    });
                    break;
                case 'del':
                    Storage.REMOVE_STORAGE('IM_ACCOUNT_INFO');
                    state.imAccountInfo = {};
                    break;
            }
        },

        // IM连接次数
        CONCAT_NUM(state, concatInfo) {
            const { type } = concatInfo;
            switch (type) {
                case 'error':
                    state.concatNum += 1;
                    break;
                case 'reset':
                    state.concatNum = 1;
                    break;
            }
        },

        IM_INFO(state, imInfo) {
            state.imInfo = imInfo;
        },
        MY_INFO(state, myInfo) {
            state.myInfo = myInfo;
        },
    },

    actions: {
        async RESET_IM({ commit, dispatch }) {
            commit('SESSION_LIST', []);
            commit('TEAM_LIST', []);
            commit('CURRENT_TEAM_INFO', {});
            commit('CURRENT_CONTACT_INFO', {});
            commit('FOLLOW_LIST', { type: 'destroy' });
            commit('CURRENT_SESSION_MSG', { type: 'destroy' });
            dispatch('UPDATE_MY_INFO', { type: 'destroy' });
            dispatch('CURRENT_SESSION_TAB', { type: 'destroy' });
            dispatch('SET_CURRENT_SESSION_INFO', { type: 'destroy' });
        },

        async UPDATE_MY_INFO({ state, commit }, myInfo) {
            const { type, data } = myInfo;
            switch (type) {
                case 'update':
                    Storage.SET_STORAGE({
                        key: 'MY_INFO',
                        value: data
                    });
                    commit('MY_INFO', data);
                    break;
                case 'destroy':
                    Storage.REMOVE_STORAGE('MY_INFO');
                    commit('MY_INFO', {});
            }
        },

        async INIT_USER_INFO({ state, commit, dispatch, rootGetters }, accountInfo) {
            return new Promise(async (resolve, reject) => {
                try {
                    const blockchain_id = await dispatch('HAS_CHAIN', accountInfo.network().chainId);
                    console.log(blockchain_id);
                    if (blockchain_id) {
                        // if (rootGetters.chainIdList.indexOf(accountInfo.keypair()))
                        const keypair = accountInfo.keypair();
                        keypair.decrypt(await ipcAsync('seed'));
                        console.log(accountInfo.keypair().privateKey);
                        // const privateKey =  EosService.bufferToHexPrivate(accountInfo.keypair().privateKey);
                        const privateKey = ecc.PrivateKey.fromBuffer(new Buffer(keypair.privateKey)).toString();
                        const content = md5('TokenPocket_' + Math.round(Date.now() / 1000));
                        const data_sign = ecc.sign(content, privateKey);
                        const wallet_name = accountInfo.sendable(); //根据blockchain_id来决定是否传，有帐号体系的底层传wallet_name，例如EOS, 没有帐号体系的传address
                        const address = accountInfo.publicKey;
                        const device_id = ''; //安装实例id
                        const pub_key = ''; //井通底层加这个字段
                        const data = dataSign({
                            content,
                            data_sign,
                            wallet_name,
                            blockchain_id,
                            address,
                            device_id,
                            pub_key
                        });

                        login(data).then(res => {
                            if (res.result === 0) {
                                commit('IM_ACCOUNT_INFO', {
                                    type: 'update',
                                    name: accountInfo.name,
                                    data: {
                                        uid: res.data.accid,
                                        sdktoken: res.data.token
                                    }
                                });

                                // 验证登录
                                dispatch('INIT_NIM_SDK', accountInfo);
                            }
                            resolve(res);
                        }).catch(err => reject(err));
                    } else {
                        reject('不支持当前底层聊天');
                    }

                } catch (e) {
                    reject(e);
                }
            });
        },

        async INIT_NIM_SDK({ state, getters, commit, dispatch, rootGetters }, accountInfo) {
            return new Promise(async (resolve, reject) => {
                if (!state.imAccountInfo[accountInfo.name]) {
                    commit('IM_INFO', { isOnline: false });
                    return false;
                }


                const { uid, sdktoken } = state.imAccountInfo[accountInfo.name];

                // 初始化SDK
                const nim = SDK.NIM.getInstance({
                    debug: false,
                    appKey: '3d7e34c2dab43b973f93f90f5ee2f6bc',
                    account: uid,
                    token: sdktoken,
                    transports: ['websocket'],
                    db: true,
                    // logFunc: new SDK.NIM.LoggerPlugin({
                    //   url: '/webdemo/h5/getlogger',
                    //   level: 'info'
                    // }),
                    // 是否同步会话的未读数, 默认不同步
                    syncSessionUnread: true,
                    // 是否自动标记消息为已收到
                    autoMarkRead: true, // 默认为true
                    /**
                     * 连接建立后的回调, 会传入一个对象, 包含登录的信息, 有以下字段
                     * lastLoginDeviceId: 上次登录的设备的设备号
                     * customTag: 客户端自定义tag,登录时多端同步改字段，最大32个字符
                     * connectionId: 本次登录的连接号
                     * ip: 客户端IP
                     * port: 客户端端口
                     * country: 本次登录的国家
                     * @param event
                     */
                    onconnect: (event) => {
                        // 连接上以后更新uid
                        // console.log('登录成功', event);
                    },
                    /**
                     * 即将重连的回调
                     * 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
                     * 此回调会收到一个对象, 包含额外的信息, 有以下字段
                     * duration: 距离下次重连的时间
                     * retryCount: 重连尝试的次数
                     * @param event
                     */
                    onwillreconnect: (event) => {
                        // console.log('即将重连:', event);
                    },
                    /**
                     * 断开连接后的回调
                     * 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
                     * 此回调会收到一个对象, 包含错误的信息, 有以下字段
                     * code: 出错时的错误码, 可能为空
                     * 302: 账号或者密码错误, 请跳转到登录页面并提示错误
                     * 417: 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                     * 'kicked': 被踢
                     * 当code为'kicked'的时候, 此对象会有以下字段
                     * reason: 被踢的原因
                     * samePlatformKick: 不允许同一个帐号在多个地方同时登录
                     * serverKick: 被服务器踢了
                     * otherPlatformKick: 被其它端踢了
                     * message: 文字描述的被踢的原因
                     * @param error
                     */
                    ondisconnect: async error => {
                        let errorMsg = '';
                        let map = { PC: '电脑版', Web: '网页版', Android: '手机版', iOS: '手机版', WindowsPhone: '手机版' };
                        let str = error.from;
                        switch (error.code) {
                            // 账号或者密码错误, 请跳转到登录页面并提示错误
                            case 302:
                                // 设置IM状态
                                commit('IM_INFO', { isOnline: false });
                                reject(error);
                                break;
                            // 被踢, 请提示错误后跳转到登录页面
                            case 'kicked':
                                errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[str] || '其他端')}踢出下线，请确定帐号信息安全!`;
                                commit('IM_INFO', { isOnline: false });
                                reject(errorMsg);
                                break;
                            default:
                                break;
                        }
                    },
                    onerror: (event) => {
                        commit('IM_INFO', { isOnline: false });
                        reject(event);
                    },

                    /* --------------------------- 消息 --------------------------- */
                    // 同步漫游的回调
                    onroamingmsgs: (obj) => {
                        // console.log('漫游消息:', obj);
                        dispatch('UPDATE_MESSAGE', obj.msgs);
                    },

                    // 同步离线消息的回调
                    onofflinemsgs: (obj) => {
                        // console.log('离线消息:', obj);
                        dispatch('UPDATE_MESSAGE', obj.msgs);
                    },

                    // 收到消息的回调
                    onmsg: (msg) => dispatch('PUT_MESSAGE', msg),

                    /* --------------------------- 会话 --------------------------- */
                    // 同步最近会话列表回调, 会传入会话列表, 按时间正序排列, 即最近聊过天的放在列表的最后面。
                    onsessions: (sessions) => {
                        formatSessions(sessions, rootGetters).then(res => {
                            dispatch('UPDATE_SESSIONS', res);
                        });

                    },

                    // 更新会话的回调
                    onupdatesession: (session) => {
                        formatSessions([session], rootGetters).then(res => {
                            console.log('更新会话的回调', res);
                            dispatch('UPDATE_SESSIONS', res);
                        });
                        // dispatch('UPDATE_SESSIONS', session);
                    },

                    /* --------------------------- 群组 --------------------------- */
                    syncTeams: true, // 同步群列表
                    syncExtraTeamInfo: true, // 同步额外的群信息
                    // syncTeamMembers: true, // 同步群成员

                    // 同步群列表的回调
                    onteams: (teams) => dispatch('UPDATE_TEAMS', teams),

                    // 更新群的回调, 此方法接收一个参数, 更新后的群信息
                    onUpdateTeam: (teams) => dispatch('UPDATE_TEAMS', teams),

                    // 当前登录用户在其它端创建群后的回调
                    // onsynccreateteam: (team) => dispatch('UPDATE_TEAMS', team),

                    // 创建群的回调, 此方法接收一个参数, 包含群信息和群主信息
                    // onCreateTeam: (team) => {
                    //     dispatch('UPDATE_TEAMS', team);
                    //     commit('UPDATE_TEAM_MEMBERS', { teamId: team.teamId, members: [] });
                    // },
                    // onDismissTeam: (obj) => dispatch('UPDATE_TEAMS', { invalid: { teamId: obj.teamId } }), // 解散群的回调, 此方法接收一个参数, 包含被解散的群id

                    // onAddTeamMembers: onAddTeamMembers, // 新成员入群的回调, 此方法接收一个参数, 包含群信息和群成员信息
                    // onRemoveTeamMembers: onRemoveTeamMembers, // 有人出群的回调, 此方法接收一个参数, 包含群信息和群成员账号
                    // onUpdateTeamManagers: onUpdateTeamManagers, // 更新群管理员的回调, 此方法接收一个参数, 包含群信息和管理员信息
                    // onupdateteammember: onUpdateTeamMember, // 群成员信息更新后的回调, 会传入群成员对象
                    // onUpdateTeamMembersMute: onUpdateTeamMembersMute, // 更新群成员禁言状态的回调, 此方法接收一个参数, 包含群信息和禁言状态信息
                    // onTeamMsgReceipt: onTeamMsgReceipt,
                    // onteammembers: onTeamMembers, // 已失效，需要手动获取 同步群成员的回调, 一个群对应一个回调, 会传入群成员数组


                    // 用户关系及好友关系
                    // onblacklist: onBlacklist,
                    // onsyncmarkinblacklist: onMarkInBlacklist,
                    // 多端登录
                    // onloginportschange: onLoginPortsChange,

                    // 同步静音列表的回调, 会传入静音列表mutelist
                    // onmutelist: onMutelist,
                    // 当前登录用户在其它端加入静音列表/从静音列表移除后的回调, 会传入一个参数, 包含两个字段
                    // onsyncmarkinmutelist: onMarkInMutelist,
                    // onfriends: onFriends,
                    // onsyncfriendaction: onSyncFriendAction,
                    // 机器人
                    // onrobots: onRobots,

                    // 用户名片 - actions/userInfo
                    // 同步登录用户名片的回调
                    onmyinfo: (obj) => {
                        // console.log('同步登录用户名片:', obj);
                        // obj = util.mergeObject(getters.myInfo, obj);
                        dispatch('UPDATE_MY_INFO', { type: 'update', data: obj });
                    },
                    // onupdatemyinfo: onMyInfo, // 当前登录用户在其它端修改自己的个人名片之后的回调
                    // onusers: onUserInfo, // 同步好友用户名片的回调
                    // onupdateuser: onUserInfo, // 用户名片更新后的回调


                    // 系统通知
                    // onsysmsg: onSysMsg, // 收到系统通知的回调
                    // onofflinesysmsgs: onSysMsgs,
                    // onupdatesysmsg: onSysMsg, // 通过、拒绝好友申请会收到此回调

                    // onsysmsgunread: onSysMsgUnread, // 收到系统通知未读数的回调
                    // onupdatesysmsgunread: onSysMsgUnread, // 更新系统通知未读数的回调
                    // onofflinecustomsysmsgs: onCustomSysMsgs, // 同步离线自定义系统通知的回调
                    // oncustomsysmsg: onCustomSysMsgs, // 收到自定义系统通知的回调

                    // 同步完成
                    onsyncdone: () => {
                        console.log('同步完成');
                        // 重置连接次数
                        // commit('CONCAT_NUM', { type: 'reset' });
                        commit('IM_INFO', { isOnline: true });
                        // 设置会话消息
                        if (getters.currentSessionId) dispatch('INIT_CURRENT_SESSION_MSG', state.currentSessionInfo);
                    }
                });

                commit('NIM_SDK', nim);
            });
        }
    }

};
