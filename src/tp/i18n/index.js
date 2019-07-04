import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zh from './languages/zh';
import en from './languages/en';
import { store} from '../../store/store';

Vue.use(VueI18n);

export default new VueI18n({
    locale: store.getters.currentLanguage,
    messages: {
        zh,
        en
    }
});
