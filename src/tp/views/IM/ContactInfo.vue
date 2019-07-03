<template>
    <div class="contact-info">
        <div v-if="currentContactInfo.name || currentContactInfo.nick">
            <figure class="team-info text-center">
                <img class="team-info-avatar" v-if="currentContactInfo.avatar" :src="currentContactInfo.avatar" alt="">
                <img class="team-info-avatar" v-if="!currentContactInfo.avatar"
                     src="../../assets/images/common/placeholder.png" alt="">
                <h4 class="team-info-name">{{currentContactInfo.name || currentContactInfo.nick}}</h4>
                <p class="team-info-intro c-333 ft-14" v-if="currentContactInfo.intro">{{currentContactInfo.intro}}</p>
            </figure>

            <footer>
                <div class="text-center">
                    <button class="tp-button on ft-16" style="width: 120px;" @click="goSession">
                        {{ $t('TP.IM.CHAT') }}
                    </button>

                    <!-- 取消关注 -->
                    <p class="c-999 pointer ft-14" style="margin-top: 25px;" v-if="currentContactInfo.nick" @click="isFollowing = true">
                        {{ $t('TP.IM.UNFOLLOW') }}
                    </p>
                </div>
            </footer>
        </div>

        <!-- 取消关注 -->
        <div class="team-info_unfollow text-center" v-show="isFollowing">
            <div class="chat-user-info_detail-header text-center ft-20 c-333">{{$t('TP.IM.UNFOLLOW')}}？
            </div>

            <div class="chat-user-info_detail-wrap">
                <div class="chat-user-info_detail-btn c-333">
                    <button class="ft-16 pointer" @click="isFollowing = false">{{$t('TP.GENERIC.Cancel')}}</button>
                    <button class="ft-16 pointer" @click="unFollow">{{$t('TP.GENERIC.Okay')}}</button>
                </div>
            </div>
        </div>

        <div class="chat-no-team" v-if="!currentContactInfo.name && !currentContactInfo.nick">
            <img src="../../assets/images/common/im-bk.png" alt="">
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'Team',
        data() {
            return {
                isFollowing: false,
            };
        },
        computed: {
            ...mapGetters([
                'currentContactInfo'
            ])
        },
        created() {

        },
        mounted() {
            // console.log(this.currentContactInfo);
        },
        methods: {
            unFollow() {
                this.$store.dispatch('FOLLOW_ACCOUNT', {
                    type: 1,
                    account: this.currentContactInfo.account
                });
                this.$store.commit('CURRENT_CONTACT_INFO', {});
                this.isFollowing = false;
            },

            goSession() {
                const data = this.currentContactInfo.teamId
                    ? { scene: 'team', to: this.currentContactInfo.teamId }
                    : { scene: 'p2p', to: this.currentContactInfo.account };

                this.$store.dispatch('INSERT_LOCAL_SESSION', data);
            }
        },
        watch: {}
    };
</script>

<style lang="scss" scoped>
    .contact-info {
        position: relative;
    }

    .team-info {
        margin-top: 35%;
    }

    .team-info-avatar {
        width: 110px;
        height: 110px;
        border-radius: 50%;
    }

    .team-info-name {
        margin-top: 15px;
        font-size: 18px;
    }

    .team-info-intro {
        width: 70%;
        display: inline-block;
    }

    footer {
        margin-top: 70px;
    }

    .chat-no-team {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: rgb(241, 241, 241);
    }

    .team-info_unfollow {
        /*display: flex;*/
        /*justify-content: center;*/
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        /*.chat-user-info_detail {*/

        background: #F5F5F5;
        width: 260px;
        border-radius: 8px;
        box-shadow: 0 2px 14px 2px rgba(0, 0, 0, 0.18);
        display: inline-block;

        .chat-user-info_detail-header {

            padding: 20px;
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

                    &:first-child {
                        border-right: 1px solid #E6E6E6;
                    }
                }
            }
        }

        /*}*/
    }
</style>
