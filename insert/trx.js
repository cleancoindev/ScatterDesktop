// const TronWeb = require('tronweb')
// const { HttpProvider } = TronWeb.providers
const endPoint = 'https://api.trongrid.io'
const ipc = window.require('electron').ipcRenderer
const remote = window.require('electron').remote
const axios = require('axios')
const { ipcMain } = remote

console.log(axios, 'axios')
console.log(ipc, 'ipc')
console.log(remote, 'remote')

// class ProxiedProvider extends HttpProvider {
//   constructor() {
//     super('http://127.0.0.1')

//     console.info('Provider initialised')

//     this.ready = false
//     this.queue = []
//   }

//   configure(url) {
//     console.info('Received new node:', url)

//     this.host = url
//     this.instance = axios.create({
//       baseURL: url,
//       timeout: 30000
//     })

//     this.ready = true

//     while (this.queue.length) {
//       const { args, resolve, reject } = this.queue.shift()

//       this.request(...args)
//         .then(resolve)
//         .catch(reject)
//         .then(() => console.info(`Completed the queued request to ${args[0]}`))
//     }
//   }

//   request(endpoint, payload = {}, method = 'get') {
//     if (!this.ready) {
//       console.info(`Request to ${endpoint} has been queued`)

//       return new Promise((resolve, reject) => {
//         this.queue.push({
//           args: [endpoint, payload, method],
//           resolve,
//           reject
//         })
//       })
//     }

//     return super.request(endpoint, payload, method).then(res => {
//       const response = res.transaction || res

//       Object.defineProperty(response, '__payload__', {
//         writable: false,
//         enumerable: false,
//         configurable: false,
//         value: payload
//       })

//       return res
//     })
//   }
// }

// var injectPromise = function injectPromise(func) {
//   for (
//     var _len = arguments.length,
//       args = new Array(_len > 1 ? _len - 1 : 0),
//       _key = 1;
//     _key < _len;
//     _key++
//   ) {
//     args[_key - 1] = arguments[_key]
//   }

//   return new Promise(function(resolve, reject) {
//     func.apply(
//       void 0,
//       args.concat([
//         function(err, res) {
//           if (err) reject(err)
//           else resolve(res)
//         }
//       ])
//     )
//   })
// }

// var isFunction = function isFunction(obj) {
//   return typeof obj === 'function'
// }

// const trxHook = {
//   proxiedMethods: {
//     setAddress: false,
//     sign: false
//   },
//   init: function init() {
//     var _this = this
//     ipcMain.on('CONTACT_TRON_WEB', (event, account) => {
//       this._bindTronWeb()
//       // console.log(account, 'CONTACT_TRON_WEB')
//       this.setAddress({
//         address: account.publicKey,
//         name: account.name || '',
//         type: 0
//       })

//       _this.setNode({
//         fullNode: endPoint,
//         solidityNode: endPoint,
//         eventServer: endPoint
//       })
//     })
//   },
//   _bindTronWeb: function _bindTronWeb() {
//     console.log('_bindTronWeb')
//     var _this2 = this

//     // console.log(window.tronWeb, 'window.tronWeb ')
//     if (window.tronWeb) {
//       console.log(
//         'TronWeb is already initiated. TPTron will overwrite the current instance'
//       )
//       return
//     }

//     var tronWeb = new TronWeb(
//       new ProxiedProvider(),
//       new ProxiedProvider(),
//       new ProxiedProvider()
//     )
//     this.proxiedMethods = {
//       setAddress: tronWeb.setAddress.bind(tronWeb),
//       sign: tronWeb.trx.sign.bind(tronWeb)
//     }
//     ;[
//       'setPrivateKey',
//       'setAddress',
//       'setFullNode',
//       'setSolidityNode',
//       'setEventServer'
//     ].forEach(function(method) {
//       return (tronWeb[method] = function() {
//         return new Error('TPTron has disabled this method')
//       })
//     })

//     tronWeb.trx.sign = function() {
//       return _this2.sign.apply(_this2, arguments)
//     }

//     window.tronWeb = tronWeb
//   },
//   setAddress: function setAddress(_ref) {
//     console.log('setAddress')
//     var address = _ref.address,
//       name = _ref.name,
//       type = _ref.type

//     if (!tronWeb.isAddress(address)) {
//       tronWeb.defaultAddress = {
//         hex: false,
//         base58: false
//       }
//     } else {
//       this.proxiedMethods.setAddress(address)
//       tronWeb.defaultAddress.name = name
//       tronWeb.defaultAddress.type = type
//     }

//     tronWeb.ready = true
//   },
//   setNode: function setNode(node) {
//     // debugger
//     console.log('setNode TPTron: New node configured')
//     tronWeb.fullNode.configure(node.fullNode)
//     tronWeb.solidityNode.configure(node.solidityNode)
//     tronWeb.eventServer.configure(node.eventServer)
//   },
//   sign: function sign(transaction) {
//     var privateKey =
//       arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
//     var useTronHeader =
//       arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true
//     var callback =
//       arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false

//     if (isFunction(privateKey)) {
//       callback = privateKey
//       privateKey = false
//     }

//     if (isFunction(useTronHeader)) {
//       callback = useTronHeader
//       useTronHeader = true
//     }

//     if (!callback)
//       return injectPromise(
//         this.sign.bind(this),
//         transaction,
//         privateKey,
//         useTronHeader
//       )
//     if (privateKey)
//       return this.proxiedMethods.sign(
//         transaction,
//         privateKey,
//         useTronHeader,
//         callback
//       )
//     if (!transaction) return callback('Invalid transaction provided')
//     if (!tronWeb.ready) return callback('User has not unlocked wallet') // sign

//     // console.log('sign')
//     var address = tronWeb.defaultAddress.base58
//     // console.log('transaction:', transaction)
//     // console.log('useTronHeader:', useTronHeader)
//     // console.log('address', address)

//     ipc.send(
//       'DAPP_SIGNS',
//       JSON.stringify({
//         transaction,
//         useTronHeader,
//         address,
//         origin: window.location.host,
//         payload: transaction.__payload__
//       })
//     )

//     ipcMain.on('REQUEST_SIGNATURE', (event, arg) => {
//       // console.log(arg, 'on REQUEST_SIGNATURE')
//       callback(null, arg)
//     })
//   }
// }

// trxHook.init()
