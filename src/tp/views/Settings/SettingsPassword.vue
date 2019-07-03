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
                       :placeholder="$t('TP.PASSWORD.NewPasswordPlaceholder')"
                        v-model="password"/>
            </section>

            <section>
                <h4 style="margin: 1em 0;" class="ft-16 c-232538">
                    {{$t('TP.PASSWORD.ConfirmPasswordLabel')}}
                </h4>

                <input class="password-input ft-14" type="password"
                       :placeholder="$t('TP.PASSWORD.ConfirmPasswordPlaceholder')"
                        v-model="confirmPassword"
                        @keyup.enter="changePassword"/>
            </section>


            <section class="text-center">
                <button class="tp-button change-password c-fff ft-16 pointer"
                        :class="{'on': password.length > 0 && (password === confirmPassword)}"
                        @click="changePassword">
                    {{$t('TP.PASSWORD.ChangePasswordButton')}}
                </button>
            </section>
        </section>

        <!--<section class="action-box top-pad">-->
            <!--<label>{{$t('TP.GENERIC.PASSWORD.ViewMnemonicLabel)}}</label>-->
            <!--<p>{{$t('TP.GENERIC.PASSWORD.ViewMnemonicDescription)}}</p>-->

            <!--<btn v-on:clicked="viewMnemonic" :text="$t('TP.GENERIC.PASSWORD.ViewMnemonicButton)" />-->
        <!--</section>-->

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../../../store/constants';

    import PasswordService from '../../../services/secure/PasswordService';
    import PopupService from '../../../services/utility/PopupService';
    import {Popup} from '../../../models/popups/Popup';

    export default {
    	props:['mnemonic'],
        data () {
    	  return {
            password:'',
            confirmPassword:''
            }
        },
        computed:{
            ...mapState([
                'scatter'
            ])
        },
        mounted(){
        },
        methods: {
            async changePassword(){
                // if (this.password === '') {
                //     this.$notify.error({
                //         title: 'Error',
                //         message: 'Please enter new password',
                //         offset: 50,
                //         duration: 3000
                //     });
                //     return false
                // }

                // if (this.confirmPassword === '') {
                //     this.$notify.error({
                //         title: 'Error',
                //         message: 'Please enter confirm new password',
                //         offset: 50,
                //         duration: 3000
                //     });
                //     return false
                // }

                // if (this.password !== this.confirmPassword) {
                //     this.$notify.error({
                //         title: 'Error',
                //         message: 'Inconsistent passwords',
                //         offset: 50,
                //         duration: 3000
                //     });
                //     return false
                // }

                if(!PasswordService.isValidPassword(this.password, this.confirmPassword)) return false;

                const mnemonic = await PasswordService.changePassword(this.password);
                this.$emit('mnemonic', mnemonic);
                PopupService.push(Popup.mnemonic(mnemonic));
                PopupService.push(Popup.snackbar(this.locale(this.langKeys.SETTINGS.PASSWORD.ChangedPasswordSnackbar), "lock"));
                this.password = '';
                this.confirmPassword = '';
            },

	        viewMnemonic(){
                PopupService.push(Popup.mnemonic(this.mnemonic));
            },

            ...mapActions([
                Actions.SET_SCATTER
            ])
        },
    }
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
