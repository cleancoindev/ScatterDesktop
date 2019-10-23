<template>
  <section class="login-wrap">
    <section class="login-left">
      <!-- left content -->
      <section>
        <h3 class="ft-36 c-2e294e" style>
          {{isNewScatter ? $t('TP.GENERIC.Setting') : $t('TP.GENERIC.Login')}}
          <h5
            class="ft-18"
            style="font-weight: normal;color: #666;margin-top:15px;"
            v-if="isNewScatter"
          >{{$t('TP.GENERIC.LOGIN.CANT_LOGIN_NOTICE_4')}}</h5>
        </h3>

        <h4 class="ft-24 c-c4c7d2">{{$t('TP.GENERIC.Password')}}</h4>

        <!-- 密码 -->
        <figure>
          <input
            class="tp-input"
            type="password"
            :placeholder="isNewScatter ? $t('TP.GENERIC.LOGIN.SET_PASSWORD_DESC') : $t('TP.GENERIC.LOGIN.PASSWORD_DESC')"
            v-model="password"
            @keyup.enter="unlock"
          />
        </figure>

        <!-- 密码确认 -->
        <figure v-show="isNewScatter">
          <input
            class="login-input"
            type="password"
            :placeholder="$t('TP.GENERIC.LOGIN.CONFIRM_PASSWORD_DESC')"
            @keyup.enter="checkPassword"
            v-model="confirmation"
          />
        </figure>

        <!-- 创建 -->
        <figure v-show="isNewScatter">
          <button
            class="tp-button login-btn c-fff ft-24 pointer"
            :class="{'on': password.length > 0 && password === confirmation}"
            @click="checkPassword"
            v-loading="workLoading"
            element-loading-spinner="el-icon-loading"
          >{{$t('TP.GENERIC.Confirm')}}</button>
        </figure>

        <!--                {{password}}-->
        <!-- 登录 -->
        <figure v-show="!isNewScatter">
          <button
            class="tp-button loading login-btn c-fff ft-24"
            v-loading="workLoading"
            element-loading-spinner="el-icon-loading"
            :class="{'on': password.length > 0}"
            @click="unlock"
          >{{$t('TP.GENERIC.Login')}}</button>
        </figure>

        <!-- 忘记密码 -->
        <figure v-show="!isNewScatter">
          <span
            class="ft-14 pointer"
            style="color: #2980FE;margin-top: 24px;display: inline-block"
            @click="forgetPwd"
          >{{$t('TP.GENERIC.LOGIN.CANT_LOGIN')}}?</span>
        </figure>
      </section>

      <section class="change-language ft-16">
        <span
          class="pointer"
          :class="{'active': currentLanguage === 'zh'}"
          @click="changeLanguage('zh')"
        >中</span>
        <span
          class="pointer"
          :class="{'active': currentLanguage === 'en'}"
          @click="changeLanguage('en')"
        >EN</span>
      </section>
    </section>

    <!-- right logo -->
    <section class="login-right text-center">
      <img class="logo-img" src="../../assets/images/common/login.png" alt />
      <h3 class="ft-36 c-fff">TOKEN POCKET</h3>
      <h5 class="ft-14">YOUR UNIVERSAL DIGITAL WALLET</h5>
    </section>

    <!-- 忘记密码 -->
    <el-dialog :visible.sync="dialogVisible" width="40%">
      <h3 class="text-center c-333 ft-20">{{$t('TP.GENERIC.LOGIN.NOTICE')}}</h3>
      <p class="c-333 ft-16" style="line-height: 1.5">{{$t('TP.GENERIC.LOGIN.CANT_LOGIN_DESC')}}</p>
      <br />
      <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.GENERIC.LOGIN.NOTICE')}}：</p>
      <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.GENERIC.LOGIN.CANT_LOGIN_NOTICE_1')}}</p>
      <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.GENERIC.LOGIN.CANT_LOGIN_NOTICE_2')}}</p>
      <p class="c-333 ft-14" style="line-height: 1.5">{{$t('TP.GENERIC.LOGIN.CANT_LOGIN_NOTICE_3')}}</p>
      <br />
      <br />

      <div class="c-333 text-center">
        <button
          class="tp-button on"
          style="width: 150px;border-radius: 20px"
          @click="destroy"
        >{{$t('TP.GENERIC.Confirm')}}</button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import * as Actions from "../../../store/constants";

import PopupService from "../../../services/utility/PopupService";
// import PasswordService from "../../../services/secure/PasswordService";
import BackupService from "../../../services/utility/BackupService";
import { Popup } from "../../../models/popups/Popup";
import { RouteNames } from "../../../vue/Routing";

// import ElectronHelpers from "../../../util/ElectronHelpers";
// import StoreService from "../../../services/utility/StoreService";
// import ProgressBubbles from "../../../components/reusable/ProgressBubbles";
// import ActionBar from "../../../components/reusable/ActionBar";
// import LoginButton from "../../../components/login/LoginButton";
// import Terms from "../../../components/login/Terms";
// import SetPassword from "../../../components/login/SetPassword";
// import SelectBackupLocation from "../../../components/login/SelectBackupLocation";
// import Welcome from "../../../components/login/Welcome";
// import SpaceBackground from "../../../components/backgrounds/SpaceBackground";
// import Reset from "../../../components/svgs/login/Reset";
// import Restore from "../../../components/svgs/login/Restore";
// import Support from "../../../components/svgs/login/Support";
// import SocketService from "../../../services/utility/SocketService";
// import StorageService from "../../../services/utility/StorageService";

// const STATES = {
//   NEW_OR_LOGIN: "newOrLogin",
//   CREATE_NEW: "createNew",
//   IMPORT_KEYS: "importKeys",
//   IMPORT_BACKUP: "importBackup"
// };

const lockoutTime = 1000 * 60 * 5;
const resetLockout = () => window.localStorage.removeItem("lockout");
const getLockout = () =>
  JSON.parse(
    window.localStorage.getItem("lockout") ||
      JSON.stringify({
        tries: 0,
        stamp: 0
      })
  );
const setLockout = () => {
  const lockout = getLockout();
  lockout.tries++;
  lockout.stamp = +new Date();
  return window.localStorage.setItem("lockout", JSON.stringify(lockout));
};

export default {
  components: {
    // SpaceBackground,
    // Welcome,
    // SelectBackupLocation,
    // ActionBar,
    // ProgressBubbles,
    // LoginButton,
    // SetPassword,
    // Terms,
    // Reset,
    // Restore,
    // Support
  },
  data() {
    return {
      // state: STATES.NEW_OR_LOGIN,
      // STATES,

      // step: 2,
      password: "",
      confirmation: "",
      // password: "123123123",
      // confirmation: "123123123",
      opening: false,
      success: false,
      badPassword: false,
      dialogVisible: false,
      workLoading: false
    };
  },
  created() {
    // if (this.scatter) this.unlock();
  },
  computed: {
    ...mapState(["scatter"]),
    ...mapGetters(["tpAccounts", "currentLanguage", "currentAccount"]),
    isNewScatter() {
      return !this.scatter;
    }
    // steps() {
    //   switch (this.state) {
    //     case STATES.CREATE_NEW:
    //       return 3;
    //     case STATES.IMPORT_KEYS:
    //       return 4;
    //     case STATES.IMPORT_BACKUP:
    //       return 3;
    //   }
    // },
    // lockedTimeLeft() {
    //   return (this.lockedOutTime - this.now) / 1000;
    // },
    // isLockedOut() {
    //   return this.lockedTimeLeft > 0 && this.lockedOutTime > 0;
    // }
  },
  methods: {
    forgetPwd() {
      this.dialogVisible = true;
    },

    changeLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("SET_CURRENT_LANGUAGE", lang);
    },

    goDApp() {
      if (this.tpAccounts.length === 0) {
        this.importKeypair();
      } else {
        if (this.currentAccount.blockchain() === "eos") {
          this.$store.dispatch("INIT_USER_INFO", this.currentAccount);
        }

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
      if (this.password) {
        await this[Actions.CREATE_SCATTER](this.password);
        this.go();
      }
      // if (!PasswordService.isValidPassword(this.password, this.confirmation))
      //   return false;
    },

    async unlock(usingLocalStorage = false) {
      if (!usingLocalStorage) {
        const lockout = getLockout();
        if (lockout.tries >= 5 && +new Date() < lockout.stamp + lockoutTime) {
          this.lockedOutTime = lockout.stamp + lockoutTime;
          return PopupService.push(
            Popup.snackbar(
              this.locale(this.langKeys.SNACKBARS.AUTH.LockedOut),
              "attention-circled"
            )
          );
        }
        if (this.opening) return;
        this.opening = true;
      }

      if (!this.password) return false;

      this.workLoading = true;
      setTimeout(async () => {
        await this[Actions.SET_SEED](this.password);
        await this[Actions.LOAD_SCATTER](usingLocalStorage);
        // console.log(usingLocalStorage);
        if (typeof this.scatter === "object" && !this.scatter.isEncrypted()) {
          resetLockout();
          setTimeout(() => {
            if (!this.scatter.onboarded) {
              PopupService.push(
                Popup.showTerms(async accepted => {
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
                })
              );
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
          PopupService.push(Popup.snackbarBadPassword(this.$t('TP.GENERIC.PasswordError')));
          setLockout();
          this.workLoading = false;
        }
      }, 400);
    },

    async destroy() {
      this.$store.dispatch("DESTROY_ACCOUNT");
    },

    ...mapActions([
      Actions.SET_SEED,
      Actions.LOAD_SCATTER,
      Actions.SET_SCATTER,
      Actions.CREATE_SCATTER
    ])
  },
  watch: {
    ["password"]() {
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
      border-bottom: 1px solid #e5e6f2;
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
        color: #c4c7d2;
        padding: 0 24px;

        &:first-child {
          border-right: 1px solid #e5e6f2;
        }

        &.active {
          color: #2e294e;
        }
      }
    }
  }

  .login-right {
    width: 620px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(81, 189, 255, 1) 0%,
      rgba(39, 97, 231, 1) 100%
    );

    .logo-img {
      width: 185px;
      margin-top: 150px;
      margin-bottom: 50px;
    }

    h5 {
      color: #86adff;
      margin-top: 200px;
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
