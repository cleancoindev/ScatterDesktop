import SocketService from '../../../services/utility/SocketService'
import StorageService from '../../../services/utility/StorageService'
import ElectronHelpers from '../../../util/ElectronHelpers'
import Storage from '../../utils/Storage'
const Store = window.require('electron-store')

const elStore = new Store()

const Account = {
  state: {
    currentAccount: elStore.get('CURRENT_ACCOUNT') || {}
  },

  getters: {
    tpAccounts: (state, getters) => {
      if (Array.isArray(getters.keypairs)) {
        const keypairs = getters.keypairs.map(keypair => {
          return keypair.accounts(true).filter(x => x.sendable())
        })

        return keypairs.reduce((a, b) => {
          a.forEach(account => b.push(account))
          return b
        }, [])
      }

      return []
    },
    currentAccount: (state, getters) => {
      if (
        !state.currentAccount.keypairUnique &&
        getters.tpAccounts.length > 0
      ) {
        return getters.tpAccounts[0]
      }
      return getters.tpAccounts.find(
        acc => acc.keypairUnique === state.currentAccount.keypairUnique
      )
    }
  },

  mutations: {
    CURRENT_ACCOUNT: (state, account) => (state.currentAccount = account)
  },

  actions: {
    async SET_CURRENT_ACCOUNT({ commit }, accountInfo) {
      elStore.set('CURRENT_ACCOUNT', accountInfo)
      commit('CURRENT_ACCOUNT', accountInfo)
    },

    async DESTROY_ACCOUNT({ dispatch }) {
      await SocketService.close()

      setTimeout(async () => {
        await StorageService.removeScatter()
        ElectronHelpers.reload()
      }, 500)

      elStore.delete('CURRENT_ACCOUNT')
      dispatch('RESET_IM')
    }
  }
}

export default Account
