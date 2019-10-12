import fetch from '../utils/Request'
import { Wallet } from './url'

export function addWallet(data) {
  return fetch.post(Wallet.ADD_WALLET, data)
}

export function getTokenList(params) {
  return fetch.get(Wallet.GET_TOKEN_LIST, { params })
}

export function getAllTokenList(params) {
  return fetch.get(Wallet.GET_ALL_TOKEN_LIST, { params })
}

export function getTransactionAction(params) {
  return fetch.get(Wallet.GET_TRANSACTION_ACTION, { params })
}
