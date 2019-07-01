import DApp from './modules/DApp'

const TP = {
    state: {
        ...DApp.state,
        currentLanguage: 'zh-Hans',
    },

    getters: {
        ...DApp.getters,
        currentLanguage: state => state.currentLanguage
    },

    mutations: {
        ...DApp.mutations
    },

    actions: {
        ...DApp.actions
    },

    modules: {

    }
}

export default TP
