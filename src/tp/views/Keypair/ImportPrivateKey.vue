<template>
    <section class="TP-ImportTextKey center-panel">
        <Key/>
        <br>
        <br>
        <h2>{{$t('TP.KEYS.IMPORT.TextTitle')}}</h2>
        <!--		<p>-->
        <!--			Your private key never leaves your device. We only use this to sign transactions and-->
        <!--			nobody will have access to it but you. Please remember that though Scatter is a good place to keep your-->
        <!--			key, you should always have a backup of it somewhere offline.-->
        <!--		</p>-->

        <br>

        <input class="center" type="password" v-model="privateKey" :placeholder="$t('TP.KEYS.IMPORT.TextDescription')"/>

        <br>
        <br>
        <br>

        <figure class="text-center">
            <button class="tp-button ft-18"
                    :class="{'on': privateKey.length > 0}"
                    style="width: 240px;"
                    @click="importKey"
                    v-loading="importing"
                    element-loading-spinner="el-icon-loading">
                {{$t('TP.GENERIC.Import')}}
            </button>
        </figure>
        <!--		<p v-if="!error"><u>Once you input a valid key, it will automatically import it.</u></p>-->
        <!--		<p v-else>{{error}}</p>-->

        <!--		<ActionBar v-if="returnOnly"-->
        <!--				   :buttons-left="[{text:'Back', click:() => $router.go(-1)}]"/>-->
    </section>
</template>

<script>
    import { mapGetters } from 'vuex';
    import KeyPairService from '../../../services/secure/KeyPairService';
    import Keypair from '../../../models/Keypair';
    import AccountService from '../../../services/blockchain/AccountService';
    import Key from '../../../components/svgs/Key';

    export default {
        components: { Key },
        props: ['returnOnly'],
        data() {
            return {
                privateKey: '',
                importing: false,
                error: '',
            };
        },
        computed: {
            ...mapGetters([
                'keypairs'
            ])
        },
        methods: {
            importKey() {
                this.$emit('key', this.privateKey.trim().replace(/\W/g, '').replace('0x', ''));
            }
        },
        watch: {
            ['privateKey']() {
                this.importKey();
            }
        }
    };
</script>

<style scoped lang="scss">
    .TP-ImportTextKey {
        margin-top: 170px;
    }
</style>
