import Storage from '../../../utils/Storage';

export default {
    state: {
        sessionTab: Storage.GET_STORAGE('SESSION_TAB', 'sessionStorage') || { type: 'Sessions' },
        // sessionMap: {},
        sessionList: [],

        // 当前会话信息
        currentSessionInfo: Storage.GET_STORAGE('CURRENT_SESSION_INFO', 'sessionStorage') || {},
        currentSessionMsg: [],
        currentSessionLastMsg: null,
        currentTeamInfo: {},
        currentContactInfo: {}

    },

    getters: {
        sessionTab: state => state.sessionTab,
        // sessionMap: state => state.sessionMap,
        sessionList: state => state.sessionList,
        currentSessionInfo: state => state.currentSessionInfo,
        // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
        currentSessionId: state => state.currentSessionInfo.id,
        currentSessionMsg: state => state.currentSessionMsg,
        currentSessionLastMsg: state => state.currentSessionLastMsg,
        currentTeamInfo: (state, getters) => {
            if (!state.currentTeamInfo.name && getters.teamList.length > 0) {
                return getters.teamList[0];
            }
            return state.currentTeamInfo;
        },
        currentContactInfo: state => state.currentContactInfo

    },

    mutations: {
        SESSION_TAB: (state, sessionTab) => state.sessionTab = sessionTab,
        SESSION_LIST: (state, sessionList) => state.sessionList = sessionList,
        CURRENT_SESSION_INFO: (state, currentSessionInfo) => state.currentSessionInfo = currentSessionInfo,
        CURRENT_CONTACT_INFO: (state, currentContactInfo) => state.currentContactInfo = currentContactInfo,
        CURRENT_TEAM_INFO: (state, currentTeamInfo) => state.currentTeamInfo = currentTeamInfo,
    },

    actions: {
        /**
         * 当前会话tab
         */
        async CURRENT_SESSION_TAB({ state, commit }, sessionTab) {
            const { type } = sessionTab;
            switch (type) {
                case 'init':
                    Storage.SET_STORAGE({ key: 'SESSION_TAB', value: sessionTab.data }, 'sessionStorage');
                    commit('SESSION_TAB', sessionTab.data);
                    break;
                case 'destroy':
                    Storage.REMOVE_STORAGE('SESSION_TAB', 'sessionStorage');
                    commit('SESSION_TAB', { type: 'Sessions' });
                    break;
            }
        },

        /**
         * 更新会话列表
         */
        async UPDATE_SESSIONS({ state, commit, rootGetters }, sessions) {
            if (!Array.isArray(sessions)) sessions = [sessions];
            // 过滤无效会话
            // 更新时间排序
            const arr = sessions.filter(session => session.to && session.scene).sort((a, b) => b.updateTime - a.updateTime);

            // 合并会话
            const mergeSessions = state.nim.mergeSessions(state.sessionList, arr);

            commit('SESSION_LIST', mergeSessions);
        },

        /**
         * 设置当前会话信息
         */
        async SET_CURRENT_SESSION_INFO({ state, commit }, currentSessionInfo) {
            const { type, data } = currentSessionInfo;
            switch (type) {
                case 'init':
                    Storage.SET_STORAGE({ key: 'CURRENT_SESSION_INFO', value: data }, 'sessionStorage');
                    commit('CURRENT_SESSION_INFO', data);
                    break;
                case 'destroy':
                    Storage.REMOVE_STORAGE('CURRENT_SESSION_INFO', 'sessionStorage');
                    commit('CURRENT_SESSION_INFO', {});
                    break;
            }

        },

        /**
         * 设置当前会话
         */
        async SET_CURRENT_SESSION({ state, commit, dispatch }, sessionInfo) {
            const nim = state.nim;
            if (sessionInfo.id) {
                dispatch('SET_CURRENT_SESSION_INFO', { type: 'init', data: sessionInfo });

                // 如果在聊天页面刷新，此时还没有nim实例，需要在onSessions里同步
                nim.setCurrSession(sessionInfo.id);

                // 初始化当前会话
                await dispatch('INIT_CURRENT_SESSION_MSG', sessionInfo);
            }
        },


        /**
         * 插入本地会话记录
         */
        async INSERT_LOCAL_SESSION({ state, commit, dispatch }, sessionInfo) {
            const { scene, to } = sessionInfo;
            state.nim.insertLocalSession({
                scene,
                to,
                done: async (error, obj) => {
                    const session = obj.session !== undefined
                        ? obj.session
                        : error.event
                            ? error.event.session
                            : undefined;

                    console.log('插入本地会话记录:', session);

                    if (session) {
                        dispatch('SET_CURRENT_SESSION', session);

                        await dispatch('CURRENT_SESSION_TAB', {
                            type: 'init',
                            data: {
                                iconClass: 'message',
                                type: 'Sessions'
                            }
                        });
                    }
                }
            });
        },

        /**
         * 如果会话对象不是好友，需要更新好友名片
         */
        UPDATE_SESSION_ACCOUNT({ commit, dispatch }, sessions) {
            console.log('更新好友名片', sessions);
            let accountsNeedSearch = [];
            sessions.forEach(item => {
                console.log('session item:', item);
                if (item.scene === 'p2p') {
                    // 如果不存在缓存资料
                    if (!store.state.Chat.userInfos[item.to]) {
                        accountsNeedSearch.push(item.to);
                    }
                }
            });

            if (accountsNeedSearch.length > 0) {
                dispatch('searchUsers', { accounts: accountsNeedSearch });
            }

            commit('updateSessions', sessions);
        }
    },

};
