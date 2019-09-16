// import { MOCK_ELECTRON, RUNNING_TESTS } from '../src/util/TestingHelper'

let electron = require('electron')
// console.log(electron)

const { remote, BrowserWindow } = electron

// const { BrowserWindow } = remote

// import { mainUrl } from '../electron'

const CreateDAppWebView = url => {
  const webview = new BrowserWindow({
    backgroundColor: '#FFFFFF',
    width: 600,
    height: 400,
    frame: false,
    radii: [5, 5, 5, 5],
    icon: 'assets/favicon.png',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      webviewTag: true
    }
  })

  webview.loadURL(url)
}

module.exports = CreateDAppWebView
