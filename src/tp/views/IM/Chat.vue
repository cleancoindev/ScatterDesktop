<template>
    <div class="chat">


        <ChatInfo v-show="sessionTab.type === 'Sessions'"/>

        <section v-show="sessionTab.type === 'Contacts'">
            <ContactInfo/>
        </section>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ChatInfo from './ChatInfo';
    import ContactInfo from './ContactInfo';

    export default {
        name: 'chat',
        props: {
            loginState: {
                type: Boolean,
                default: false
            }
        },
        components: {
            ChatInfo,
            ContactInfo
        },
        data() {
            return {};
        },
        computed: {
            ...mapGetters([
                'currentSessionId',
                'sessionTab'
            ])
        },
    };
</script>

<style scoped>
    .chat {
        background: #F5F5F5;
    }


</style>
