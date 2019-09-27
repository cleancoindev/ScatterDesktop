import SocketService from '../../../services/utility/SocketService'
import StorageService from '../../../services/utility/StorageService'
import ElectronHelpers from '../../../util/ElectronHelpers'
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
      const {
        keypairUnique,
        networkUnique,
        name,
        authority,
        publicKey
      } = state.currentAccount
      const onlyone = `${keypairUnique}${networkUnique}${name}${authority}${publicKey}`

      const account = getters.tpAccounts.find(acc => acc.unique() === onlyone)

      if (onlyone && account) return account

      if (getters.tpAccounts.length > 0) {
        elStore.set('CURRENT_ACCOUNT', getters.tpAccounts[0])
        return getters.tpAccounts[0]
      }

      return {}
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
