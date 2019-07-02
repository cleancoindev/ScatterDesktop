<template>
    <div class="Contacts">
        <section class="contacts-type cursor-default" @click="isShowList('teams')">
            <i class="TP-Iconfont tp-icon-arrow" :class="{'active': groupType.teams}"></i>
            <span class="c-333">{{$t('TP.IM.GROUP_CHAT')}}</span>
            <span class="text-right ft-14 c-999">{{teamList.length}}</span>
        </section>

        <!-- 群列表 -->
        <div v-if="groupType.teams">
            <div class="item-list pointer"
                 v-for="(item, index) in teamList"
                 :key="index"
                 :class="{'active': item.teamId === currentContactInfo.teamId}"
                 @click="setCurrentInfo(item, 'team')">
                <img  class="item-img-cover" :src="item.avatar" alt="" v-if="item.avatar">
                <img class="item-img-cover" v-if="!item.avatar" src="../../assets/images/common/placeholder.png" alt="">
                <span class="item-text g-over-text">{{item.name}}({{item.memberNum}})</span>
            </div>
        </div>

        <section class="contacts-type cursor-default" @click="isShowList('follow')">
            <i class="TP-Iconfont tp-icon-arrow" :class="{'active': groupType.follow}"></i>
            <span class="c-333">{{$t('TP.IM.FOLLOWING')}}</span>
            <span class="text-right ft-14 c-999">{{followList.length}}</span>
        </section>

        <!-- 关注列表 -->
        <div v-if="groupType.follow">
            <div class="item-list pointer"
                 v-for="(item, index) in followList"
                 :key="index"
                 :class="{'active': item.account === currentContactInfo.account}"
                 @click="setCurrentInfo(item, 'p2p')">
                <img  class="item-img-cover" :src="item.avatar" alt="" v-if="item.avatar">
                <img class="item-img-cover" v-if="!item.avatar" src="../../assets/images/common/placeholder.png" alt="">
                <span class="item-text g-over-text">{{item.nick}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'Contacts',
        components: {
        },
        data() {
            return {
            };
        },
        computed: {
            ...mapGetters([
                'groupType',
                'teamList',
                'followList',
                'currentTeamInfo',
                'currentContactInfo'
            ]),
            contactList() {
                return [
                    {

                    }
                ]
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            isShowList(type) {
                this.$store.commit('GROUP_TYPE', type);
                // this.showGroupState[type] = !this.showGroupState[type]
            },

            setCurrentInfo(item, type) {
                this.$store.commit('CURRENT_CONTACT_INFO', {...item, type});
            },
        },
        watch: {}
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/consts";

    .Contacts {
        /*margin-top: 20px;*/
        height: calc(100vh - 50px - 61px);
        overflow-y: auto;
    }

    .contacts-type {
        padding: 10px;
        display: grid;
        grid-template-columns: 20px calc(100% - 20px - 40px) 40px;
    }

    .tp-icon-arrow {
        transition: all .3s;
        font-weight: 300;
        text-align: center;
        width: 20px;
        height: 20px;
        &.active {
            transform: rotate(90deg);
        }
    }

    .item-list {
        display: flex;
        align-items: center;
        padding: 10px 15px 10px 30px;
        &.active {
            background: $chat-active;;
        }
    }

    .item-img-cover {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 10px;
    }


</style>
