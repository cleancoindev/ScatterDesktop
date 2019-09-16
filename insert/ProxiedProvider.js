const TronWeb = require('tronweb')
const axios = require('axios')

const { HttpProvider } = TronWeb.providers

class ProxiedProvider extends HttpProvider {
  constructor() {
    super('http://127.0.0.1')

    console.info('Provider initialised')

    this.ready = false
    this.queue = []
  }

  configure(url) {
    console.info('Received new node:', url)

    this.host = url
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000
    })

    this.ready = true

    while (this.queue.length) {
      const { args, resolve, reject } = this.queue.shift()

      this.request(...args)
        .then(resolve)
        .catch(reject)
        .then(() => console.info(`Completed the queued request to ${args[0]}`))
    }
  }

  request(endpoint, payload = {}, method = 'get') {
    if (!this.ready) {
      console.info(`Request to ${endpoint} has been queued`)

      return new Promise((resolve, reject) => {
        this.queue.push({
          args: [endpoint, payload, method],
          resolve,
          reject
        })
      })
    }

    return super.request(endpoint, payload, method).then(res => {
      const response = res.transaction || res

      Object.defineProperty(response, '__payload__', {
        writable: false,
        enumerable: false,
        configurable: false,
        value: payload
      })

      return res
    })
  }
}

module.exports = ProxiedProvider
