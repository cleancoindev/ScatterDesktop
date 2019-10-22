import PopOut from '../views/PopOut'
import App from '../views/App'
import Login from '../tp/views/Login/index'
import Settings from '../tp/views/Settings/index'
import DApp from '../tp/views/DApp/index'
import Asset from '../tp/views/Asset/index'
import Chat from '../tp/views/IM/index'
import Wallet from '../tp/views/Wallet/index'
import ImportTextKey from '../tp/views/Keypair/ImportKeypair'
import ExportPrivateKey from '../tp/views/Keypair/ExportPrivateKey'
import WebView from '../tp/views/WebView/DApp'
// TODO: These should be uncommented for releases

// import Login from '../views/Login';

// import Settings from '../views/Settings';

// import Apps from '../views/Apps'

// import Assets from '../views/Assets'
// import Wallets from '../views/Wallet'
// import Account from '../views/Account'
// import Items from '../views/Items'
// import Transfer from '../views/Transfer'
// import Exchange from '../views/Exchange'
// import Receive from '../views/Receive'
// import Networks from '../views/Networks'
// import Contacts from '../views/Contacts'
// import Identities from '../views/Identities'
// import Locations from '../views/Locations'
// import Histories from '../views/Histories'

// import RIDL from '../views/RIDL'
// import Purchase from '../views/Purchase'

// TODO: These should be commented out for testing.
// const PopOut  = () => import('../views/PopOut');
// const Login = () => import('../views/Login');
// const Apps = () => import('../views/Apps');
// const App = () => import('../views/App');
// const Assets = () => import('../views/Assets');
// const Wallet = () => import('../views/Wallet');
// const Account = () => import('../views/Account');
// const Items = () => import('../views/Items');
// const Transfer = () => import('../views/Transfer');
// const Exchange = () => import('../views/Exchange');
// const Receive = () => import('../views/Receive');
// const Networks = () => import('../views/Networks');
// const Contacts = () => import('../views/Contacts');
// const Identities = () => import('../views/Identities');
// const Locations = () => import('../views/Locations');
// const Histories = () => import('../views/Histories');
// const Settings = () => import('../views/Settings');
// const RIDL = () => import('../views/RIDL');
// const Purchase = () => import('../views/Purchase');

export const RouteNames = {
  // HOME: 'home',
  // WALLETS: 'wallets',
  // ITEMS: 'items',
  // NETWORKS: 'networks',
  // ASSETS: 'assets',
  // TRANSFER: 'transfer',
  // RECEIVE: 'receive',
  // EXCHANGE: 'exchange',
  // CONTACTS: 'contacts',
  // IDENTITIES: 'identities',
  // LOCATIONS: 'locations',
  // HISTORIES: 'histories',
  // RIDL: 'ridl',
  // PURCHASE: 'purchase',

  // ACCOUNT: 'account',

  POP_OUT: 'popout',
  APP: 'app',
  LOGIN: 'login',
  DAPP: 'DApp',
  CHAT: 'chat',
  ASSET: 'asset',
  WALLET: 'wallet',
  SETTINGS: 'settings',
  IMPORT_TEXT_KEY: 'importTextKey',
  EXPORT_PRIVATE_KEY: 'ExportPrivateKey',
  WEB_VIEW: 'WebView'
}

const RouteViews = {
  // [RouteNames.HOME]: Apps,
  // [RouteNames.WALLETS]: Wallets,
  // [RouteNames.ITEMS]: Items,
  // [RouteNames.NETWORKS]: Networks,
  // [RouteNames.ASSETS]: Assets,
  // [RouteNames.TRANSFER]: Transfer,
  // [RouteNames.RECEIVE]: Receive,
  // [RouteNames.EXCHANGE]: Exchange,
  // [RouteNames.CONTACTS]: Contacts,
  // [RouteNames.IDENTITIES]: Identities,
  // [RouteNames.LOCATIONS]: Locations,
  // [RouteNames.HISTORIES]: Histories,
  // [RouteNames.RIDL]: RIDL,
  // [RouteNames.PURCHASE]: Purchase,
  // [RouteNames.ACCOUNT]: Account,

  // TP
  [RouteNames.APP]: App,
  [RouteNames.POP_OUT]: PopOut,
  [RouteNames.LOGIN]: Login,
  [RouteNames.SETTINGS]: Settings,
  [RouteNames.DAPP]: DApp,
  [RouteNames.ASSET]: Asset,
  [RouteNames.CHAT]: Chat,
  [RouteNames.WALLET]: Wallet,
  [RouteNames.IMPORT_TEXT_KEY]: ImportTextKey,
  [RouteNames.EXPORT_PRIVATE_KEY]: ExportPrivateKey,
  [RouteNames.WEB_VIEW]: WebView
}

const RoutePaths = {
  [RouteNames.HOME]: '/',
  [RouteNames.APP]: '/app/:applink',
  // [RouteNames.ACCOUNT]: '/account/:unique'
}

export class Routing {
  static builder() {
    const routeNames = Object.keys(RouteNames).map(key => RouteNames[key])

    let routesBuilder = {}
    routeNames.forEach(routeName => {
      routesBuilder[routeName] = {
        path: RoutePaths.hasOwnProperty(routeName)
          ? RoutePaths[routeName]
          : `/${routeName}`,
        name: routeName,
        component: RouteViews[routeName]
      }
    })

    return routesBuilder
  }

  static routes() {
    return Object.keys(Routing.builder()).map(
      routeName => Routing.builder()[routeName]
    )
  }

  static isRestricted(routeName) {
    return ![
      RouteNames.LOGIN,
      RouteNames.POP_OUT,
      RouteNames.WEB_VIEW
      // RouteNames.LOAD_FROM_BACKUP
    ].includes(routeName)
  }

  // static hasSidebar(routeName) {
  //   return ![RouteNames.ONBOARDING, RouteNames.POP_OUT].includes(routeName)
  // }
}
