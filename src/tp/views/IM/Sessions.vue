<template>
    <div class="tp-chat_group">
        <!-- 会话列表 -->
        <div class="tp-chat_group-wrap">
            <div class="tp-chat_group-item pointer"
                 v-for="(item, index) in sessionList"
                 :key="index"
                 :class="{'session-active': currentSessionId === item.id}"
                 @click="changeCurrSession(item)">
                <div class="tp-chat_group-item-img">
                    <img class="item-img-cover" v-if="item.avatar" :src="item.avatar" alt="">
                    <img class="item-img-cover" v-if="!item.avatar" src="../../assets/images/common/placeholder.png"
                         alt="">
                </div>
                <div class="tp-chat_group-item-text">
                    <h5 class="ft-16 g-over-text">{{item.name}}</h5>
                    <p class="ft-12 g-over-text">{{item.lastMsgShow}}</p>
                </div>
                <div class="tp-chat_group-item-status text-right">
                    <span class="ft-12 group-item_time">{{item.updateTimeShow}}</span>
                    <span class="ft-12  group-item_nums"
                          :class="{'red': item.unread > 0, 'nums-10': item.unread > 10 }">
                        {{unread(item.unread)}}
                    </span>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'sessions',
        data() {
            return {

                currentTeamId: ''
            };
        },
        computed: {
            ...mapGetters([

                'userInfos',
                'myInfo',
                'nim',

                'teamMembers',
                'accountInfo',


                'sessionList',
                'sessionMap',

                'imInfo',
                'sessionTab',
                'currentSessionId',
                'currentSessionMsg',
                'currentLanguage',
                'messages',
            ]),

            sysMsgUnread() {
                let temp = this.$store.state.sysMsgUnread;
                let sysMsgUnread = temp.addFriend || 0;
                sysMsgUnread += temp.team || 0;
                let customSysMsgUnread = this.$store.state.customSysMsgUnread;
                return sysMsgUnread + customSysMsgUnread;
            },
        },

        created() {
        },

        mounted() {
            if (this.myInfo.account) this.$store.dispatch('GET_FOLLOW_LIST', { type: 'init' });
        },
        methods: {
            onImgError(el) {
                // el.target.src = '';
                // console.log(el);
            },


            unread(nums) {
                if (nums > 0 && nums < 100) return nums;
                if (nums > 99) return '99+';
                if (nums < 1) return '';
            },

            async changeCurrSession(item) {
                if (item.id !== this.currentSessionId) {
                    await this.$store.dispatch('SET_CURRENT_SESSION', item);
                }

                if (item.scene === 'team') {
                    await this.$store.dispatch('GET_TEAM_MEMBERS', item.to);
                }

                this.$store.commit('TEAM_MEMBERS_STATE', false);

            },

        },
        watch: {
            myInfo() {
                if (this.myInfo.account) this.$store.dispatch('GET_FOLLOW_LIST', { type: 'init' });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/consts";

    .tp-chat_group {
        border-right: 1px solid #e1e1e1;

        .tp-chat_group-search {
            height: 50px;
        }

        .tp-chat_group-wrap {
            height: calc(100vh - 61px - 51px - 40px);
            overflow-y: auto;

            .tp-chat_group-item {
                display: grid;
                grid-template-columns: 50px calc(100% - 105px) 55px;
                padding: 10px;

                .tp-chat_group-item-img {
                    .item-img-cover {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: inline-block;
                    }
                }

                .tp-chat_group-item-text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    h5 {
                        margin: 0;
                    }
                }

                .tp-chat_group-item-status {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-end;

                    .group-item_time {
                        margin-bottom: 3px;
                    }


                }
            }
        }
    }

    .group-item_nums {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        vertical-align: middle;
    }

    .red {
        background: $chat-red;
    }

    .gray {
        background-color: $chat-gray;
    }

    .nums-10 {
        width: auto;
        padding: 0 6px;
        border-radius: 8px;
    }

    .session-active {
        background: $chat-active;
    }
</style>
