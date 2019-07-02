<template>
    <div class="ChatInfo">

        <section class="chat-no-session" v-if="!currentSessionId">
            <img src="../../assets/images/common/im-bk.png" alt="">
        </section>


        <section v-else>
            <!-- 基本信息 -->
            <div class="ChatHeader">
                <span class="ft-18">
                    {{teamInfo.name}}
                    <i v-if="scene === 'team' && teamInfo.memberNum ">({{teamInfo.memberNum || 0}})</i>
                </span>

                <span class="TP-Font tp-font-member text-right pointer ft-24 c-818394" v-show="scene === 'team'"
                      @click="showTeamMember"></span>
            </div>

            <!-- 消息列表 -->
            <div id="chat-list" class="ChatList">

                <!-- 聊天信息 -->
                <div class="ChatItem" v-for="(msg, index) in msgList" :key="index">
                    <!-- 消息时间日期 -->
                    <div class="text-center item-time ft-12" v-if="msg.type === 'timeTag'">{{msg.date}}</div>

                    <div class="item" :class="chatUser(msg)" v-else>

                        <div class="item-wrap">
                            <!-- 用户头像 -->
                            <div class="item-user">
                                <img class="item-avatar" :src="msg.avatar" alt="" @error="imgError"
                                     @click="getUserInfo('msg', msg)">
                            </div>

                            <div class="item-message">
                                <!-- 用户昵称 -->
                                <div class="item-name ft-12">{{msg.fromNick}}</div>

                                <div class="item-text c-333 ft-14">
                                    <!-- 普通文本 -->
                                    <div class="text-select" v-if="msg.type === 'text'" v-html="msg.text"></div>

                                    <!-- 图片消息 -->
                                    <div v-if="msg.type === 'image'">
                                        <img :src="msg.file.url" style="max-width: 250px;" alt="">
                                    </div>

                                    <!-- 自定义消息 -->
                                    <div v-if="msg.type === 'custom'" style="max-width: 250px;">
                                        <!-- 文章消息 -->
                                        <div class="pointer" v-if="msg.content.type === 4"
                                             @click="openInBrowser(msg.content.url)">
                                            <h5 class="ft-16">{{msg.content.title}}</h5>
                                            <img :src="msg.content.icon_url" style="width: 100%;" alt="">
                                        </div>

                                        <!-- 其他自定义消息 -->
                                        <div v-else>{{msg | parseCustomMsg}}</div>
                                    </div>

                                    <!-- 群通知消息 -->
                                    <div v-else-if="msg.type === 'notification' && msg.scene==='team'"
                                         class="notification">
                                        {{msg | teamSysmMsg}}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <!-- 消息发送框 -->
            <div class="ChatEditor">
                <textarea class="chat-message" @keydown="lineFeed" v-model="msgToSent"></textarea>
            </div>


            <!-- 用户信息 -->
            <div class="chat-user-info_wrap" @click="closeDialog" v-if="chatUserDialog">
                <div class="chat-user-info_detail">
                    <div class="chat-user-info_detail-header">
                        <img :src="chatUserInfo.avatar" alt="">
                        <h5 class="c-666 ft-16">{{chatUserInfo.nick}}</h5>
                    </div>

                    <div class="chat-user-info_detail-wrap">
                        <div class="chat-user-info_detail-btn">
                            <button class="TP-Iconfont tp-icon-followx pointer"
                                    @click="follow"
                                    v-show="isFollow === 0"></button>
                            <button class="TP-Iconfont tp-icon-chat pointer" @click="goChat"></button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 退出群聊 -->
            <!--            <div class="chat-user-info_wrap" @click="closeDialog" v-if="chatUserDialog">-->
            <!--                <div class="chat-user-info_detail">-->
            <!--                    <div class="chat-user-info_detail-header">-->
            <!--                        <img :src="chatUserInfo.avatar" alt="">-->
            <!--                        <h5 class="c-666 ft-16">{{chatUserInfo.nick}}</h5>-->
            <!--                    </div>-->

            <!--                    <div class="chat-user-info_detail-wrap">-->
            <!--                        <div class="chat-user-info_detail-btn">-->
            <!--                            <button class="TP-Iconfont tp-icon-followx pointer" @click="follow"-->
            <!--                                    v-show="isFollow === 0"></button>-->
            <!--                            <button class="TP-Iconfont tp-icon-chat pointer" @click="goChat"></button>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->

            <!-- 群成员列表 -->
            <section class="chat-team_left" v-if="teamMemberState" @click="showTeamMember"></section>
            <section class="chat-team_right chat-team_people-wrap" :class="{'show': teamMemberState}">
                <section class="chat-team_people-header">
                    <!-- 群名 -->
                    <h5 class="ft-12 c-666">{{ $t('TP.IM.GROUP_NAME') }}</h5>
                    <p class="ft-14 c-333">{{teamInfo.name}}</p>

                    <!-- 群公告 -->
                    <h5 class="ft-12 c-666">{{ $t('TP.IM.GROUP_NOTICE') }}</h5>
                    <p class="ft-14 g-over-text" style="color: #B0B0B0;">{{teamInfo.intro || $t('TP.IM.GROUP_NO_NOTICE')}}</p>
                </section>

                <!-- 搜索群成员 -->
                <section class="chat-team_people-search">
                    <div class="people-search">
                        <i class="people-search-icon TP-Iconfont tp-icon-searchx"></i>
                        <input class="people-search-input"
                               type="search"
                               :placeholder="$t('TP.COMMON.SEARCH')"
                               v-model="searchPeople"/>
                    </div>
                </section>

                <!-- 原始数据 -->
                <section class="chat-team_people-list" v-if="!searchPeopleState">
                    <div class="chat-team_people-item pointer"
                         v-for="(item, index) in currentTeamMembers"
                         :key="index"
                         @click="getUserInfo('account', item)">
                        <div class="chat-team_avatar">
                            <img class="chat-team_avatar-img" :src="item.avatar" alt="">
                        </div>

                        <div class="g-over-text">{{item.nick}}</div>
                    </div>
                </section>

                <!-- 搜索过滤数据 -->
                <section class="chat-team_people-list" v-if="searchPeopleState">
                    <div class="chat-team_people-item pointer"
                         v-for="(item, index) in searchTeamMembers"
                         :key="index"
                         @click="getUserInfo('account', item)">
                        <div class="chat-team_avatar">
                            <img class="chat-team_avatar-img" :src="item.avatar" alt="">
                        </div>

                        <div class="g-over-text">{{item.nick}}</div>
                    </div>
                </section>

                <section class="chat-team_people-out pointer ft-14" @click="outTeam">
                    {{ $t('TP.IM.GROUP_DELETE') }}
                </section>
            </section>
        </section>


    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import _ from 'underscore';
    import Util from '../../utils/chat';
    import { nimGetUser } from '../../utils/chat/nimMethods';
    import { getIsFollow } from '../../api/im';
    import pageUtil from '../../utils/chat/page';

    export default {
        name: 'ChatInfo',
        data() {
            return {
                currPagePos: 0,
                pagePos: 0,
                teamInfo: {},
                chatUserDialog: false,
                chatUserInfo: {},
                isFollow: null,
                msgToSent: '',
                searchPeople: '',
                searchPeopleState: false
            };
        },
        computed: {
            ...mapGetters([
                'myInfo',
                'currentSessionInfo',
                'currentSessionMsg',
                'currentSessionId',
                'currentContactInfo',
                'teamList',
                'teamMembers',
                'teamMemberState',
                'nim'
            ]),

            name() {
                return this.currentSessionInfo.name;
            },

            scene() {
                return this.currentSessionInfo.scene;
            },

            to() {
                return this.currentSessionInfo.to;
            },

            msgList() {
                return this.currentSessionMsg;
            },

            lastHistoryMsg() {
                let arr = [...this.msgList];
                const list = arr.filter(msg => msg.to && msg.scene);
                if (list.length > 0) {
                    return list[0];
                }
                return null;
            },

            currentTeamMembers() {
                if (this.currentSessionInfo.scene === 'team') return this.teamMembers[this.currentSessionInfo.to];
                return [];
            },

            searchTeamMembers() {
                // console.log(this.currentTeamMembers.filter(member => member.nick.toLowerCase().indexOf(this.searchPeople.toLowerCase()) !== -1));
                return this.currentTeamMembers.filter(member =>  member.nick.toLowerCase().indexOf(this.searchPeople.toLowerCase()) !== -1);
            }
        },

        filters: {
            parseCustomMsg(item) {
                return Util.parseCustomMsg(item);
            },

            teamSysmMsg(item) {
                return Util.generateTeamSysmMsg(item);
            }
        },

        mounted() {
            this.scrollEL();
            this.scrollChatListDown('msg');
            this.getTeamInfo();
        },

        methods: {
            scrollEL() {
                const chatEL = this.$el.querySelector('#chat-list');
                if (chatEL) {
                    const throttle = _.throttle(async () => {
                        const scrollTop = chatEL.scrollTop;
                        this.pagePos = chatEL.scrollHeight - chatEL.scrollTop - chatEL.clientHeight;
                        if (scrollTop < 50 && this.lastHistoryMsg) {
                            await this.$store.dispatch('CONCAT_CURRENT_SESSION_MSG', this.lastHistoryMsg);
                            this.scrollChatListDown('load');
                        }
                    }, 1000);
                    chatEL.addEventListener('scroll', throttle);
                }
            },

            scrollChatListDown(type) {
                const chatEL = this.$el.querySelector('#chat-list');
                switch (type) {
                    case 'load':
                        let tempPagePos = chatEL.scrollHeight;
                        pageUtil.scrollChatListDown(tempPagePos - this.currPagePos);
                        this.currPagePos = tempPagePos;
                        break;
                    case 'msg':
                        pageUtil.scrollChatListDown();
                        this.currPagePos = 0;
                        this.pagePos = 0;
                        break;
                }
            },

            chatUser(msg) {
                const chatClass = {
                    out: 'item-me',
                    in: 'item-you'
                };
                return chatClass[msg.flow];
            },

            closeDialog() {
                this.chatUserInfo = {};
                this.chatUserDialog = false;
            },

            showTeamMember() {
                this.$store.commit('TEAM_MEMBERS_STATE', !this.teamMemberState);
            },

            outTeam() {
                this.$store.dispatch('LEAVE_TEAM');
                this.$store.commit('TEAM_MEMBERS_STATE', !this.teamMemberState);
            },

            imgError(el) {
                el.target.src = require('../../assets/images/common/placeholder.png');
            },

            async getUserInfo(type, data) {
                const account = type === 'msg' ? data.from : data.account;

                await getIsFollow({
                    imaccount_id: this.myInfo.account,
                    target_imaccount_id: account
                }).then(res => {
                    if (res.result === 0) {
                        this.isFollow = res.data;
                    }
                });

                nimGetUser(this.nim, account).then(user => {
                    this.chatUserInfo = user;
                    this.chatUserDialog = true;
                });
            },

            follow() {
                this.$store.commit('TEAM_MEMBERS_STATE', false);
                this.$store.dispatch('FOLLOW_ACCOUNT', {
                    type: this.isFollow,
                    account: this.chatUserInfo.account
                });
            },

            goChat() {
                this.$store.commit('TEAM_MEMBERS_STATE', false);
                this.$store.dispatch('INSERT_LOCAL_SESSION', {
                    scene: 'p2p',
                    to: this.chatUserInfo.account
                });
            },

            async sendTextMsg() {
                this.msgToSent = this.msgToSent.trim();
                await this.$store.dispatch('SENT_TEXT_MSG', {
                    type: 'text',
                    scene: this.scene,
                    to: this.to,
                    text: this.msgToSent
                });

                this.msgToSent = '';
            },

            lineFeed(e) {
                let code = e.keyCode;
                let ctrl = e.ctrlKey;
                let shift = e.shiftKey;
                let alt = e.altKey;

                // ctrl + enter
                if (code === 10 && ctrl && !shift && !alt) {
                    this.sendTextMsg();
                    this.scrollChatListDown('msg');
                }

                // enter
                if (code === 13 && !ctrl && !shift && !alt) {
                    console.log(e);
                    this.sendTextMsg();
                    this.scrollChatListDown('msg');
                    e.preventDefault();
                }
            },

            getTeamInfo() {
                if (this.currentSessionInfo.to) {
                    if (this.currentSessionInfo.scene === 'team') {
                        this.nim.getTeam({
                            teamId: this.currentSessionInfo.to,
                            done: (error, obj) => {
                                this.teamInfo = obj;
                            }
                        });
                    } else {
                        this.teamInfo = this.currentSessionInfo;
                    }

                }
            }
        },
        watch: {
            async currentSessionId() {
                this.scrollChatListDown('msg');
            },

            async currentSessionMsg() {
                if (this.pagePos < 10) this.scrollChatListDown('msg');
            },

            currentSessionInfo() {
                this.getTeamInfo();
            },

            searchPeople() {
                this.searchPeople !== ''
                    ? this.searchPeopleState = true
                    : this.searchPeopleState = false;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/consts";

    .chatInfo {
        background: #F5F5F5;
    }

    .chat-no-session {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    /* ChatHeader */
    .ChatHeader {
        position: relative;
        padding: 0 15px;
        border-bottom: 1px solid #E6E6E6;
        background: #F5F5F5;
        height: 60px;
        line-height: 60px;
        display: flex;

        i {
            font-style: normal;
        }

        span {
            flex: 1;
        }
    }

    /* ChatList */
    .ChatList {
        height: calc(100vh - 63px - 200px);
        overflow-y: auto;
        padding: 15px 0;
    }

    .item {
        clear: both;
        overflow: hidden;
        margin-bottom: 16px;
    }

    .item-time {
        margin-bottom: 10px;
    }

    @mixin user {
        padding: 0 10px;
        .item-avatar {
            width: $px-40;
            height: $px-40;
            border-radius: 50%;
            background: #ccc;
        }
    }

    @mixin message {
        .item-name {
            margin-bottom: 5px;
        }

        .item-text {
            display: inline-block;
            max-width: 400px;
            background: $chat-to-bk;
            padding: 10px;
            border-radius: 5px;
            color: #333;
            word-wrap: break-word;
            word-break: break-all;

        }
    }

    .item-you {
        .item-user {
            @include user;
            float: left;
        }

        .item-message {
            @include message;
            float: left;

            .item-text {
                background: $chat-from-bk;
            }
        }
    }

    .item-me {
        .item-user {
            @include user;
            float: right;
        }

        .item-message {
            @include message;
            float: right;

            .item-name {
                text-align: right;
            }

            .item-text {
                float: right;
            }
        }
    }

    /deep/ .emoji-small {
        width: 20px;
    }

    .text-select {
        -webkit-user-select: all;
        -webkit-user-drag: inherit;
        -webkit-app-region: drag;
    }

    .chat-user-info_wrap {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 99;

        .chat-user-info_detail {
            position: absolute;
            top: 30%;
            left: 50%;
            background: #F5F5F5;
            width: 260px;
            border-radius: 8px;
            box-shadow: 0 2px 14px 2px rgba(0, 0, 0, 0.18);

            .chat-user-info_detail-header {
                display: flex;
                align-items: center;
                padding: 20px;

                img {
                    width: 50px;
                    height: 50px;
                    margin-right: 25px;
                }

                h5 {
                    margin: 0;
                }
            }


            .chat-user-info_detail-wrap {
                padding: 15px 0;
                border-top: 1px solid #E6E6E6;

                .chat-user-info_detail-btn {
                    display: flex;


                    button {
                        flex: 1;
                        border: 0;
                        outline: none;
                        background: transparent;
                        color: #818394;
                        font-size: 22px;

                        &:first-child {
                            border-right: 1px solid #E6E6E6;
                        }
                    }
                }
            }

        }
    }

    /* ChatEditor */
    .ChatEditor {
        height: 199px;
        border-top: 1px solid #E6E6E6;

        .chat-message {
            width: 100%;
            height: 100%;
            outline: none;
            border: 0;
            padding: 10px;
            overflow-y: auto;
            background: #F5F5F5;
        }
    }

    /* 群成员列表 */
    .chat-team_left {
        position: fixed;
        /*left: 0;*/
        top: 60px;
        /*z-index: 999;*/
        width: calc(100vw - 200px - 280px - 160px);
        height: calc(100vh - 60px);
    }

    .chat-team_people-wrap {
        position: fixed;
        top: 60px;
        right: -200px;
        width: 200px;
        height: calc(100vh - 60px);
        background: #FAFAFA;
        border-left: 1px solid #E6E6E6;
        transition: all 0.5s;

        &.show {
            right: 0;
        }

        .chat-team_people-header {
            height: 107px;
            margin: 20px;
            border-bottom: 1px solid #E6E6E6;

            h5 {
                margin: 0;
            }

            p {
                margin-bottom: 20px;
            }
        }

        .chat-team_people-search {
            padding: 0 20px;
            margin-bottom: 20px;

            .people-search {
                position: relative;

                .people-search-icon {
                    position: absolute;
                    top: 5px;
                    left: 7px;
                    font-size: 14px;
                }

                .people-search-input {
                    background: #D7D7D7;
                    border: 0;
                    border-radius: 4px;
                    height: 26px;
                    font-size: 14px;
                    /*color: #B0B0B0;*/
                    width: 100%;
                    padding-left: 2em;
                    padding-right: 1em;
                    outline: none;
                }

            }
        }


        .chat-team_people-list {
            height: calc(100vh - 298px);
            overflow-y: auto;

            .chat-team_people-item {
                display: flex;
                align-items: center;
                padding: 8px 20px;

                .chat-team_avatar {
                    .chat-team_avatar-img {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        margin-right: 14px;
                    }

                }
            }
        }


        .chat-team_people-out {
            /*position: fixed;*/
            height: 44px;
            line-height: 44px;
            border-top: 1px solid #E6E6E6;
            text-align: center;
            color: #FE4729;
        }


    }
</style>
