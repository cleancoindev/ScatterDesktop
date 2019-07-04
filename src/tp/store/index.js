import Storage from '../utils/Storage';

import DApp from './modules/DApp';
import Account from './modules/Account';
import Chat from './modules/Chat/index';

const TP = {
    state: {
        chainIdObj: {
            'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906': 4,
            'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86': 6
        },
        currentLanguage: Storage.GET_STORAGE('currentLanguage') || 'zh',
        ...Account.state,
        ...DApp.state,
        ...Chat.state,
    },

    getters: {
        ...Account.getters,
        ...DApp.getters,
        ...Chat.getters,
        currentLanguage: state => state.currentLanguage,
        tpCurrentLanguage: (state, getters) => {
            return getters.currentLanguage === 'zh' ? 'zh-Hans' : 'en'
        }
    },

    mutations: {
        ...Account.mutations,
        ...DApp.mutations,
        ...Chat.mutations,
        CURRENT_LANGUAGE: (state, language) => state.currentLanguage = language
    },

    actions: {
        ...Account.actions,
        ...DApp.actions,
        ...Chat.actions,
        HAS_CHAIN({ state }, chainId) {
            return new Promise(resolve => {
                resolve(state.chainIdObj[chainId]);
            });
        },
        SET_CURRENT_LANGUAGE({ commit }, language) {
            Storage.SET_STORAGE({
                key: 'currentLanguage',
                value: language
            });
            commit('CURRENT_LANGUAGE', language);
        }
    },

    modules: {}
};

export default TP;
