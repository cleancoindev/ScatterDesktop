<template>
    <section class="setting-language text-center">
        <section>
            <img style="width: 72px" src="../../assets/images/settings/language-logo.png" alt="">
        </section>

        <section class="ft-16 c-232538" style="margin-top: 40px;margin-bottom: 30px">
            {{$t('TP.GENERIC.Language')}}
        </section>

        <section class="select-language">
            <el-select v-model="languages" @change="selectLanguage">
                <el-option v-for="(item, index) in names"
                           :key="index"
                           :label="item.label"
                           :value="item.value">
                </el-option>
            </el-select>
        </section>

    </section>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import * as Actions from '../../../store/constants';

  export default {
    data() {
      return {
        languages: '',
        names: [
          {
            label: '中文',
            value: 'zh'
          },
          {
            label: 'English',
            value: 'en'
          }
        ]
      }
    },
    computed: {
      ...mapState([
        'scatter'
      ]),
      ...mapGetters([
        'networks',
        // 'language',
        'currentLanguage'
      ]),
      // selectedLanguage() {
      //   return this.scatter.settings.language
      // }
    },

    created() {
      this.languages = this.currentLanguage;
    },

    methods: {
      selectLanguage(language) {
        this.$i18n.locale = language
        this.$store.dispatch('SET_CURRENT_LANGUAGE', language)
      },

      ...mapActions([
        Actions.SET_SCATTER,
        Actions.SET_LANGUAGE
      ])
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../../styles/variables";

    .setting-language {
        background: #fff;
        padding: 40px 40px 100px;
        border-radius: 16px;
    }

    /deep/ .el-input__inner {
        background: #F3F4F8;
        border: 0;
        border-radius: 6px;
        width: 399px;
        color: #232538;
        font-size: 16px;
    }

    /deep/ .el-select .el-input .el-select__caret {
        color: #232538;
    }

</style>
