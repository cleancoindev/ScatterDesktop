<template>
    <div id="dapp" class="TP-DApp bg-color-F6F8FA">
        <DAppBanner :banner-list="bannerList"/>
        <DAppList :category-list="categoryList" :dapp-list="dappList"/>
    </div>

</template>

<script>
    import { mapGetters } from 'vuex';
    import DAppBanner from './banner';
    import DAppList from './dapp';
    import KeyPairService from '../../../services/secure/KeyPairService';
    import _ from 'underscore';

    export default {
        name: 'DApp',
        components: {
            DAppBanner,
            DAppList
        },
        data() {
            return {
                dappFormKey: '',
                DAppEl: null,
                throttle: null
            };
        },
        computed: {
            ...mapGetters([
                'bannerList',
                'categoryList',
                'dappList',
                'keypairs',
                'currentLanguage',
                'categoryId'
            ])
        },

        async created() {
            // 测试使用删除keypair
            // this.keypairs.map(async keypair => {
            //     await KeyPairService.removeKeyPair(keypair);
            // });

            await this.$store.dispatch('GET_BANNER_LIST');
            await this.$store.dispatch('GET_CATEGORY_LIST');
            this.$store.commit('DAPP_FORM', { type: 'reset' });
            this.$store.commit('DAPP_LIST', []);
            await this.$store.dispatch('GET_DAPP_LIST');

        },

        beforeDestroy() {
            if (this.DAppEl !== null) this.DAppEl.removeEventListener('scroll', this.throttle)
        },

        mounted() {
            this.DAppEl = document.querySelector('#dapp');

            if (this.DAppEl) {
                this.throttle = _.throttle(async () => {
                    const Pos = this.DAppEl.scrollHeight - this.DAppEl.scrollTop - this.DAppEl.clientHeight;
                    if (Pos < 50) {
                        await this.$store.dispatch('GET_DAPP_LIST', { key: this.dappFormKey });
                    }
                }, 1000);
                this.DAppEl.addEventListener('scroll', this.throttle);
            }
        },

        methods: {}
    };
</script>

<style lang="scss" scoped>
    #dapp {
        height: calc(100%);
        overflow-y: scroll;
    }
</style>
