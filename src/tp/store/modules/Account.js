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
      // const {
      //   keypairUnique,
      //   networkUnique,
      //   name,
      //   authority,
      //   publicKey
      // } = state.currentAccount

      // const onlyone = `${keypairUnique}${networkUnique}${name}${authority}${publicKey}`
      const onlyone = state.currentAccount.unique
        ? state.currentAccount.unique()
        : null
      const account = getters.tpAccounts.find(acc => acc.unique() === onlyone)

      if (onlyone && account) return account

      return getters.tpAccounts.length > 0 ? getters.tpAccounts[0] : {}
      // keypairUnique
      //   ? account
      //     ? account
      //     : getters.tpAccounts.length > 0
      //   ? getters.tpAccounts[0]
      //   : {}
      // if (!state.currentAccount) {
      //   return getters.tpAccounts.length > 0 ? getters.tpAccounts[0] : {}
      // }

      // return state.currentAccount

      // const account = getters.tpAccounts.find(
      //   acc => acc.keypairUnique === keypairUnique
      // )

      // if (!account && ) {
      //   return
      // }

      // console.log(account, 'accountaccount')
      // return account ? account : {}
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
