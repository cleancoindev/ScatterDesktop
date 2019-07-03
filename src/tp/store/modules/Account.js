import SocketService from "../../../services/utility/SocketService";
import StorageService from "../../../services/utility/StorageService";

const Account = {
    state: {
        currentAccount: {}
    },

    getters: {
        tpAccounts: (state, getters) => {
            if (Array.isArray(getters.keypairs)) {
                const keypairs = getters.keypairs.map(keypair => {
                    return keypair.accounts(true).filter(x => x.sendable())
                });

                return keypairs.reduce((a, b) => {
                    a.forEach(account => b.push(account));
                    return b;
                }, []);
            }

            return []
        },
        currentAccount: (state, getters) => {
            if (!state.currentAccount.sendable && getters.tpAccounts.length > 0) {
                return getters.tpAccounts[0]
            }

            return state.currentAccount
        }
    },

    mutations: {
        CURRENT_ACCOUNT:(state, account) => state.currentAccount = account
    },

    actions: {
        async DESTROY_ACCOUNT({dispatch}) {
            await SocketService.close();
            dispatch('RESET_IM');
            setTimeout(async () => {
                await StorageService.removeScatter();
                // Storage.REMOVE_STORAGE('ACCOUNT_INFO');
                // location.reload();
            }, 500);
        },
    }
}

export default Account
