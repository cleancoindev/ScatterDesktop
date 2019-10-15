import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import { store } from '../../store/store'

Vue.use(VueI18n)

export default new VueI18n({
  locale: store.getters.currentLanguage,
  messages: {
    zh,
    en
  }
})
