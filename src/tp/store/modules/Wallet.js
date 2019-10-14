import { addWallet, getTokenList, getTransactionAction } from '../../api/Wallet'
import Storage from '../../utils/Storage.js'

const getUUid = () => {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

const Wallet = {
  state: {
    walletMaps: {},
    assetTokenInfo: {
      tokens: [],
      total_asset: 0,
      unit: '$'
    },
    transactionActionList: [],
    currentWalletTokenInfo: {}
  },

  getters: {
    walletMaps: state => state.walletMaps,
    assetTokenInfo: state => state.assetTokenInfo,
    transactionActionList: state => state.transactionActionList,
    currentWalletId: (state, getters) => {
      const walletName = getters.currentAccount.name
        ? getters.currentAccount.name
        : getters.currentAccount.publicKey

      return Storage.GET_STORAGE(walletName)
    },
    currentBlockChainId: (state, getters) => {
      return getters.chainTypes[getters.currentAccount.networkUnique]
    },
    currentWalletTokenInfo: state => state.currentWalletTokenInfo
  },

  mutations: {
    WALLET_MAPS(state, payload) {
      const { walletID, walletName } = payload

      Storage.SET_STORAGE({
        key: walletName,
        value: walletID
      })
    },

    ASSET_TOKEN_INFO(state, assetTokenInfo) {
      state.assetTokenInfo = assetTokenInfo
    },

    TRANSACTION_ACTION_LIST(state, transactionActionList) {
      state.transactionActionList = transactionActionList
    },

    CURRENT_WALLET_TOKEN_INFO(state, currentWalletTokenInfo) {
      state.currentWalletTokenInfo = currentWalletTokenInfo
    }
  },

  actions: {
    async INFO_WALLET({ commit, dispatch, rootState }, account) {
      const blockchainID = rootState.TP.chainTypes[account.networkUnique]
      const walletName = account.name ? account.name : account.publicKey
      const walletID = Storage.GET_STORAGE(walletName)

      if (walletID) {
        console.log(walletID)
        // store.delete(walletName)
        dispatch('GET_TOKEN_LIST', walletID)
        return false
      }

      addWallet({
        device_id: getUUid(),
        blockchain_id: blockchainID,
        wallet_name: walletName,
        password: '',
        confirm_password: '',
        tips: '',
        address: account.publicKey
      }).then(res => {
        if (res.result === 0) {
          commit('WALLET_MAPS', {
            walletID: res.data,
            walletName,
            ...account
          })

          setTimeout(() => {
            dispatch('GET_TOKEN_LIST', res.data)
          }, 2000)
        }
      })
    },

    async GET_TOKEN_LIST({ commit }, walletID) {
      getTokenList({
        start: 0,
        count: 2000,
        wallet_id: walletID
      }).then(res => {
        if (res.result === 0) {
          commit('ASSET_TOKEN_INFO', res.data)
        }
      })
    },

    async GET_TRANSACTION_ACTION({ commit, rootState }, payload) {
      const blockchainID = rootState.TP.chainTypes[payload.networkUnique]
      const walletName = payload.name ? payload.name : payload.publicKey
      getTransactionAction({
        page: 1,
        count: 1000,
        symbol: payload.symbol,
        search: payload.search,
        code: payload.account,
        account: walletName,
        //记录类型：0--全部， 1--转入， 2--转出
        type: payload.type,
        // search: '',
        blockchain_id: blockchainID
        // sort: 'desc',
        // new_way: 'new'
      }).then(res => {
        if (res.result === 0) {
          commit('TRANSACTION_ACTION_LIST', res.data)
          // console.log(res.data, 'transaction actions')
        }
      })
    }
  }
}

export default Wallet
