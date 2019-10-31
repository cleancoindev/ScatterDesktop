import { getBannerList, getCategoryList, getDAppList } from '../../api/DApp'

const DApp = {
  state: {
    bannerList: [],
    categoryId: '',
    categoryList: [],
    dappList: [],
    dappForm: {
      start: 0,
      count: 40,
      // key: '',
      status: 0,
      // category_id: this.categoryId,
      version: '10.0.0'
    }
  },

  getters: {
    bannerList: state => state.bannerList,
    categoryId: state => state.categoryId,
    categoryList: state => state.categoryList,
    dappList: state => state.dappList
  },

  mutations: {
    BANNER_LIST: (state, bannerList) => (state.bannerList = bannerList),
    CATEGORY_ID: (state, categoryId) => (state.categoryId = categoryId),
    CATEGORY_LIST: (state, categoryList) => (state.categoryList = categoryList),
    DAPP_FORM(state, dappForm) {
      const { type } = dappForm
      switch (type) {
        case 'reset':
          state.dappForm = {
            start: 0,
            count: 40,
            status: 0,
            version: '10.0.0'
          }
          break
        case 'update':
          state.dappForm.start += 40
          break
      }
    },
    DAPP_LIST: (state, list) => (state.dappList = list)
  },

  actions: {
    async GET_CATEGORY_ID({ commit }, categoryId) {
      commit('CATEGORY_ID', categoryId)
    },

    async GET_BANNER_LIST({ commit, rootGetters }) {
      return new Promise((resolve, reject) => {
        getBannerList({
          start: 0,
          count: 10,
          lang: rootGetters.tpCurrentLanguage,
          status: 0
        })
          .then(res => {
            if (res.result === 0) {
              const bannerList = res.data.filter(
                data => data.object.url.indexOf('http') !== -1
              )
              commit('BANNER_LIST', bannerList)
            }
            resolve(res)
          })
          .catch(err => reject(err))
      })
    },

    async GET_CATEGORY_LIST({ commit, rootGetters }, payload) {
      return new Promise((resolve, reject) => {
        getCategoryList({
          lang: rootGetters.tpCurrentLanguage
        })
          .then(res => {
            if (res.result === 0) {
              res.data.sort((a, b) => {
                return a['m_index'] - b['m_index']
              })

              const categoryList = res.data.filter(
                data => data.category_type === 0
              )
              // categoryList.unshift({
              //     hid: -1,
              //     title: '全部'
              // });
              commit('CATEGORY_LIST', categoryList)
              commit('CATEGORY_ID', -1)
              commit('DAPP_FORM', { type: 'reset' })
            }
            resolve(res)
          })
          .catch(err => reject(err))
      })
    },

    async GET_DAPP_LIST({ commit, state, rootGetters }, form = {}) {
      return new Promise((resolve, reject) => {
        getDAppList({
          key: form.key,
          ...state.dappForm,
          lang: rootGetters.tpCurrentLanguage,
          category_id: state.categoryId
        })
          .then(res => {
            if (res.result === 0) {
              if (res.data !== null) {
                commit('DAPP_FORM', { type: 'update' })
                if (state.dappForm.start > 0) {
                  commit('DAPP_LIST', [...state.dappList, ...res.data])
                }
              }
            }
            resolve(res)
          })
          .catch(err => reject(err))
      })
    },

    async DAPP_SIGNS({ commit, state }, sign) {
      console.log(sign)
    }
  }
}

export default DApp
