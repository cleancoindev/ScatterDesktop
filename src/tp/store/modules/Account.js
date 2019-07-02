const Account = {
    state: {
        currentAccount: {}
    },

    getters: {
        tpAccounts: (state, getters) => {
            const keypairs = getters.keypairs.map(keypair => {
                return keypair.accounts(true)
                .filter(x => x.sendable())
                .sort((a, b) => {
                    return b.totalFiatBalance() - a.totalFiatBalance();
                });
            });

            return keypairs.reduce((a, b) => {
                a.forEach(account => b.push(account));
                return b;
            }, []);
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
