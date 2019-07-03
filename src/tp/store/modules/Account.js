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
    }
}

export default Account
