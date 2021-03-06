<template>
  <section class="tp-sidebar">
    <section class="Tabs">
      <!-- 账号 -->
      <section ref="account">
        <section class="account text-center">
          <h4
            class="ft-16 c-fff pointer"
            @click="accountOptions"
          >{{ currentAccount.sendable ? currentAccount.sendable() : $t('TP.GENERIC.AddKeys') }}</h4>

          <img src="../../assets/images/common/array.png" v-show="currentAccount.sendable" alt />
        </section>
      </section>

      <!-- tab 列表 -->
      <section class="tab-wrap">
        <div v-for="(item, index) in tabList" :key="index">
          <section class="tab-list p-10" v-if="item.isShow">
            <div
              class="tab-ctr pointer"
              :class="{'on': isActive(item.url)}"
              @click="tabChange(item)"
            >
              <div
                class="TP-Font ft-20"
                :class="[item.icon, `${isActive(item.url) ? 'c-fff' : 'c-818394'}`]"
              ></div>
              <span>{{item.title}}</span>
            </div>
          </section>
        </div>
      </section>
    </section>

    <!-- 账号列表 -->
    <section ref="accountWrap" class="account-wrap" :class="{'show': accountState}">
      <!-- 搜索 -->
      <section class="account-search-wrap c-fff text-center ft-20">
        <div class="account-search">
          <i class="TP-Font tp-font-search ft-18"></i>
          <input class="ft-20" type="search" v-model="terms" />
        </div>
      </section>

      <!-- 原始账号数据 -->
      <section class="account-main" v-if="!terms">
        <section
          class="account-list c-fff text-center ft-20 pointer"
          v-for="(account, index) in tpAccounts"
          :key="index"
          @click="handleCommand(account)"
        >
          <i class="platform-icon" :style="{backgroundImage: `url(${platformIcons(account)})`}"></i>
          <span class="account-name">{{account.sendable()}}</span>
          <span
            class="check"
            :class="{'account-check': account.sendable() === currentAccount.sendable()}"
          ></span>
        </section>
      </section>

      <!-- 搜索账号过滤数据 -->
      <section class="account-main" v-if="terms">
        <section
          class="account-list c-fff text-center ft-20 pointer"
          v-for="(account, index) in searchAccountList"
          :key="index"
          @click="handleCommand(account)"
        >
          <i class="platform-icon" :style="{backgroundImage: `url(${platformIcons(account)})`}"></i>
          <span class="account-name">{{account.sendable()}}</span>
          <span
            class="check"
            :class="{'account-check': account.sendable() === currentAccount.sendable()}"
          ></span>
        </section>
      </section>

      <!-- 添加账号 -->
      <section class="account-add">
        <button
          class="tp-button on ft-14"
          style="padding: 15px 0;"
          @click="addAccount"
        >{{$t('TP.GENERIC.AddKeys')}}</button>
      </section>
    </section>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
// import * as Actions from "../../../store/constants";
import { RouteNames } from "../../../vue/Routing";
// import PopupService from "../../../services/utility/PopupService";
// import { Popup } from "../../../models/popups/Popup";
// const ElectronStore = window.require('electron-store')

// const store = new ElectronStore()

export default {
  data() {
    return {
      accountState: false,
      terms: ""
    };
  },
  computed: {
    ...mapState([
      "history",
      "sidebarLocked",
      "scatter",
      "workingScreen",
      "processes"
    ]),
    ...mapGetters(["unlocked", "tpAccounts", "currentAccount", "nim"]),

    tabList() {
      return [
        {
          title: "DApp",
          icon: "tp-font-dqpps",
          url: RouteNames.DAPP,
          isShow: true
        },
        {
          title: this.$t("TP.GENERIC.Chat"),
          icon: "tp-font-chat",
          url: RouteNames.CHAT,
          isShow: this.currentAccount.blockchain() === "eos"
        },
        {
          title: this.$t("TP.GENERIC.Asset"),
          icon: "tp-font-asset",
          url: RouteNames.ASSET,
          isShow: true
        },
        {
          title: this.$t("TP.GENERIC.Wallet"),
          icon: "tp-font-wallet",
          url: RouteNames.WALLET,
          isShow: true
        },
        // { title: this.$t('TP.GENERIC.Wallet'), icon: 'tp-font-wallet', url: RouteNames.WALLETS },
        {
          title: this.$t("TP.GENERIC.Setting"),
          icon: "tp-font-settings",
          url: RouteNames.SETTINGS,
          isShow: true
        }
      ];
    },

    searchAccountList() {
      return this.tpAccounts.filter(
        account =>
          account
            .sendable()
            .toLowerCase()
            .indexOf(this.terms.toLowerCase()) !== -1
      );
    }
  },

  mounted() {
    window.addEventListener("click", this.accountClick, false);
    // console.log(this.currentAccount)
    // console.log(this.currentAccount.sendable)
  },

  beforeDestroy() {
    window.removeEventListener("click", this.accountClick);
  },

  methods: {
    platformIcons(account) {
      switch (account.blockchain()) {
        case "eos":
          return require("../../assets/images/platform/eos.png");
        case "trx":
          return require("../../assets/images/platform/trx.png");
        case "eth":
          return require("../../assets/images/platform/eth.png");
      }
    },

    accountClick(e) {
      // 点击除弹出层外的空白区域
      if (
        this.$refs.account &&
        !this.$refs.account.contains(e.target) &&
        (this.$refs.accountWrap && !this.$refs.accountWrap.contains(e.target))
      )
        this.accountState = false;
    },

    isActive(name) {
      return this.$route.name === name;
    },

    tabChange(item) {
      this.$router.replace({
        name: item.url,
        params: item.params || {}
      });
    },

    accountOptions() {
      if (this.currentAccount.sendable) {
        this.accountState = !this.accountState;
      } else {
        this.addAccount();
      }
    },

    async handleCommand(account) {
      await this.$store.dispatch("SET_CURRENT_ACCOUNT", account);
      if (this.nim) {
        this.nim.destroy({
          done: async err => {
            await this.$store.dispatch("RESET_IM");
            await this.$store.dispatch("INIT_NIM_SDK", account);
          }
        });
      }
    },

    addAccount() {
      this.$router.push({ name: this.RouteNames.IMPORT_TEXT_KEY });
    }
  }
};
</script>

<style scoped lang="scss">
.Tabs {
  width: 160px;
  height: 100%;
  padding: 20px 0;
  background: #232538;
  position: relative;
  z-index: 999;
}

.account {
  display: flex;
  align-items: center;
  background: #2F324E;
  // border-radius: 6px;
  padding: 10px 5px;
  h4 {
    margin: 0;
    opacity: 0.9;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
  }

  img {
    margin-left: 5px;
    height: 12px;
  }
}

.account-wrap {
  position: absolute;
  top: 0;
  left: -120px;
  width: 280px;
  height: 100%;
  overflow: auto;
  background: #1c1e2f;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  z-index: 10;

  &.show {
    left: 160px;
    opacity: 1;
  }

  .account-main {
    height: calc(100vh - 187px);
    overflow: auto;

    .account-list {
      padding: 10px;
      margin: 15px;
      background: rgba(43, 45, 60, 1);
      border-radius: 8px;
      text-align: left;
      font-family: "Monaco";
      display: flex;
      align-items: center;

      .check {
        /*margin-left: 1em;*/
        width: 20px;
        height: 20px;
        display: inline-block;
      }

      .platform-icon {
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-right: 10px;
        background: no-repeat center 100% / cover;
        min-width: 25px;
        min-height: 25px;
      }

      .account-name {
        white-space: nowrap;
        overflow-x: hidden;
        display: inline-block;
        flex: 1;
        text-overflow: ellipsis;
      }
    }
  }

  .account-add {
    margin: 15px;
  }
}

.tab-wrap {
  margin-top: 50px;
}

.tab-list {
  /*padding: 10px;*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-ctr {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 72px;
  color: #818394;
  align-items: center;
  justify-content: center;
  // border-radius: 4px;
}

.tab-ctr.on {
  /*#2AAEFF*/
  /*#2661E7*/
  background: #2980fe;
  color: #fff;
  /*transition: all 0.5s ease-in-out;*/
  opacity: 1;
}

.icon-list {
  margin-bottom: 5px;
}

.account-check {
  display: inline-block;
  width: 32px;
  background: url("../../assets/images/common/check.png") no-repeat 100% / 100%;
}

.account-search-wrap {
  margin: 15px 15px 0;
  .account-search {
    position: relative;
    i {
      position: absolute;
      top: 15px;
      left: 15px;
    }

    input {
      color: #fff;
      height: 47px;
      width: 100%;
      border-radius: 8px;
      text-align: left;
      background: #2b2d3c;
      border: 0;
      outline: none;
      font-family: "Monaco";
      padding-left: 45px;
      padding-right: 10px;
    }
  }
}

.TP-Font {
}

.tp-font-wallet {
  font-size: 24px;
}
</style>
