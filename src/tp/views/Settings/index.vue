<template>
    <section>
        <section class="full-panel inner limited" v-if="selectedOption">
            <section class="split-panel dynamic no-divider" style="display: flex">
                <section class="panel menu">

                    <div style="margin-bottom: 1em;" v-for="(item, index) in settingItems" :key="index">
                        <label class="ft-16 c-232538" style="margin: 0;">{{item.title}}</label>
                        <section class="group-list">
                            <section class="item ft-16"
                                     v-for="(list, listIndex) in item.list"
                                     :key="listIndex"
                                     :class="[{ 'selected':selectedOption.name === list.data.name }]"
                                     @click="selectOption(list.data)">
                                <span :class="iconClass(item, list)"></span>
                                &ensp;
                                <span>{{list.title}}</span>
                            </section>
                        </section>
                    </div>
                </section>

                <section class="panel" style="height: calc(100vh - 40px);overflow-y: auto;">
                    <section v-if="selectedOption" class="settings-panels">
<!--                        <h1 class="settings-title text-center ft-24">{{translate(selectedOption)}}</h1>-->
<!--                        <SettingsGeneral v-if="selectedOption.name === settingsOptions.GENERAL.name"/>-->
<!--                        <SettingsTokens v-if="selectedOption.name === settingsOptions.TOKENS.name"/>-->
<!--                        <SettingsExplorer v-if="selectedOption.name === settingsOptions.EXPLORER.name"/>-->
<!--                        <SettingsPassword v-if="selectedOption.name === settingsOptions.PASSWORD.name"/>-->
<!--                        <SettingsBackup v-if="selectedOption.name === settingsOptions.BACKUP.name"/>-->
<!--                        <SettingsDestroy v-if="selectedOption.name === settingsOptions.DESTROY.name"/>-->
<!--                        <SettingsFirewall v-if="selectedOption.name === settingsOptions.FIREWALL.name"/>settings-panels-->
<!--                        <SettingsNetwork v-if="selectedOption.name === settingsOptions.NETWORK.name"/>-->

<!--                                                <SettingsGeneral v-if="selectedOption.name === settingsOptions.GENERAL.name"/>-->
                                                <SettingsLanguage v-if="selectedOption.name === settingsOptions.LANGUAGE.name"/>
<!--                                                <SettingsTokens v-if="selectedOption.name === settingsOptions.TOKENS.name"/>-->
<!--                                                <SettingsExplorer v-if="selectedOption.name === settingsOptions.EXPLORER.name"/>-->
                                                <SettingsNetworks v-if="selectedOption.name === settingsOptions.NETWORK.name"/>
                                                <SettingsPassword :mnemonic="mnemonic" v-on:mnemonic="x => mnemonic = x" v-if="selectedOption.name === settingsOptions.PASSWORD.name"/>
<!--                                                <SettingsBackup v-if="selectedOption.name === settingsOptions.BACKUP.name"/>-->
                                                <SettingsDestroy v-if="selectedOption.name === settingsOptions.DESTROY.name"/>
<!--                                                <SettingsPIN v-if="selectedOption.name === settingsOptions.PIN.name"/>-->
<!--                                                <SettingsFirewall v-if="selectedOption.name === settingsOptions.FIREWALL.name"/>-->

                                                <SettingsAboutUs v-if="selectedOption.name === settingsOptions.ABOUTUS.name"/>

                    </section>
                </section>

            </section>
        </section>
        <!--        <section class="blockchain-list-container" v-if="selectedOption">-->
        <!--            <section class="blockchains">-->
        <!--                <section class="head">-->
        <!--                    Basics-->
        <!--                </section>-->
        <!--                <section class="scroller dynamic">-->
        <!--                    <section class="blockchain-list">-->
        <!--                        <section class="badge-item hoverable" :class="{'active':selectedOption.name === item.name}" v-for="item in generalItems" @click="selectOption(item)">-->
        <!--                            <section class="details"><figure class="title">{{translate(item)}}</figure></section>-->
        <!--                        </section>-->
        <!--                    </section>-->
        <!--                </section>-->
        <!--                <section class="head">-->
        <!--                    <i :class="{'unlocked':unlocked}" class="danger icon-lock"></i>-->
        <!--                    Secure Settings-->
        <!--                </section>-->
        <!--                <section class="scroller dynamic">-->
        <!--                    <section class="blockchain-list">-->
        <!--                        <section class="badge-item hoverable" :class="{'active':selectedOption.name === item.name}" v-for="item in lockedItems" @click="selectOption(item)">-->
        <!--                            <section class="details"><figure class="title">{{translate(item)}}</figure></section>-->
        <!--                        </section>-->
        <!--                    </section>-->
        <!--                </section>-->
        <!--            </section>-->

        <!--            <section class="list-container">-->

        <!--                <h1>{{translate(selectedOption)}}</h1>-->

        <!--                <SettingsGeneral v-if="selectedOption.name === settingsOptions.GENERAL.name" />-->
        <!--                <SettingsTokens v-if="selectedOption.name === settingsOptions.TOKENS.name" />-->
        <!--                <SettingsExplorer v-if="selectedOption.name === settingsOptions.EXPLORER.name" />-->
        <!--                <SettingsPassword v-if="selectedOption.name === settingsOptions.PASSWORD.name" />-->
        <!--                <SettingsBackup v-if="selectedOption.name === settingsOptions.BACKUP.name" />-->
        <!--                <SettingsDestroy v-if="selectedOption.name === settingsOptions.DESTROY.name" />-->
        <!--                <SettingsFirewall v-if="selectedOption.name === settingsOptions.FIREWALL.name" />-->
        <!--                <SettingsNetwork v-if="selectedOption.name === settingsOptions.NETWORK.name" />-->
        <!--            </section>-->
        <!--        </section>-->


    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex';
    import * as Actions from '../../../store/constants';
    import { Popup } from '../../../models/popups/Popup';
    import PopupService from '../../../services/utility/PopupService';

    import { SETTINGS_OPTIONS } from '../../../models/Settings';

    import SettingsGeneral from './SettingsGeneral.vue';
    // import SettingsTokens from './SettingsTokens.vue';
    // import SettingsExplorer from './SettingsExplorer.vue';
    // import SettingsBackup from './SettingsBackup.vue';
    import SettingsDestroy from './SettingsDestroy.vue';
    import SettingsPassword from './SettingsPassword.vue';
    // import SettingsFirewall from './SettingsFirewall.vue';
    import SettingsAboutUs from './SettingsAboutUs';
    import SettingsNetworks from './SettingsNetworks.vue';
    import SettingsLanguage from './SettingsLanguage.vue';


    export default {
        components: {
            SettingsGeneral,
            // SettingsTokens,
            // SettingsExplorer,
            // SettingsBackup,
            SettingsDestroy,
            SettingsPassword,
            // SettingsFirewall,
            SettingsNetworks,
            SettingsAboutUs,
            SettingsLanguage
        },
        data() {
            return {
                settingsOptions: SETTINGS_OPTIONS,
                selectedOption: SETTINGS_OPTIONS.LANGUAGE,
                unlocked: false,
                mnemonic: null,
            };
        },
        computed: {
            ...mapState([
                'scatter'
            ]),
            ...mapGetters([
                'version'
            ]),
            generalItems() {
                return [
                    SETTINGS_OPTIONS.GENERAL,
                    SETTINGS_OPTIONS.TOKENS,
                    SETTINGS_OPTIONS.EXPLORER,
                    SETTINGS_OPTIONS.BACKUP,
                    SETTINGS_OPTIONS.NETWORK,
                ];
            },
            lockedItems() {
                return [
                    SETTINGS_OPTIONS.PASSWORD,
                    // SETTINGS_OPTIONS.FIREWALL,
                    SETTINGS_OPTIONS.DESTROY,
                ];
            },
            settingItems() {
                return [
                    {
                        title: this.$t('TP.GENERIC.Preferences'),
                        list: [
                            {
                                title: this.$t('TP.GENERIC.Language'),
                                icon: 'language',
                                data: SETTINGS_OPTIONS.LANGUAGE
                            },
                            {
                                title: this.$t('TP.GENERIC.Networks'),
                                icon: 'network',
                                data: SETTINGS_OPTIONS.NETWORK
                            }
                        ]
                    },
                    {
                        title: this.$t('TP.GENERIC.Security'),
                        list: [
                            {
                                title: this.$t('TP.GENERIC.Password'),
                                icon: 'password',
                                data: SETTINGS_OPTIONS.PASSWORD
                            },
                            {
                                title: this.$t('TP.GENERIC.Destroy'),
                                icon: 'destroy',
                                data: SETTINGS_OPTIONS.DESTROY
                            }
                        ]
                    },
                    {
                        title: this.$t('TP.GENERIC.General'),
                        list: [
                            {
                                title: this.$t('TP.GENERIC.AboutUs'),
                                icon: 'about',
                                data: SETTINGS_OPTIONS.ABOUTUS
                            },
                        ]
                    }
                ];
            }
        },
        mounted() {

        },
        methods: {
            iconClass(item, list) {
                return this.selectedOption.name === list.data.name
                    ? `${list.icon} on`
                    : list.icon;
            },

            back() {
                this.$router.back();
            },

            selectOption(option) {
                if ((option.locked || false) && !this.unlocked) {
                    return this.unlock(option);
                }
                this.selectedOption = option;
            },

            unlock(option) {
                PopupService.push(Popup.verifyPassword(verified => {
                    if (!verified) return;
                    this.mnemonic = verified;
                    this.unlocked = true;
                    this.selectOption(option);
                }));
            },

            translate(option) {
                console.log(option);
                // return this.$t(`this.langKeys.SETTINGS.MENU[option.name]`);
            }
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../../styles/variables";

    $w20: 20px;
    $h20: 20px;

    .settings-panels {
        flex: 1;
        background: #F3F4F8;
        padding: 70px 40px 40px;
        background: url('../../assets/images/settings/setting-bg.png') no-repeat 100% / cover;

        .settings-title {
            color: #2E294E;
            margin-bottom: 36px;
        }
    }

    .padded {
        padding: 40px 70px;
    }

    .panel {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .menu {
        flex: 0 0 auto;
        width: 280px;
        padding: 40px 30px;

        .group-list {
            .item {
                cursor: pointer;
                padding: 15px 0;
                color: #C4C7D2;
                display: flex;
                align-items: center;

                &.selected {
                    color: #2980FE;
                }

                &:not(:last-child) {
                    border-bottom: 1px solid #dfe0e1;
                }
            }

            &.danger {
                border: 1px solid $red;
            }
        }
    }

    .icon-common {
        width: $w20;
        height: $w20;
        display: inline-block;
        vertical-align: middle;
        margin-right: 1em;
        background-size: 100% 100% !important;
    }

    .language {
        background: url('../../assets/images/settings/language.png');
        @extend .icon-common;

        &.on {
            background: url('../../assets/images/settings/language-on.png');
        }
    }

    .network {
        background: url('../../assets/images/settings/network.png');
        @extend .icon-common;

        &.on {
            background: url('../../assets/images/settings/network-on.png');
        }
    }

    .password {
        background: url('../../assets/images/settings/password.png');
        @extend .icon-common;

        &.on {
            background: url('../../assets/images/settings/password-on.png');
        }
    }

    .destroy {
        background: url('../../assets/images/settings/destroy.png');
        @extend .icon-common;

        &.on {
            background: url('../../assets/images/settings/destroy-on.png');
        }
    }

    .about {
        background: url('../../assets/images/settings/about.png');
        @extend .icon-common;

        &.on {
            background: url('../../assets/images/settings/about-on.png');
        }
    }

    .link {
        background: url('../../assets/images/settings/link.png');
        @extend .icon-common;

        &.on {
            background: url('../../assets/images/settings/link-on.png');
        }
    }

    .head {
        .danger {
            background: $red;
            color: $white;
            font-size: $small;
            border-radius: $radius;
            padding: 3px 3px;
            margin-right: 10px;
            overflow: hidden;

            &.unlocked {
                animation: popLock 0.6s normal forwards ease;
                animation-delay: 0.1s;
            }

            @keyframes popLock {
                0% {
                    transform: scale(1);
                }
                20% {
                    transform: scale(0.8);
                }
                60% {
                    opacity: 1;
                    transform: scale(2);
                }
                80% {
                    transform: scale(0.5);
                    opacity: 0;
                    margin-left: 0;
                }
                100% {
                    margin-left: -30px;
                    opacity: 0;
                }
            }
        }
    }

    .list-container {
        padding: 30px;
        height: calc(100vh - 40px);
        overflow-y: auto;
    }

</style>
