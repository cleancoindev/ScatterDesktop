<template>
  <section class="TP-wallets">
    <!-- 账号列表 -->
    <section class="accounts" v-if="walletList.length > 0">
      <section class="account-item" v-for="(account, index) in walletList" :key="index">
        <section class="account-blockchain">
          <section class="blockchain-left">
            <figure class="network">
              {{blockchainName(account.blockchain())}} -
              <b>{{account.network().name}}</b>
            </figure>

            <section class="authorities">
              <figure
                class="authority"
                v-for="(acc, index) in account.authorities()"
                :key="index"
                :class="{'red':acc.authority === 'owner'}"
              >{{acc.authority}}</figure>
            </section>
          </section>

          <section class="blockchain-right text-right">
            <figure
              class="authority export pointer"
              @click="exportPrivate(account)"
            >{{$t('TP.GENERIC.Export')}}</figure>

            <figure
              class="authority delete pointer"
              @click="getAccountInfo(account)"
            >{{$t('TP.GENERIC.Delete')}}</figure>
          </section>
        </section>

        <figure class="account-name ft-20">{{account.sendable()}}</figure>

        <section class="account-resource">
          <section class="loading" v-if="!account.resource">
            <figure class="spinner icon-spin4 animate-spin"></figure>
          </section>

          <section class="resources" v-if="account.resource">
            <section
              class="moderation text-center"
              v-for="(resource, index) in account.resource"
              :key="index"
            >
              <figure>
                <percentage :percentage="resource.percentage">
                  <figure class="name c-c4c7d2">{{resource.name}}</figure>
                </percentage>
              </figure>

              <figure class="ft-14">
                <span class="c-c4c7d2" v-if="resource.total">{{$t('TP.GENERIC.Mortgage')}}：</span>
                {{resource.total}}&emsp;
              </figure>

              <figure class="ft-14">
                <span class="c-c4c7d2">{{$t('TP.GENERIC.Available')}}：</span>
                {{resource.used}} {{resource.unit}} / {{resource.max}} {{resource.unit}}
              </figure>
            </section>
          </section>
        </section>
      </section>
    </section>

    <section v-if="walletList.length === 0">
        <ImportKeypair/>
    </section>

    <!-- 删除权限 -->
    <!-- 遮罩层 -->
    <section class="account-unlink" v-show="accountUnlinkState" @click="resetState"></section>
    <section class="account-unlink-right text-center" :class="{'on': accountUnlinkState}">
      <img style="width: 80px;margin-bottom: 20px" src="../../assets/images/common/delete.png" alt />

      <div v-if="accountInfo.account.blockchain && accountInfo.account.blockchain() === 'eos'">
        <p class="ft-20 c-fff m-bottom-15">{{accountInfo.name}}</p>

        <p class="ft-14 c-828494 m-bottom-15">{{$t('TP.WALLET.UNLINK_ACCOUNT.SubDesc')}}</p>
        <p
          class="ft-12 c-fff m-bottom-15 text-left"
        >{{$t('TP.WALLET.UNLINK_ACCOUNT.AuthoritiesLabel')}}</p>

        <!-- 权限 -->
        <section>
          <figure
            class="account-authorities pointer"
            v-for="(item, index) in accountInfo.authorities"
            :key="index"
            :class="{'active': hasSelector(item)}"
            @click="addOrRemoveAuthority(item)"
          >{{item.title}}</figure>
        </section>
      </div>

    <!-- 删除确定 -->
      <section style="margin-top: 50px;">
        <button
          class="tp-button"
          :class="{'on': selectedAuthorities.length > 0 || (accountInfo.account.blockchain && accountInfo.account.blockchain() !== 'eos')}"
          @click="unlinkAccount"
        >{{$t('TP.GENERIC.Confirm')}}</button>
      </section>
    </section>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Percentage from "../../components/common/Progress";

import ResourceService from "../../../services/blockchain/ResourceService";
import Process from "../../../models/Process";
import _ from "underscore";

// import ExportPrivateKey from './ExportPrivateKey';

import KeyPairService from "../../../services/secure/KeyPairService";
import AccountService from "../../../services/blockchain/AccountService";
import BalanceService from "../../../services/blockchain/BalanceService";
import * as Actions from "../../../store/constants";

import PopupService from "../../../services/utility/PopupService";
import { Popup } from "../../../models/popups/Popup";


import ImportKeypair from '../Keypair/ImportKeypair'

const DASH_STATES = {
  ADD_ACCOUNT: "addAccount",
  ACCOUNTS: "accounts",
  PUBLIC_KEYS: "publicKeys"
};

export default {
  props: ["keypair", "accountList"],
  components: {
    Percentage,
    ImportKeypair
  },

  data() {
    return {
      scrollerAtTop: true,
      dashState: DASH_STATES.ACCOUNTS,
      DASH_STATES,

      searchTerms: "",
      manualAccountNetwork: null,

      newAccountName: "",
      accountUnlinkState: false,
      accountInfo: {
        account: {},
        name: "",
        authorities: []
      },
      selectedAuthorities: [],

      isExport: false,
      exportAccountInfo: {}
    };
  },

  computed: {
    ...mapState(["resources"]),
    ...mapGetters([
      "keypairs",
      "accounts",
      "networks",
      "tpAccounts",
      "currentAccount"
    ]),
    usesResources() {
      return ResourceService.usesResources(this.currentAccount);
    },

    walletList() {
      return this.tpAccounts.map(account => {
        account.resource = this.resources[account.identifiable()] || [];
        return account;
      });
    },

    accountResources() {
      return this.tpAccounts.map(account => {
        const resource = this.resources[account.identifiable()];
        return resource ? resource : null;
      });
    }
  },

  filters: {
    // 权限
    authorities(account) {
      return account.authorities().map(x => x.authority);
    }
  },

  mounted() {
    this.tpAccounts.forEach(account => {
      this.lazyLoadResources(account);
    }, 200);
  },

  methods: {
    async lazyLoadResources(account) {
      const processKey = `resources:${account.unique()}`;
      if (Process.isProcessRunning(processKey)) return;
      const accounts = [account];
      if (accounts.length) {
        let process = Process.loadResources(processKey, false);
        const resources = await ResourceService.getResourcesFor(account);
        this[Actions.ADD_RESOURCES]({
          acc: account.identifiable(),
          res: resources
        });
        process.updateProgress(100);
      }
    },

    accountUnlink(account) {
      this.$emit("delete", account);
    },

    exportPrivate(account) {
      PopupService.push(
        Popup.verifyPassword(verified => {
          if (!verified) return false;
          this.$router.push({
            name: "ExportPrivateKey",
            query: { id: account.keypair().id }
          });
        })
      );
    },

    getAccountInfo(account) {
      this.accountInfo.account = account;
      this.accountInfo.name = account.name;
      this.accountInfo.authorities = account.authorities().map(x => ({
        id: x.authority,
        title: x.authority
      }));

      this.accountUnlinkState = true;
      this.selectedAuthorities = [];
    },

    getExportAccountInfo(exportAccountInfo) {
      this.exportAccountInfo = exportAccountInfo;
      this.isExport = true;
    },

    async resetState() {
      // await this.$store.dispatch('GET_WALLET_LIST');
      this.accountUnlinkState = false;
      this.selectedAuthorities = [];
    },

    hasSelector(item) {
      return this.selectedAuthorities.indexOf(item.id) !== -1;
    },

    addOrRemoveAuthority(item) {
      const removing = !!this.selectedAuthorities.find(x => x === item.id);
      this.selectedAuthorities = this.selectedAuthorities.filter(
        x => x !== item.id
      );
      if (!removing) this.selectedAuthorities.push(item.id);
    },

    async unlinkAccount() {
      // 获取当前key下账户数量
      let account = this.accounts.filter(
        account =>
          account.keypairUnique === this.accountInfo.account.keypairUnique
      );
      // 移除keypair
      if (
        account.length <= 1 ||
        (this.selectedAuthorities.length ===
          this.accountInfo.authorities.length &&
          account.length <= this.accountInfo.authorities.length)
      ) {
        const keypair = this.keypairs.find(
          keypair => keypair.id === this.accountInfo.account.keypairUnique
        );
        await KeyPairService.removeKeyPair(keypair);
        await BalanceService.removeStaleBalances();

        // await this.$store.dispatch('REMOVE_CURRENT_ACCOUNT');
        this.resetState();
      } else {
        // 移除关联账号
        this.unlink();
      }
    },

    async unlink() {
      let accounts = [];
      if (this.accountInfo.authorities.length) {
        accounts = this.accounts.filter(account => {
          return (
            account.identifiable() ===
              this.accountInfo.account.identifiable() &&
            account.keypairUnique === this.accountInfo.account.keypairUnique &&
            this.selectedAuthorities.includes(account.authority)
          );
        });
      } else {
        accounts = [this.account];
      }

      await AccountService.removeAccounts(accounts);
      this.resetState();
    },

    ...mapActions([Actions.ADD_RESOURCES])
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../styles/variables";

.btn {
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #232538;
  color: #232538;
  border-radius: 10px;
  display: inline-block;
  margin-right: 3px;
  padding: 5px 15px;
}

.authority {
  @extend .btn;

  &.red {
    margin-left: 15px;
    border: 1px solid #2980fe;
    color: #2980fe;
  }

  &.delete {
    color: #fff;
    background: #fa6464;
    border-radius: 8px;
    border-color: #fa6464;
  }

  &.export {
    color: #fff;
    background: #2980fe;
    border-radius: 8px;
    border-color: #2980fe;
  }
}

.TP-wallets {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f3f4f8 !important;
  position: relative;

  padding: 24px 32px;
  transition: top 0.4s ease, padding-top 0.2s ease;

  .accounts {
    .account-item {
      background: #fff;
      flex: 1;
      margin-bottom: 20px;
      border-radius: 12px;
      padding: 20px 25px;

      .account-blockchain {
        display: flex;
        align-items: center;

        .blockchain-left {
          flex: 2;
          display: flex;
          align-items: center;

          .authorities {
            margin-left: 1em;
          }
        }

        .blockchain-right {
          flex: 1;
        }
      }

      .account-resource {
        margin-top: 20px;

        .resources {
          display: flex;
          justify-content: center;
          align-items: center;

          .moderation {
            flex: 1;
          }
        }
      }
    }
  }
}

.account-unlink {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.account-unlink-right {
  position: fixed;
  top: 0;
  width: 280px;
  height: 100vh;
  background: #1c1e2f;
  right: -280px;
  transition: all 0.5s ease-in-out;
  opacity: 0;
  padding: 75px 17px;

  &.on {
    right: 0;
    opacity: 1;
  }

  .account-authorities {
    background: #2b2d3c;
    border-radius: 6px;
    padding: 8px 0;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
    transition: all 0.3s linear;

    &.active {
      position: relative;

      &:after {
        position: absolute;
        top: -2px;
        bottom: -2px;
        left: -2px;
        right: -2px;
        background: linear-gradient(
          180deg,
          rgba(82, 182, 255, 1),
          rgba(41, 128, 254, 1)
        );
        content: "";
        z-index: -1;
        border-radius: 6px;
      }
    }
  }
}
</style>
