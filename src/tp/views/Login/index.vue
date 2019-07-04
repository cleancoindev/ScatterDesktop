<template>
    <section class="login-wrap">
        <section class="login-left">
            <!-- left content -->
            <section>
                <h3 class="ft-36 c-2e294e" style="">
                    {{isNewScatter ? $t('TP.GENERIC.Setting') : $t('TP.GENERIC.Login')}}
                </h3>

                <h4 class="ft-24 c-c4c7d2">{{$t('TP.GENERIC.Password')}}</h4>

                <h5 class="ft-14" style="font-weight: normal" v-if="isNewScatter">
                    {{$t('TP.LOGIN.CANT_LOGIN_NOTICE_4')}}</h5>

                <!-- 密码 -->
                <figure>
                    <input class="tp-input" type="password"
                           :placeholder="isNewScatter ? $t('TP.LOGIN.SET_PASSWORD_DESC') : $t('TP.LOGIN.PASSWORD_DESC')"
                           v-model="password"
                           @keyup.enter="unlock"/>
                </figure>

                <!-- 密码确认 -->
                <figure v-show="isNewScatter">
                    <input class="login-input" type="password"
                           :placeholder="$t('TP.LOGIN.CONFIRM_PASSWORD_DESC')"
                           @keyup.enter="checkPassword"
                           v-model="confirmation"/>
                </figure>

                <!-- 创建 -->
                <figure v-show="isNewScatter">
                    <button class="tp-button login-btn c-fff ft-24 pointer"
                            :class="{'on': password.length > 0 && password === confirmation}"
                            @click="checkPassword"
                            v-loading="workLoading"
                            element-loading-spinner="el-icon-loading">
                        {{$t('TP.GENERIC.Confirm')}}
                    </button>
                </figure>

                <!--                {{password}}-->
                <!-- 登录 -->
                <figure v-show="!isNewScatter">
                    <button class="tp-button loading login-btn c-fff ft-24"
                            v-loading="workLoading"
                            element-loading-spinner="el-icon-loading"
                            :class="{'on': password.length > 0}"
                            @click="unlock">
                        {{$t('TP.GENERIC.Login')}}
                    </button>
                </figure>

                <!-- 忘记密码 -->
                <figure v-show="!isNewScatter">
                    <span class="ft-14 pointer" style="color: #2980FE;margin-top: 24px;display: inline-block"
                          @click="forgetPwd">
                        {{$t('TP.LOGIN.CANT_LOGIN')}}?
                    </span>
                </figure>

            </section>


            <section class="change-language ft-16">
                <span class="pointer" :class="{'active': currentLanguage === 'zh'}"
                      @click="changeLanguage('zh')">中</span>
                <span class="pointer" :class="{'active': currentLanguage === 'en'}"
                      @click="changeLanguage('en')">EN</span>
            </section>

        </section>

        <!-- right logo -->
        <section class="login-right text-center">
            <img class="logo-img" src="../../assets/images/common/login.png" alt="">
            <h3 class="ft-36 c-fff">TOKEN POCKET</h3>
            <h5 class="ft-14">YOUR UNIVERSAL DIGITAL WALLET</h5>
        </section>

        <!-- 忘记密码 -->
        <el-dialog :visible.sync="dialogVisible" width="40%">
            <h3 class="text-center c-333 ft-20">{{$t('TP.LOGIN.NOTICE')}}</h3>
            <p class="c-333 ft-16" style="line-height: 1.5">{{$t('TP.LOGIN.CANT_LOGIN_DESC')}}</p>
            <br>
            <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.LOGIN.NOTICE')}}：</p>
            <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.LOGIN.CANT_LOGIN_NOTICE_1')}}</p>
            <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.LOGIN.CANT_LOGIN_NOTICE_2')}}</p>
            <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.LOGIN.CANT_LOGIN_NOTICE_3')}}</p>
            <br>
            <br>

            <div class="c-333 text-center">
                <button class="tp-button on"
                        style="width: 150px;border-radius: 20px"
                        @click="destroy">{{$t('TP.GENERIC.Confirm')}}
                </button>
            </div>

        </el-dialog>

        <!--        <section class="entry" v-if="state === STATES.NEW_OR_LOGIN" :class="{'success':success}">-->
        <!--            <figure class="login-bg">-->
        <!--                <img src="../../../assets/login_bg.png" />-->
        <!--            </figure>-->
        <!--            <section class="meteors">-->
        <!--                <section class="rotator">-->
        <!--                    <figure class="shooting_star" v-for="i in new Array(20).keys()"></figure>-->
        <!--                </section>-->
        <!--            </section>-->

        <!--            <section class="head">-->
        <!--                <section class="details">-->
        <!--                    <figure class="logo scatter-logologo"></figure>-->
        <!--                    <figure class="version">meteoric</figure>-->
        <!--                </section>-->
        <!--            </section>-->

        <!-------------------------->
        <!------ NEW SCATTER ------->
        <!-------------------------->
        <!--            <section class="body">-->
        <!--                <section v-if="isNewScatter">-->
        <!--                    <LoginButton-->
        <!--                            @click.native="state = STATES.CREATE_NEW"-->
        <!--                            primary="1"-->
        <!--                            title="I'm new to blockchain"-->
        <!--                            description="We'll set you up with a new blockchain account" />-->
        <!--                    <LoginButton-->
        <!--                            @click.native="state = STATES.IMPORT_KEYS"-->
        <!--                            title="I have my own private keys"-->
        <!--                            description="Import your accounts manually" />-->
        <!--                </section>-->

        <!-------------------------->
        <!---- EXISTING SCATTER ---->
        <!-------------------------->
        <!--                <section v-if="!isNewScatter">-->
        <!--                    <Input class="welcome-password" :focus="true" big="1" for-login="1"-->
        <!--                           placeholder="Enter your password"-->
        <!--                           type="password" :disabled="opening || isLockedOut"-->
        <!--                           :loader-on-dynamic="opening && !success"-->
        <!--                           :text="password" v-on:enter="unlock" v-on:dynamic="unlock" v-on:changed="x => password = x"-->
        <!--                           :dynamic-button="badPassword ? 'icon-cancel' : success ? 'icon-check' : isLockedOut ? '' : 'icon-right-open-big'" :hide-dynamic-button="!password.length" />-->

        <!--                </section>-->
        <!--            </section>-->

        <!--            <section class="tail">-->
        <!--                &lt;!&ndash;<section class="terms">&ndash;&gt;-->
        <!--                &lt;!&ndash;Use of Scatter is limited to our <u>Terms of Use</u>.<br>&ndash;&gt;-->
        <!--                &lt;!&ndash;Please make sure to also read our <u>Privacy Policy</u>.&ndash;&gt;-->
        <!--                &lt;!&ndash;</section>&ndash;&gt;-->
        <!--                <section class="actions">-->
        <!--                    <section class="action" @click="destroy" v-if="!isNewScatter">-->
        <!--                        <Reset class="logo" />-->
        <!--                        <figure class="text">Reset</figure>-->
        <!--                    </section>-->
        <!--                    <section class="action" @click="importBackup" v-if="isNewScatter">-->
        <!--                        <Restore class="logo" />-->
        <!--                        <figure class="text">Restore</figure>-->
        <!--                    </section>-->
        <!--                    <section class="action" @click="goToSupport">-->
        <!--                        <Support class="logo" />-->
        <!--                        <figure class="text">Support</figure>-->
        <!--                    </section>-->
        <!--                </section>-->
        <!--            </section>-->

        <!--        </section>-->


        <!-------------------------->
        <!-- CREATING NEW SCATTER (No keys) -->
        <!-------------------------->
        <!--        <section class="onboard" v-if="state === STATES.CREATE_NEW">-->
        <!--            <ProgressBubbles :total="steps" :index="step" />-->

        <!--            <section class="panel">-->
        <!--                <Terms v-if="step === 1" v-on:back="stepBack" v-on:next="stepForward" />-->
        <!--                <SetPassword v-if="step === 2" v-on:back="stepBack" v-on:next="stepForward" />-->
        <!--                &lt;!&ndash;<SelectBackupLocation v-if="step === 3" v-on:back="stepBack" v-on:next="stepForward" />&ndash;&gt;-->
        <!--                <Welcome v-if="step === 3" />-->
        <!--            </section>-->

        <!--        </section>-->


        <!-------------------------->
        <!-- CREATING NEW SCATTER (Has keys) -->
        <!--        &lt;!&ndash;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
        <!--        <section class="onboard" v-if="state === STATES.IMPORT_KEYS">-->
        <!--            <ProgressBubbles :total="steps" :index="step" />-->

        <!--            <section class="panel">-->
        <!--                <Terms v-if="step === 1" v-on:back="stepBack" v-on:next="stepForward" />-->
        <!--                <SetPassword v-if="step === 2" v-on:back="stepBack" v-on:next="importKeypair" />-->
        <!--                <Welcome v-if="step === 4" />-->
        <!--            </section>-->

        <!--        </section>-->

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex';
    import * as Actions from '../../../store/constants';

    import ProgressBubbles from '../../../components/reusable/ProgressBubbles';
    import ActionBar from '../../../components/reusable/ActionBar';
    import LoginButton from '../../../components/login/LoginButton';
    import Terms from '../../../components/login/Terms';
    import SetPassword from '../../../components/login/SetPassword';
    import SelectBackupLocation from '../../../components/login/SelectBackupLocation';
    import Welcome from '../../../components/login/Welcome';
    import PopupService from '../../../services/utility/PopupService';
    import PasswordService from '../../../services/secure/PasswordService';
    import StoreService from '../../../services/utility/StoreService';
    import { Popup } from '../../../models/popups/Popup';

    import SpaceBackground from '../../../components/backgrounds/SpaceBackground';
    import Reset from '../../../components/svgs/login/Reset';
    import Restore from '../../../components/svgs/login/Restore';
    import Support from '../../../components/svgs/login/Support';
    import ElectronHelpers from '../../../util/ElectronHelpers';
    import BackupService from '../../../services/utility/BackupService';


    import { RouteNames } from '../../../vue/Routing';

    const STATES = {
        NEW_OR_LOGIN: 'newOrLogin',
        CREATE_NEW: 'createNew',
        IMPORT_KEYS: 'importKeys',
        IMPORT_BACKUP: 'importBackup',
    };


    const lockoutTime = 1000 * 60 * 5;
    const resetLockout = () => window.localStorage.removeItem('lockout');
    const getLockout = () => JSON.parse(window.localStorage.getItem('lockout') || JSON.stringify({
        tries: 0,
        stamp: 0
    }));
    const setLockout = () => {
        const lockout = getLockout();
        lockout.tries++;
        lockout.stamp = +new Date();
        return window.localStorage.setItem('lockout', JSON.stringify(lockout));
    };


    export default {
        components: {
            SpaceBackground,
            Welcome,
            SelectBackupLocation,
            ActionBar,
            ProgressBubbles,
            LoginButton,
            SetPassword,
            Terms,

            Reset,
            Restore,
            Support,
        },
        data() {
            return {
                state: STATES.NEW_OR_LOGIN,
                STATES,

                step: 2,
                password: '',
                opening: false,
                success: false,
                badPassword: false,

                confirmation: '',
                dialogVisible: false,
                workLoading: false
            };
        },
        created() {
            // console.log(this.$i18n);
        },
        computed: {
            ...mapState([
                'scatter',
            ]),
            ...mapGetters([
                'tpAccounts',
                'currentLanguage',
                'currentAccount'
            ]),
            isNewScatter() {
                return !this.scatter;
            },
            steps() {
                switch (this.state) {
                    case STATES.CREATE_NEW:
                        return 3;
                    case STATES.IMPORT_KEYS:
                        return 4;
                    case STATES.IMPORT_BACKUP:
                        return 3;
                }
            },
            lockedTimeLeft() {
                return (this.lockedOutTime - this.now) / 1000;
            },
            isLockedOut() {
                return this.lockedTimeLeft > 0 && this.lockedOutTime > 0;
            }
        },
        methods: {
            forgetPwd() {
                this.dialogVisible = true;
            },

            changeLanguage(lang) {
                this.$i18n.locale = lang;
                this.$store.dispatch('SET_CURRENT_LANGUAGE', lang);
            },

            goDApp() {
                if (this.tpAccounts.length === 0) {
                    this.importKeypair();
                } else {
                    this.$store.dispatch('INIT_USER_INFO', this.currentAccount);
                    this.$router.push({ name: this.RouteNames.DAPP });
                }
            },

            importKeypair() {
                this.$router.push({ name: RouteNames.IMPORT_TEXT_KEY });
            },

            async go() {
                const scatter = this.scatter.clone();
                scatter.onboarded = true;
                await this[Actions.SET_SCATTER](scatter);

                this.goDApp();
            },

            async checkPassword() {
                if (!PasswordService.isValidPassword(this.password, this.confirmation)) return false;
                await this[Actions.CREATE_SCATTER](this.password);
                this.go();
            },

            async unlock(usingLocalStorage = false) {
                if (!usingLocalStorage) {
                    const lockout = getLockout();
                    if (lockout.tries >= 5 && +new Date() < lockout.stamp + lockoutTime) {
                        this.lockedOutTime = lockout.stamp + lockoutTime;
                        return PopupService.push(Popup.snackbar(this.locale(this.langKeys.SNACKBARS.AUTH.LockedOut), 'attention-circled'));
                    }
                    if (this.opening) return;
                    this.opening = true;
                }

                if (!this.password) return false;

                this.workLoading = true;
                setTimeout(async () => {
                    await this[Actions.SET_SEED](this.password);
                    await this[Actions.LOAD_SCATTER](usingLocalStorage);
                    if (typeof this.scatter === 'object' && !this.scatter.isEncrypted()) {
                        resetLockout();
                        setTimeout(() => {
                            if (!this.scatter.onboarded) {
                                PopupService.push(Popup.showTerms(async accepted => {
                                    if (!accepted) {
                                        await this[Actions.SET_SEED](null);
                                        await this[Actions.LOAD_SCATTER](false);
                                        this.opening = false;
                                        return;
                                    }

                                    const clone = this.scatter.clone();
                                    clone.onboarded = true;
                                    await this[Actions.SET_SCATTER](clone);

                                    if (!this.scatter.settings.backupLocation.length) {
                                        await BackupService.setDefaultBackupLocation();
                                    }

                                    this.success = true;

                                    this.goDApp();

                                    this.workLoading = false;
                                }));
                            } else {
                                this.success = true;
                                this.goDApp();
                                this.workLoading = false;
                            }
                        }, 1000);
                    } else {
                        if (!usingLocalStorage) return this.unlock(true);
                        this.opening = false;
                        this.badPassword = true;
                        PopupService.push(Popup.snackbarBadPassword());
                        setLockout();
                        this.workLoading = false;
                    }
                }, 400);
            },

            async destroy() {
                await this.$store.dispatch('DESTROY_ACCOUNT');
                ElectronHelpers.reload()
            },


            ...mapActions([
                Actions.SET_SEED,
                Actions.LOAD_SCATTER,
                Actions.SET_SCATTER,
                Actions.CREATE_SCATTER,
            ])
        },
        watch: {
            ['password']() {
                this.badPassword = false;
            }
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">

    .login-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .login-left {
            flex: 1;
            height: 100%;
            padding: 0 50px;
            position: relative;

            h3 {
                padding: 140px 0 120px 0;
                margin: 0;
            }

            h4 {
                margin: 0;
                padding-bottom: 10px;
            }

            .login-input {
                outline: none;
                border: 0;
                border-bottom: 1px solid #E5E6F2;
                padding: 15px 0;
                width: 100%;
                font-size: 16px;
            }

            .login-btn {
                margin-top: 56px;
                width: 250px;
                height: 56px;
                border-radius: 14px;
            }

            .change-language {
                position: absolute;
                bottom: 25px;
                left: 50%;
                transform: translateX(-50%);

                span {
                    display: inline-block;
                    color: #C4C7D2;
                    padding: 0 24px;

                    &:first-child {
                        border-right: 1px solid #E5E6F2;
                    }

                    &.active {
                        color: #2E294E;
                    }
                }
            }
        }

        .login-right {
            width: 620px;
            height: 100%;
            background: linear-gradient(180deg, rgba(81, 189, 255, 1) 0%, rgba(39, 97, 231, 1) 100%);

            .logo-img {
                width: 185px;
                margin-top: 150px;
                margin-bottom: 50px;
            }

            h5 {
                color: #86ADFF;
                margin-top: 200px
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

    /deep/ .el-dialog__wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /deep/ .el-dialog__body {
        padding: 10px 20px 20px;
    }

    /deep/ .el-dialog {
        margin: 0 !important;
        border-radius: 10px;
    }

    /deep/ .el-dialog__headerbtn {
        left: 20px;
        right: inherit;
    }
</style>
