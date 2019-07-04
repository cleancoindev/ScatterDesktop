<template>
    <section class="password-wrap">
        <section class="top-pad">
            <section class="text-center">
                <img style="width: 50px;" src="../../assets/images/settings/password-2.png" alt="">
            </section>

            <section>
                <h4 style="margin: 1em 0;" class="ft-16 c-232538">
                    {{$t('TP.GENERIC.Password')}}
                </h4>
                <input class="password-input ft-14" type="password"
                       :placeholder="$t('TP.SETTINGS.PASSWORD.NewPasswordPlaceholder')"
                       v-model="password"/>
            </section>

            <section>
                <h4 style="margin: 1em 0;" class="ft-16 c-232538">
                    {{$t('TP.SETTINGS.PASSWORD.ConfirmPasswordLabel')}}
                </h4>

                <input class="password-input ft-14" type="password"
                       :placeholder="$t('TP.SETTINGS.PASSWORD.ConfirmPasswordPlaceholder')"
                       v-model="confirmPassword"
                       @keyup.enter="changePassword"/>
            </section>


            <section class="text-center">
                <button class="tp-button change-password c-fff ft-16 pointer"
                        :class="{'on': password.length > 0 && (password === confirmPassword)}"
                        @click="changePassword">
                    {{$t('TP.SETTINGS.PASSWORD.ChangePasswordButton')}}
                </button>
            </section>
        </section>

    </section>
</template>

<script>
    import { mapState } from 'vuex';
    import PasswordService from '../../../services/secure/PasswordService';

    export default {
        props: ['mnemonic'],
        data() {
            return {
                password: '',
                confirmPassword: ''
            };
        },
        computed: {
            ...mapState([
                'scatter'
            ])
        },
        mounted() {
        },
        methods: {
            async changePassword() {
                if (!PasswordService.isValidPassword(this.password, this.confirmPassword)) return false;

                await PasswordService.changePassword(this.password);
                this.password = '';
                this.confirmPassword = '';
            }
        },
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../../styles/variables";

    .password-wrap {
        background: #fff;
        padding: 40px;
        border-radius: 16px
    }

    .password-input {
        background: #F5F8FA;
        height: 40px;
        border-radius: 6px;
        width: 100%;
        outline: none;
        box-shadow: none;
        border: 0;
        padding: 0 1em;
    }

    .change-password {
        width: 300px;
        height: 45px;
        /*background: linear-gradient(90deg, rgba(42, 173, 255, 1) 0%, rgba(55, 116, 250, 1) 100%);*/
        /*border-radius: 6px;*/
        margin-top: 25px;
        /*border: 0;*/
        /*outline: none;*/
        /*box-shadow: none;*/
    }
</style>
