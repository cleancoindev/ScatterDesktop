<template>
    <section class="TP-ImportTextKey center-panel">
        <Key/>
        <br>
        <br>
        <h2>{{$t('TP.ACCOUNT.KEYS.IMPORT.TextTitle')}}</h2>

        <br>

        <input class="center" type="password" v-model="privateKey" :placeholder="$t('TP.ACCOUNT.KEYS.IMPORT.TextDescription')"/>

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
        <!-- <p v-if="!error"><u>Once you input a valid key, it will automatically import it.</u></p> -->
        <p class="ft-16" style="color: red" v-show="keyError">{{keyError}}</p>

    </section>
</template>

<script>
    import { mapGetters } from 'vuex';
    import KeyPairService from '../../../services/secure/KeyPairService';
    import Keypair from '../../../models/Keypair';
    import AccountService from '../../../services/blockchain/AccountService';
    import Key from '../../../components/svgs/Key';

    export default {
        name: 'ImportPrivateKey',
        components: { Key },
        props: ['returnOnly', 'keyError'],
        data() {
            return {
                privateKey: '',
                importing: false,
                // error: '',
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
        mounted(){
            // console.log(this.keypairs);
            
        },
        watch: {
            // ['privateKey']() {
            //     this.importKey();
            // }
        }
    };
</script>

<style scoped lang="scss">
    .TP-ImportTextKey {
        margin-top: 170px;
    }
</style>
