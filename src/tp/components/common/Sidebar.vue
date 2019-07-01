<template>
    <section class="tp-sidebar">
        <section class="Tabs">
            <!-- 账号 -->
            <section ref="account" style="padding: 0 10px;">
                <section class="account text-center">
                    <h4 class="ft-16 c-fff pointer" @click="accountOptions">
<!--                        {{ accountInfo.name }}-->
                        22222
                        <span>
                        <img style="height: 12px" src="../../assets/images/common/array.png" alt="">
                    </span>
                    </h4>
                </section>
            </section>

            <!-- tab 列表 -->
            <section class="tab-wrap">
                <section class="tab-list p-10" v-for="(item, index) in tabList" :key="index">
                    <div class="tab-ctr pointer"
                         :class="{'on': isActive(item.url)}"
                         @click="tabChange(item)">

                        <div class="TP-Font ft-20" :class="[item.icon, `${isActive(item.url) ? 'c-fff' : 'c-818394'}`]"></div>
                        <span>{{item.title}}</span>
                    </div>
                </section>
            </section>

        </section>

        <!-- 账号列表 -->
        <section ref="accountWrap" class="account-wrap" :class="{'show': accountState}">
<!--            <section class="account-search-wrap c-fff text-center ft-20">-->
<!--                <div class="account-search">-->
<!--                    <i class="TP-Iconfont tp-icon-searchx ft-18"></i>-->
<!--                    <input type="search" v-model="searchAccount"/>-->
<!--                </div>-->

<!--            </section>-->

            <!-- 原始账号数据 -->
<!--            <section class="account-main" v-if="!searchAccount">-->
<!--                <section class="account-list c-fff text-center ft-20 pointer"-->
<!--                         v-for="(item, index) in accountList"-->
<!--                         :key="index"-->
<!--                         @click="handleCommand(item)">-->
<!--                    <span>-->
<!--                        <i class="platform-icon" :style="{backgroundImage: `url(${item.networks.icon_url})`}"></i>-->
<!--                        <span>{{item.name}}</span>-->
<!--                    </span>-->
<!--                    <span class="check" :class="{'account-check': item.name === accountInfo.name}"></span>-->
<!--                </section>-->
<!--            </section>-->

            <!-- 搜索账号过滤数据 -->
<!--            <section class="account-main" v-if="searchAccount">-->
<!--                <section class="account-list c-fff text-center ft-20 pointer"-->
<!--                         v-for="(item, index) in searchAccountList"-->
<!--                         :key="index"-->
<!--                         @click="handleCommand(item)">-->
<!--                    <span>-->
<!--                        <i class="platform-icon" :style="{backgroundImage: `url(${item.networks.icon_url})`}"></i>-->
<!--                        <span>{{item.name}}</span>-->
<!--                    </span>-->
<!--                    <span class="check" :class="{'account-check': item.name === accountInfo.name}"></span>-->
<!--                </section>-->
<!--            </section>-->



            <!-- 添加账号 -->
<!--            <section class="account-add">-->
<!--                <button class="tp-button on" style="padding: 15px 0;" @click="addAccount">-->
<!--                    {{$t($langKeys.DASHBOARD.KEYS.AddKeysButton)}}-->
<!--                </button>-->
<!--            </section>-->
<!--        </section>-->
    </section>
<!--    <section class="sidebar-container" :class="{'locked':!sidebarLocked}">-->
<!--        <section class="placeholder"></section>-->
<!--        <section class="sidebar">-->
<!--            <figure class="bar-bg"></figure>-->
<!--            <figure class="category" v-for="category in items">-->
<!--                <figure class="category-name" v-if="category.name">{{category.name}}</figure>-->
<!--                <router-link :key="item.name" :to="{name:item.route}" class="item"-->
<!--                             :class="{'active':$route.name === item.route}" v-for="(item, i) in category.items">-->
<!--                    <i :class="itemIcon(item)"></i>-->
<!--                    <span>{{item.name}}</span>-->
<!--                </router-link>-->
<!--            </figure>-->

<!--            <figure class="lock-sidebar" @click="toggleSidebar">-->
<!--                <i class="icon-lock"></i>-->
<!--            </figure>-->
<!--        </section>-->
    </section>
</template>

<script>
    import { mapGetters, mapState, mapActions } from 'vuex';
    import * as Actions from '../../../store/constants';
    import { RouteNames } from '../../../vue/Routing';

    export default {
        data() {
            return {
                accountState: false
            };
        },
        computed: {
            ...mapState([
                'history',
                'sidebarLocked'
            ]),
            ...mapGetters([
                'accounts',
            ]),

            tabList() {
                return [
                    { title: 'DApp', icon: 'tp-font-dqpps', url: RouteNames.DAPP },
                    { title: this.$t('TP.COMMON.CHAT'), icon: 'tp-font-chat', url: RouteNames.CHAT },
                    { title: this.$t('TP.COMMON.ASSET'), icon: 'tp-font-asset', url: RouteNames.ASSET },
                    { title: this.$t('TP.COMMON.WALLET'), icon: 'tp-font-wallet', url: RouteNames.WALLET },
                    {
                        title: this.$t('TP.COMMON.SETTING'),
                        icon: 'tp-font-settings',
                        url: RouteNames.SETTINGS,
                        // params: {panel: this.SETTINGS_OPTIONS.LANGUAGE}
                    }
                ];
            },

            items() {
                return [
                    {
                        name: null,
                        items: [
                            this.accounts.length ? { name: 'Apps', route: RouteNames.HOME } : null,
                            { name: 'Wallet', route: RouteNames.WALLET },
                            this.accounts.length ? { name: 'Assets', route: RouteNames.ASSETS } : null,
                            // this.accounts.length ? {name:'Marketplace', route:RouteNames.ITEMS} : null,
                            { name: 'Identities', route: RouteNames.IDENTITIES },
                            { name: 'Locations', route: RouteNames.LOCATIONS },
                            this.accounts.length ? { name: 'Reputation', route: RouteNames.RIDL } : null,
                            this.features.creditCards ? { name: 'Purchase', route: RouteNames.PURCHASE } : null,
                        ].filter(x => !!x)
                    },
                    {
                        name: 'Administrative',
                        items: [
                            { name: 'Contacts', route: RouteNames.CONTACTS },
                            this.history.length ? { name: 'History', route: RouteNames.HISTORIES } : null,
                            { name: 'Networks', route: RouteNames.NETWORKS },
                            { name: 'Settings', route: RouteNames.SETTINGS },
                        ].filter(x => !!x)
                    }
                ];
            }
        },
        mounted() {
            this[Actions.SET_SIDEBAR](window.localStorage.getItem('sidebar') === 'true');
        },
        methods: {
            isActive(name) {
                return this.$route.name === name
                // item.icon
            },

            tabChange(item) {
                this.$router.replace({
                    name: item.url,
                    params: item.params || {}
                })
            },

            accountOptions() {

            },

            itemIcon(item) {
                if (item.name === 'Reputation') return 'sidebar-sidebar_ridl';
                if (item.name === 'Marketplace') return 'sidebar-sidebar_items';
                return `sidebar-sidebar_${item.name.toLowerCase()}`;
            },

            toggleSidebar() {
                this[Actions.SET_SIDEBAR](!this.sidebarLocked);
                window.localStorage.setItem('sidebar', this.sidebarLocked);
            },

            ...mapActions([
                Actions.SET_SIDEBAR
            ])
        }
    };
</script>

<style scoped lang="scss">
    .Tabs {
        width: 160px;
        height: 100%;
        padding: 20px 0;
        background: #232538;
        position: relative;
        z-index: 999;
    }

    .account {
        h4 {
            margin: 0;
            padding: 5px 0;
            background: rgba(101, 106, 128, 1);
            border-radius: 6px;
            opacity: 0.9;

            span {
                margin-left: 5px;
                position: relative;
                top: 1.25px
            }
        }

    }

    .account-wrap {
        position: absolute;
        top: 0;
        left: -120px;
        width: 280px;
        height: 100vh;
        overflow: auto;
        background: #1C1E2F;
        opacity: 0;
        transition: all 0.5s ease-in-out;
        z-index: 10;

        &.show {
            left: 160px;
            opacity: 1;
        }

        .account-main {
            height: calc(100vh - 187px);
            overflow: auto;

            .account-list {
                padding: 10px;
                margin: 15px;
                background: rgba(43, 45, 60, 1);
                border-radius: 8px;
                text-align: left;
                font-family: 'Monaco';

                .check {
                    /*margin-left: 1em;*/
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                }

                .platform-icon {
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background-size: contain;
                    background-position: center;
                    vertical-align: middle;
                    /*margin-right: .5em;*/
                }
            }
        }


        .account-add {
            margin: 15px;
        }
    }


    .tab-wrap {
        margin-top: 50px;
    }

    .tab-list {
        /*padding: 10px;*/
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tab-ctr {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 72px;
        color: #818394;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .tab-ctr.on {
        /*#2AAEFF*/
        /*#2661E7*/
        background: #2980FE;
        color: #fff;
        /*transition: all 0.5s ease-in-out;*/
        opacity: 1;
    }

    .icon-list {
        margin-bottom: 5px;
    }

    .account-check {
        display: inline-block;
        width: 32px;
        background: url("../../assets/images/common/check.png") no-repeat 100% / 100%;
    }

    .account-search-wrap {
        margin:15px 15px 0 ;
        .account-search {
            position: relative;
            i {
                position: absolute;
                top: 15px;
                left: 15px;
            }

            input {
                color: #fff;
                height: 47px;
                width: 100%;
                border-radius: 8px;
                text-align: left;
                background: #2b2d3c;
                border: 0;
                outline: none;
                font-family: 'Monaco';
                padding-left: 45px;
                padding-right: 10px;
            }

        }
    }

    /*@import "../styles/variables";*/

 /*   $time: 0.2s;
    $closed: 64px;
    $open: 200px;*/

    /*.sidebar-container {
        -webkit-user-select: none !important;
        width: $closed;
        transition: width $time ease; // Matches carousel timeout

        .placeholder {
            width: $closed;
            height: $fullheight;
        }

        .sidebar {
            flex: 0 0 auto;
            width: $closed;
            border-right: 1px solid $lightgrey;
            border-bottom: 1px solid $lightgrey;
            border-left: 1px solid $lightgrey;
            padding: 20px 0;
            overflow-x: hidden;
            white-space: nowrap;
            position: fixed;
            left: 0;
            top: 34px;
            bottom: 0;
            background: $white;
            z-index: 10000;
            box-shadow: 0 0 0 transparent, 0 0 0 transparent;

            transition: width $time ease, box-shadow 1.1s ease;

            .bar-bg {
                width: $closed;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                z-index: -1;
            }

            .lock-sidebar {
                position: absolute;
                bottom: 10px;
                left: 10px;
                right: 10px;
                padding: 10px;
                color: $grey;
                cursor: pointer;

                transition: all 0.2s ease;
                transition-property: background, color;

                &:hover {
                    background: rgba(0, 0, 0, 0.03);
                    color: $silver;
                }
            }

            .item {
                cursor: pointer;
                padding: 12px;
                margin: 0 12px;
                border-radius: $radius;
                display: flex;
                align-items: center;
                color: $lightgrey;
                transition: all $time ease;
                transition-property: background;

                i {
                    padding-right: 18px;
                    font-size: 24px;
                    transition: all $time ease;
                    transition-property: color;
                    color: $grey;
                }

                span {
                    margin-left: 5px;
                    opacity: 0;
                    transition: all $time ease;
                    transition-property: margin-left, opacity, color;
                    font-size: $medium;
                }

                &:hover {
                    background: rgba(0, 0, 0, 0.02);
                }

                &:hover, &.active {

                    background: $lightestgrey;

                    i {
                        color: $blue;
                    }

                    span {
                        color: $blue;
                    }
                }
            }

            .category-name {
                font-size: $small;
                font-weight: bold;
                text-transform: uppercase;
                padding: 0 20px;
                margin-top: 40px;
                margin-bottom: 10px;
                opacity: 0;
                transition: all $time ease;
                transition-property: opacity;
            }


        }

        &:not(.locked) {
            .sidebar {
                &:hover {
                    width: $open;
                    transition: width $time ease, box-shadow 0.3s ease;
                    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.15), 2px 0 10px $blue-shadow;
                    border-right: 0;

                    .category-name {
                        opacity: 1;
                    }

                    .item {
                        color: $silver;

                        span {
                            margin-left: 0;
                            opacity: 1;
                        }
                    }
                }
            }
        }

        &.locked {
            width: $open;

            .sidebar {
                width: $open;
                transition: width $time ease, box-shadow 0.3s ease;

                .category-name {
                    opacity: 1;
                }

                .item {
                    color: $silver;

                    span {
                        margin-left: 0;
                        opacity: 1;
                    }
                }
            }
        }
    }*/


</style>
