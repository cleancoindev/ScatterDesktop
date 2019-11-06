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

const precision = item => {
  if (item.decimal > 0) return item.decimal
  if (item.precision > 0) return item.precision
}

const toNonExponential = num => {
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

const Wallet = {
  state: {
    walletMaps: {},
    assetTokenInfo: {
      tokens: [],
      total_asset: 0,
      unit: '$'
    },
    // transactionActionList: [],
    currentWalletTokenInfo: {}
  },

  getters: {
    walletMaps: state => state.walletMaps,
    assetTokenInfo: state => state.assetTokenInfo,
    // transactionActionList: state => state.transactionActionList,
    currentWalletId: (state, getters) => {
      const walletName = getters.currentAccount.name
        ? getters.currentAccount.name
        : getters.currentAccount.publicKey

      return Storage.GET_STORAGE(walletName, 'sessionStorage')
    },
    currentBlockChainId: (state, getters) => {
      return getters.chainTypes[getters.currentAccount.networkUnique]
    },
    currentWalletTokenInfo: state => state.currentWalletTokenInfo,
    currentWalletName: (state, getters) => {
      return getters.currentAccount.name
        ? getters.currentAccount.name
        : getters.currentAccount.publicKey
    }
  },

  mutations: {
    WALLET_MAPS(state, payload) {
      const { walletID, walletName } = payload

      Storage.SET_STORAGE(
        {
          key: walletName,
          value: walletID
        },
        'sessionStorage'
      )
    },

    ASSET_TOKEN_INFO(state, assetTokenInfo) {
      state.assetTokenInfo = assetTokenInfo
    },

    // TRANSACTION_ACTION_LIST(state, transactionActionList) {
    //   state.transactionActionList = transactionActionList
    // },

    CURRENT_WALLET_TOKEN_INFO(state, currentWalletTokenInfo) {
      state.currentWalletTokenInfo = currentWalletTokenInfo
    }
  },

  actions: {
    async INFO_WALLET({ commit, dispatch, rootState }, account) {
      const blockchainID = rootState.TP.chainTypes[account.networkUnique]
      const walletName = account.name ? account.name : account.publicKey
      const walletID = Storage.GET_STORAGE(walletName, 'sessionStorage')

      if (walletID) {
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

          dispatch('GET_TOKEN_LIST', res.data)

          // setTimeout(() => {
          //   dispatch('GET_TOKEN_LIST', res.data)
          // }, 2000)
        }
      })
    },

    async GET_TOKEN_LIST({ commit, rootGetters }, walletID) {
      getTokenList({
        start: 0,
        count: 200,
        wallet_id: walletID
      }).then(res => {
        if (res.result === 0) {
          res.data.tokens.forEach(token => {
            token.precision = precision(token)
            if (
              rootGetters.currentBlockChainId === 1 ||
              rootGetters.currentBlockChainId === 10
            ) {
              token.balance = toNonExponential(
                parseFloat(token.balance / `1e${token.precision}`)
              )
            }

            token.price_usd = parseFloat(token.price_usd).toFixed(2)
          })

          res.data.balance = `${res.data.unit} ${res.data.total_asset.toFixed(
            2
          )}`

          commit('ASSET_TOKEN_INFO', res.data)
        }
      })
    }

    // async GET_TRANSACTION_ACTION({ commit, rootState, rootGetters }, payload) {
    //   const blockchainID = rootState.TP.chainTypes[payload.networkUnique]
    //   const walletName = payload.name ? payload.name : payload.publicKey

    //   const form = {
    //     page: payload.page,
    //     count: 1000,
    //     symbol: payload.symbol,
    //     search: payload.search,
    //     code: payload.account,
    //     account: walletName,
    //     address: walletName,
    //     // 记录类型：0--全部， 1--转入， 2--转出
    //     type: payload.type,
    //     blockchain_id: blockchainID
    //   }

    //   if (rootGetters.currentBlockChainId === 1) {
    //     delete form.account
    //   } else {
    //     delete form.address
    //   }

    //   getTransactionAction(form).then(res => {
    //     if (res.result === 0 && res.data) {
    //       const filterAction = action => {
    //         switch (rootGetters.currentBlockChainId) {
    //           case 1:
    //             action.quantity = toNonExponential(
    //               parseFloat(action.value / `1e${action.decimal}`)
    //             )
    //             action.browser_url = `https://cn.etherscan.com/tx/${
    //               action.hash
    //             }`
    //             break
    //           case 4:
    //             action.quantity = action.count
    //             action.browser_url = `https://www.eosx.io/tx/${action.hid}`
    //             break
    //           case 6:
    //             action.quantity = action.count
    //             action.browser_url = `https://bos.eosx.io/tx/${action.hid}`
    //             break
    //           case 10:
    //             action.quantity = action.asset_nmount / `1e${action.decimal}`

    //             action.browser_url = `https://tronscan.org/#/transaction/${
    //               action.trx_id
    //             }`
    //             break
    //         }
    //         return action
    //       }

    //       const actionList = res.data.map(action => filterAction(action))

    //       commit('TRANSACTION_ACTION_LIST', actionList)
    //     }
    // })
    // }
  }
}

export default Wallet
