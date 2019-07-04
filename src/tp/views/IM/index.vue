<template>
    <div class="tp-chat-wrap">
        <!-- 登录验证 -->
        <section class="tp-chat_login-verify text-center" v-show="!imInfo.isOnline">
            <img class="tp-chat_login-img" src="../../assets/images/common/im-login.png" alt>
            <p class="tp-chat_login-text c-333 ft-14">{{$t('TP.IM.SIGNATURE_DESC')}}</p>
            <button class="tp-button on loading c-fff ft-16 pointer"
                    style="width: 120px"
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    @click="login"
            >{{$t('TP.IM.SIGNATURE')}}
            </button>
        </section>

        <!-- 会话页面 -->
        <section class="tp-chat" v-show="imInfo.isOnline">
            <!-- left -->
            <section style="border-right: 1px solid #e1e1e1;">
                <!-- 个人信息 -->
                <div class="tp-chat_info c-333">
                    <img v-if="myInfo.avatar" :src="myInfo.avatar" alt="">
                    <img v-if="!myInfo.avatar" src="../../assets/images/common/placeholder.png" alt="">
                    {{myInfo.nick}}
                </div>

                <!-- IM Tab -->
                <div class="chat-icon-wrap">
                    <div class="chat-icon pointer" v-for="(item, index) in sessionTabs" :key="index"
                         @click="changeSessionTab(item)">
                        <i class="TP-Font ft-20" :class="[item.iconClass,{'tab-icon-on': sessionTab.type === item.type}]"></i>
                    </div>
                </div>

                <!-- 最近会话和群组，关注的人-->
                <component :is="sessionTab.type"/>
            </section>

            <!-- right 聊天信息、群组信息、关注的人信息 -->
            <Chat :login-state="loginState"/>

        </section>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import Sessions from './Sessions';
    import Contacts from './Contacts'
    import Chat from './Chat';

    export default {
        name: 'tpChat',
        components: {
            Sessions,
            Contacts,
            Chat,
        },
        data() {
            return {
                groupName: '',
                message: '',
                msgList: [],
                chatList: [],
                sessionId: '',
                loading: false,
                loginState: false,
                sessionTabs: [
                    { iconClass: 'tp-font-chat', type: 'Sessions' },
                    { iconClass: 'tp-font-maillist', type: 'Contacts' }
                ],
            };
        },
        computed: {
            ...mapGetters([
                'imInfo',
                'sessionTab',
                'myInfo',
                'currentAccount',
                'keypairs'
            ])

        },

        created() {
        },

        methods: {
            async login() {
                this.loading = true;
                setTimeout(async () => {
                    await this.$store.dispatch('INIT_USER_INFO', this.currentAccount).catch(e => this.loading = false);
                    this.loading = false;
                    this.loginState = true;
                }, 1000)
            },

            changeSessionTab(item) {
                this.$store.dispatch('CURRENT_SESSION_TAB', { type: 'init', data: item });
            },

        },
        watch: {
        }
    };
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/consts";

    .tp-chat-wrap {
        height: 100%;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    .tp-chat_info {
        display: flex;
        align-items: center;
        padding: 10px;

        img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }

    .chat-icon-wrap {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid $border-e5e;

        .chat-icon {
            flex: 1;
            text-align: center;
            color: #818394;

            .tab-icon-on {
                color: #2980FE
            }
        }
    }



    .tp-chat {
        display: grid;
        grid-template-columns: $width calc(100% - #{$width} - 1px);
        position: relative;
        /*overflow-x: hidden;*/
    }

    .tp-chat_login-verify {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        //   padding: 15px;

        .tp-chat_login-img {
            width: 300px;
        }

        .tp-chat_login-text {
            margin: 1em 0;
        }
    }

    .tp-chat_detail {
        display: grid;
        grid-template-rows: 60px calc(100vh - 60px - 200px - 4px) 200px;
        background: $chat-bk;

        .chat_detail-header {
            line-height: 60px;
            border-bottom: 1px solid #e1e1e1;
            padding: 0 15px;
        }

        .chat_detail-main {
            overflow-y: auto;
            padding: 15px 0;

            .chat--time {
                padding: 15px 0;
            }

            .chat-from {
                padding: $px-15;
                display: grid;
                grid-template-columns: $px-40 calc(100% - #{$px-40});

                .from-name {
                    margin-bottom: 5px;
                }
            }

            .chat-to {
                padding: $px-15;
                display: grid;
                grid-template-columns: calc(100% - #{$px-40}) $px-40;

                .text {
                    background-color: $chat-to-bk;
                }
            }

            .chat-user-img {
                width: $px-30;
                height: $px-30;
                border-radius: 50%;
            }

            .chat-user-text {
                max-width: 70%;
                display: inline-block;
                padding: $px-10;
                border-radius: 5px;
            }
        }

        .chat-detail-input {
            /*max-height: 200px;*/
            height: 100%;
            border-top: 1px solid #e1e1e1;

            .message-input {
                width: 100%;
                height: 100%;
                border: 0;
                outline: none;
                text-indent: 1em;
                padding: 10px 0;
            }
        }
    }

    /deep/ .el-loading-spinner {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        margin-top: inherit;
        text-align: center;
    }
</style>
