<template>
    <section class="SettingsAboutUs text-center">
        <section class="text-center">
            <img style="width: 72px;" src="../../assets/images/settings/logo.png" alt="">
        </section>

        <h3 class="ft-20" style="margin: 25px 0 15px;">v {{clientVersion}}</h3>

        <p class="c-2e294e ft-14">
            {{$t('TP.ABOUT.AboutUsText')}}
        </p>

        <section class="link-wrap text-center">
            <figure class="link-list pointer"
                    v-for="(item, index) in linkList"
                    :key="index"
                    @click="linkGo(item)">
                <div class="link-img"><img :src="item.img" alt=""></div>
                <div class="link-title ft-12">{{item.title}}</div>
            </figure>
        </section>
    </section>
</template>

<script>
    import ElectronHelpers from '../../../util/ElectronHelpers'

    export default {
        name: 'SettingsAboutUs',
        data() {
            return {
                // clientVersion: ''
            }
        },
        computed: {
            linkList() {
                return [
                    {
                        title: 'Twitter',
                        img: require('../../assets/images/settings/twitter.png'),
                        url: 'https://twitter.com/TokenPocket_TP'
                    },
                    {
                        title: 'Facebook',
                        img: require('../../assets/images/settings/facebook.png'),
                        url: 'https://www.facebook.com/TokenPocket'
                    },
                    {
                        title: 'Telegram',
                        img: require('../../assets/images/settings/telegram.png'),
                        url: 'https://t.me/tokenPocket_en'
                    },
                    {
                        title: 'WeChat',
                        img: require('../../assets/images/settings/wechat.png'),
                        url: 'https://help.mytokenpocket.vip/hc/zh-cn/articles/360020216792-%E5%AE%A2%E6%9C%8D%E5%BE%AE%E4%BF%A1'
                        // qr: '',
                        // local: true
                    }
                ]
            }
        },

        methods: {
            linkGo(item) {
                if (!item.local) {
                    ElectronHelpers.openLinkInBrowser(item.url)
                }
            }
        }

    }
</script>

<style lang="scss" scoped>
    .SettingsAboutUs {
        background: #fff;
        padding: 40px 60px 60px;
        border-radius: 16px;
    }

    .link-wrap {
        display: flex;
        margin-top: 26px;
        .link-list {
            flex: 1;
            .link-img {
                img {
                    width: 44px;
                    height: 44px;
                }
            }

            .link-title {

            }
        }
    }


</style>
