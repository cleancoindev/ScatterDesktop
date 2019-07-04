import SocketService from '../../../services/utility/SocketService';
import StorageService from '../../../services/utility/StorageService';
import ElectronHelpers from '../../../util/ElectronHelpers';
import Storage from '../../utils/Storage';

const Account = {
    state: {
        currentAccount: Storage.GET_STORAGE('CURRENT_ACCOUNT') || {}
    },

    getters: {
        tpAccounts: (state, getters) => {
            if (Array.isArray(getters.keypairs)) {
                const keypairs = getters.keypairs.map(keypair => {
                    return keypair.accounts(true).filter(x => x.sendable());
                });

                return keypairs.reduce((a, b) => {
                    a.forEach(account => b.push(account));
                    return b;
                }, []);
            }

            return [];
        },
        currentAccount: (state, getters) => {
            if (!state.currentAccount.sendable && getters.tpAccounts.length > 0) {
                return getters.tpAccounts[0];
            }

            return state.currentAccount;
        }
    },

    mutations: {
        CURRENT_ACCOUNT: (state, account) => state.currentAccount = account
    },

    actions: {
        async SET_CURRENT_ACCOUNT({ commit }, accountInfo) {
            Storage.SET_STORAGE({ key: 'CURRENT_ACCOUNT', value: accountInfo });
            commit('CURRENT_ACCOUNT', accountInfo);
        },

        async DESTROY_ACCOUNT({ dispatch }) {
            await SocketService.close();

            setTimeout(async () => {
                await StorageService.removeScatter();
                ElectronHelpers.reload();
            }, 500);

            Storage.REMOVE_STORAGE('CURRENT_ACCOUNT');
            dispatch('RESET_IM');
        },
    }
};

export default Account;
