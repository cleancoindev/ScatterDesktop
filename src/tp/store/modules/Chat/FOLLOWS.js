import { followAccount, getFollowList, unFollowAccount } from '../../../api/im';
import { nimGetUser } from '../../../utils/chat/nimMethods';
import { dataSign } from '../../../utils/Request';

export default {
    state: {
        followList: [],
        followInfo: {},
        followForm: {
            start: 0,
            count: 1000
        }
    },

    getters: {
        followList: state => state.followList,
        followInfo: state => state.followInfo
    },

    mutations: {
        FOLLOW_LIST(state, res) {
            const { type, data } = res;
            switch (type) {
                case 'init':
                    state.start = 0;
                    state.followList = data;
                    break;
                case 'load':
                    state.start += 1000;
                    state.followList = [...state.followList, ...data];
                    break;
                case 'destroy':
                    state.start = 0;
                    state.followList = [];
                    break;
            }
        },

        FOLLOW_INFO: (state, followInfo) => state.followInfo = followInfo
    },

    actions: {
        async GET_IS_FOLLOW({ commit, rootGetters }, account) {
            // getIsFollow({
            //     imaccount_id: rootGetters.myInfo.account,
            //     target_imaccount_id: account.from
            // }).then(res => {
            //     if (res.result === 0) {
            //
            //     }
            // })
        },

        /**
         * 获取关注列表
         */
        async GET_FOLLOW_LIST({ commit, state, rootGetters }, payload) {
            const { type } = payload;

            getFollowList({
                imaccount_id: rootGetters.myInfo.account,
                ...state.followForm
            }).then(res => {
                if (res.result === 0) {
                    if (res.data) {
                        const accounts = res.data.map(async acc => await nimGetUser(state.nim, acc.accid));

                        Promise.all(accounts).then(list => {
                            commit('FOLLOW_LIST', { type, data: list });
                        });
                    } else {
                        commit('FOLLOW_LIST', { type: 'destroy'});
                    }
                }
            });
        },

        /**
         * 关注或者取消关注
         */
        async FOLLOW_ACCOUNT({ dispatch, rootGetters }, acc) {
            const { type, account } = acc;
            const form = dataSign({
                imaccount_id: rootGetters.myInfo.account,
                target_imaccount_id: account,
            }, {}, '23Jn4Pua88f1', false);

            switch (type) {
                case 0:
                    followAccount(form);
                    break;
                case 1:
                    unFollowAccount(form);
                    break;
            }

            dispatch('GET_FOLLOW_LIST', { type: 'init' })
        }
    }
};
