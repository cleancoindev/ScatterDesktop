import Plugin from '../Plugin'
import * as Actions from '../../models/api/ApiActions'
import * as PluginTypes from '../PluginTypes'
import { Blockchains } from '../../models/Blockchains'
import Network from '../../models/Network'
import KeyPairService from '../../services/secure/KeyPairService'
import PopupService from '../../services/utility/PopupService'
import { Popup } from '../../models/popups/Popup'
import TronWeb from 'tronweb'
//import * as utils from 'tronweb/src/utils/crypto';
const ethUtil = require('ethereumjs-util')
const toBuffer = key => ethUtil.toBuffer(ethUtil.addHexPrefix(key))
import Token from '../../models/Token'
import HardwareService from '../../services/secure/HardwareService'
import { localizedState } from '../../localization/locales'
import LANG_KEYS from '../../localization/keys'
import StoreService from '../../services/utility/StoreService'
import TokenService from '../../services/utility/TokenService'

import PermissionService from '../../services/apps/PermissionService'
import Identity from '../../models/Identity'
import Error from '../../models/errors/Error'
import ResourceService from '../../services/blockchain/ResourceService'

import { remote } from '../../util/ElectronHelpers'
const NotificationService = remote.getGlobal('appShared').NotificationService

let utils
// const utils = tronWeb.utils;

let cachedInstances = {}
const getCachedInstance = network => {
  if (cachedInstances.hasOwnProperty(network.unique()))
    return cachedInstances[network.unique()]
  else {
    const provider = new TronWeb.providers.HttpProvider(network.fullhost())
    const tronWeb = new TronWeb(provider, provider, network.fullhost())
    cachedInstances[network.unique()] = tronWeb
    return tronWeb
  }
}

const EXPLORER = {
  name: 'Tronscan',
  account: 'https://tronscan.org/#/address/{x}',
  transaction: 'https://tronscan.org/#/transaction/{x}',
  block: 'https://tronscan.org/#/block/{x}'
}

export default class TRX extends Plugin {
  constructor() {
    super(Blockchains.TRX, PluginTypes.BLOCKCHAIN_SUPPORT)
  }

  init() {
    const DUMMY_NET = 'https://api.shasta.trongrid.io'
    const provider = new TronWeb.providers.HttpProvider(DUMMY_NET)
    const tronWeb = new TronWeb(provider, provider, DUMMY_NET)
    utils = tronWeb.utils
    // window.tronWeb = tronWeb
  }

  bustCache() {
    cachedInstances = {}
  }

  defaultExplorer() {
    return EXPLORER
  }

  accountFormatter(account) {
    return `${account.publicKey}`
  }

  returnableAccount(account) {
    return { address: account.publicKey, blockchain: Blockchains.TRX }
  }

  contractPlaceholder() {
    return '0x.....'
  }

  recipientLabel() {
    return localizedState(LANG_KEYS.GENERIC.Address)
  }

  checkNetwork(network) {
    return Promise.race([
      new Promise(resolve => setTimeout(() => resolve(null), 2000)),
      //TODO:
      new Promise(resolve => setTimeout(() => resolve(true), 10))
    ])
  }

  getEndorsedNetwork() {
    return new Network(
      'Tron Mainnet',
      'https',
      'api.trongrid.io',
      443,
      Blockchains.TRX,
      '1'
    )
  }

  isEndorsedNetwork(network) {
    const endorsedNetwork = this.getEndorsedNetwork()
    return (
      network.blockchain === Blockchains.TRX &&
      network.chainId === endorsedNetwork.chainId
    )
  }

  async getChainId(network) {
    return 1
  }

  usesResources() {
    return false
  }

  hasAccountActions() {
    return false
  }

  accountsAreImported() {
    return false
  }

  isValidRecipient(address) {
    return utils.crypto.isAddressValid(address)
  }

  privateToPublic(privateKey) {
    if (typeof privateKey === 'string')
      privateKey = this.hexPrivateToBuffer(privateKey)
    return utils.crypto.getBase58CheckAddress(
      utils.crypto.getAddressFromPriKey(privateKey)
    )
  }

  validPrivateKey(privateKey) {
    const reg = new RegExp(/[0-9a-fA-F]{64}/)
    return reg.test(privateKey) && ethUtil.isValidPrivate(toBuffer(privateKey))
  }

  validPublicKey(address) {
    return utils.crypto.isAddressValid(address)
  }

  bufferToHexPrivate(buffer) {
    return new Buffer(buffer).toString('hex')
  }

  hexPrivateToBuffer(privateKey) {
    return Buffer.from(privateKey, 'hex')
  }

  hasUntouchableTokens() {
    return false
  }

  async balanceFor(account, token) {
    const tron = getCachedInstance(account.network())
    const clone = token.clone()
    if (token.uniqueWithChain() === this.defaultToken().uniqueWithChain()) {
      const bal = await tron.trx.getBalance(account.publicKey)
      clone.amount = tron
        .toBigNumber(bal)
        .div(1000000)
        .toFixed(6)
        .toString(10)
    }

    return clone
  }

  async balancesFor(account, tokens) {
    const tron = getCachedInstance(account.network())
    const formatBalance = n =>
      tron
        .toBigNumber(n)
        .div(1000000)
        .toFixed(6)
        .toString(10)

    const trx = this.defaultToken()
    const { asset, balance } = await Promise.race([
      new Promise(resolve =>
        setTimeout(() => resolve({ asset: [], balance: 0 }), 2000)
      ),
      tron.trx
        .getAccount(account.sendable())
        .catch(() => ({ asset: [], balance: 0 }))
    ])
    trx.amount = formatBalance(balance)
    if (!asset) return [trx]
    const altTokens = asset.map(({ key: symbol, value }) => {
      return Token.fromJson({
        blockchain: Blockchains.TRX,
        contract: '',
        symbol,
        name: symbol,
        decimals: this.defaultDecimals(),
        amount: formatBalance(value),
        chainId: account.network().chainId
      })
    })

    return [trx].concat(altTokens)
  }

  defaultDecimals() {
    return 6
  }

  defaultToken() {
    return new Token(
      Blockchains.TRX,
      'trx',
      'TRX',
      'TRX',
      this.defaultDecimals(),
      '1'
    )
  }

  actionParticipants(payload) {
    return payload.transaction.participants
  }

  async transfer({
    account,
    to,
    amount,
    token,
    promptForSignature = true,
    type
  }) {
    amount = TokenService.formatAmount(amount, token)
    const { symbol } = token
    return new Promise(async (resolve, reject) => {
      const tron = getCachedInstance(account.network())

      tron.trx.sign = async signargs => {
        const transaction = {
          transaction: signargs,
          participants: [account.publicKey]
        }
        const payload = {
          transaction,
          blockchain: Blockchains.TRX,
          network: account.network(),
          requiredFields: {}
        }
        return promptForSignature
          ? await this.signerWithPopup(payload, account, reject)
          : await this.signer(payload, account.publicKey, false, false, account)
      }

      let unsignedTransaction

      // SENDING TRX
      // if (token.unique() === this.defaultToken().unique()) {
      if (type === 0) {
        unsignedTransaction = await tron.transactionBuilder.sendTrx(
          to,
          amount,
          account.publicKey
        )
      }

      // SENDING ALT TOKEN
      else {
        tron.setAddress(account.sendable())
        unsignedTransaction = await tron.transactionBuilder.sendToken(
          to,
          amount,
          symbol
        )
      }

      const signed = await tron.trx
        .sign(unsignedTransaction)
        .then(x => ({ success: true, result: x }))
        .catch(error => ({ success: false, result: error }))

      if (!signed.success) return resolve({ error: signed.result })
      else {
        const sent = await tron.trx
          .sendRawTransaction(signed.result)
          .then(x => x.result)
        resolve(sent ? signed.result : { error: 'Failed to send.' })
      }
    })
  }

  async signer(
    payload,
    publicKey,
    arbitrary = false,
    isHash = false,
    account = null
  ) {
    if (account && KeyPairService.isHardware(publicKey))
      return await HardwareService.sign(account, payload)

    let privateKey = await KeyPairService.publicToPrivate(publicKey)
    if (!privateKey) return

    if (typeof privateKey !== 'string')
      privateKey = this.bufferToHexPrivate(privateKey)

    this.transferMessageParser(payload)

    return utils.crypto.signTransaction(
      privateKey,
      payload.transaction.transaction
    )
  }

  async signerWithPopup(payload, account, rejector) {
    return new Promise(async resolve => {
      payload.messages = await this.requestParser(payload)
      payload.identityKey = StoreService.get().state.scatter.keychain.identities[0].publicKey
      payload.participants = [account]
      payload.network = account.network()
      payload.origin = 'TokenPocket'
      const request = {
        payload,
        origin: payload.origin,
        blockchain: Blockchains.TRX,
        requiredFields: {},
        type: Actions.SIGN,
        id: 1
      }

      PopupService.push(
        Popup.popout(
          request,
          async ({ result }) => {
            if (!result || (!result.accepted || false)) {
              return rejector({ error: 'Could not get signature' })
            }

            // let signature = null
            // if (KeyPairService.isHardware(account.publicKey)) {
            //   signature = await HardwareService.sign(account, payload)
            // } else {
            //   signature = await this.signer(payload, account.publicKey)
            // }

            const signature = await this.signer(payload, account.publicKey)

            if (!signature) {
              return rejector({ error: 'Could not get signature' })
            }

            resolve(signature)
          },
          true
        )
      )
    })
  }

  transferMessageParser(payload) {
    const network = Network.fromJson(payload.network)
    const transaction = payload.transaction.transaction.raw_data
    const tron = getCachedInstance(network)

    transaction.contract.forEach(contract => {
      const data = contract.parameter.value

      if (data.amount) {
        data.amount = parseFloat(
          TokenService.formatAmount(
            parseFloat(data.amount),
            this.defaultToken()
          )
        )
      }

      if (data.owner_address) {
        data.owner_address = tron.address.toHex(data.owner_address)
      }

      if (data.to_address) {
        data.to_address = tron.address.toHex(data.to_address)
      }
    })
  }

  async requestParser(transaction, abiData) {
    const network = Network.fromJson(transaction.network)
    transaction = transaction.transaction.transaction.raw_data

    const tron = getCachedInstance(network)
    return transaction.contract.map(contract => {
      let data = contract.parameter.value
      let address = null

      // Contract format
      if (data.contract_address) {
        const isHexAddress = tron.utils.isHex(data.contract_address)
        isHexAddress
          ? (address = tron.address.fromHex(data.contract_address))
          : (address = data.contract_address)
      } else {
        address = 'system'
      }

      // Transfer address format
      if (data.owner_address) {
        data.owner_address = tron.address.fromHex(data.owner_address)
      }

      if (data.to_address) {
        data.to_address = tron.address.fromHex(data.to_address)
      }

      if (data.amount) {
        data.amount = `${parseFloat(tron.fromSun(data.amount)).toFixed(
          this.defaultDecimals()
        )} TRX`
      }

      const quantity = data.hasOwnProperty('call_value')
        ? {
            paying: `${parseFloat(tron.fromSun(data.call_value)).toFixed(
              this.defaultDecimals()
            )} TRX`
          }
        : {}

      let methodABI
      if (abiData) {
        const { abi, method } = abiData
        methodABI = abi.find(x => x.name === method)
        if (!methodABI)
          throw Error.signatureError(
            'no_abi_method',
            'No method signature on the abi you provided matched the data for this transaction'
          )
        const names = methodABI.inputs.map(x => x.name)
        const types = methodABI.inputs.map(x => x.type)

        data = tron.utils.abi.decodeParams(names, types, data.data, true)
        data = Object.assign(data, quantity)

        Object.keys(data).map(key => {
          if (tron.utils.isBigNumber(data[key]))
            data[key] = data[key].toString()
        })
      }

      return {
        data,
        code: address,
        type: methodABI ? methodABI.name : 'transfer'
      }
    })
  }

  async dappSign(datas) {
    return new Promise(async (resolve, rejecet) => {
      const { transaction, origin, address, account } = datas
      const tron = getCachedInstance(account.network())
      const { contract_address } = datas.payload

      const contracts = transaction.raw_data.contract
      const parameterData = contracts.find(
        item => item.parameter.value.contract_address === contract_address
      )
      const parameterValueData = parameterData.parameter.value.data
      const addressFromHex = tron.address.fromHex(contract_address)

      let abi = null
      await tron.trx.getContract(addressFromHex).then(res => {
        abi = res.abi.entrys
      })

      let contract = null
      await tron
        .contract(abi)
        .at(addressFromHex)
        .then(res => {
          contract = res
        })

      const parseSignData = contract.decodeInput(parameterValueData)

      const payload = {
        abi: {
          abi,
          address: contract_address,
          method: parseSignData.name
        },
        origin,
        requiredFields: '',
        blockchain: 'trx',
        network: {
          blockchain: 'trx',
          chainId: '1',
          host: 'api.trongrid.io',
          name: 'Tron Mainnet',
          port: 443,
          protocol: 'https'
        },
        transaction: {
          transaction
        }
      }

      const participants = [account]
      payload.identityKey = address
      payload.network = Network.fromJson(payload.network)
      payload.participants = [address]

      payload.messages = await this.requestParser(payload, payload.abi)

      const sendableRequest = {}
      sendableRequest.type = 'requestSignature'
      sendableRequest.appkey = null
      sendableRequest.payload = {
        messages: payload.messages,
        network: payload.network,
        origin: origin,
        participants,
        requiredFields: payload.requiredFields
      }

      PopupService.push(
        Popup.popout(sendableRequest, async res => {
          const { result } = res
          if (!result) {
            return rejecet(
              Error.signatureError(
                'signature_rejected',
                'User rejected the signature request'
              )
            )
          }

          const signatures = await this.signer(payload, address)

          resolve(signatures)
        })
      )
    })
  }
}
