<template>
  <section class="TokenList">
    <div class="asset-nav">
      <img
        src="../../assets/images/myAssets/asset-refresh.png"
        alt
        class="refresh rotate"
        @click="initAccountToken"
      />
    </div>

    <div class="asset-header text-center">
      <div class="asset-balance c-fff">{{assetTokenInfo.balance || '0.00'}}</div>

      <div class="asset-balance-text c-fff">{{$t('TP.ACCOUNT.ASSET.TotalBalance')}}</div>

      <div class="asset-balance-view" v-if="isEos">
        <div class="asset-balance-btn staked">
          <h5>{{accountStaked}}</h5>
          <p>{{$t('TP.GENERIC.Staked')}}({{tokenUnit}})</p>
        </div>
        <div class="asset-balance-btn rex" @click="goRex">
          <h5>{{rexToken}}</h5>
          <p>REX({{tokenUnit}})</p>
        </div>
      </div>
    </div>

    <div class="asset-main">
      <div class="asset-operation">
        <span class="asset-token-title">{{$t('TP.GENERIC.Token')}}</span>
        <span style="display:flex;align-items:center;">
          <el-input
            class="asset-token-search"
            :placeholder="$t('TP.GENERIC.Search')"
            prefix-icon="el-icon-search"
            v-model="searchToken"
          ></el-input>
          <i class="asset-token-add" @click="addToken"></i>
        </span>
      </div>

      <div class="asset-tokens" :style="{height: !isEos? 'calc(100vh - 357px + 76px)' : 'calc(100vh - 357px)'}">
        <div
          class="asset-token-item"
          v-for="(item, index) in assetTokenList"
          :key="index"
          @click="goTransaction(item)"
        >
          <img class="asset-token-logo" :src="item.icon_url" alt />

          <div class="asset-token-right">
            <div class="asset-token-name">
              <h5>{{item.symbol}}</h5>
            </div>

            <div class="asset-token-balance">
              <h5>{{item.balance}}</h5>
              <p class="ft-14">≈ {{assetTokenInfo.unit}} {{item.asset ? item.asset.toFixed(2) : 0}}</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { getCachedInstance } from "../../../plugins/defaults/eos";
import ElectronHelpers from "../../../util/ElectronHelpers";
import PluginRepository from "../../../plugins/PluginRepository";
// import { getAllTokenList, searchTokenList } from "../../api/Wallet";

export default {
  name: "TokenList",
  components: {},
  data() {
    return {
      searchToken: "",
      searchTokenForm: {
        key: "",
        start: 0,
        count: 1000
      },
      accountStaked: 0,
      rexBalance: 0,
      rexToken: 0
    };
  },

  computed: {
    ...mapGetters([
      "currentAccount",
      "currentBlockChainId",
      "currentWalletId ",
      "assetTokenInfo"
    ]),
    assetTokenList() {
      if (this.assetTokenInfo.tokens) {
        if (this.searchToken) {
          return this.assetTokenInfo.tokens.filter(
            token =>
              token.symbol
                .toLowerCase()
                .indexOf(this.searchToken.toLowerCase()) !== -1
          );
        }
        return this.assetTokenInfo.tokens;
      }
      return [];
    },

    isEos() {
      return this.currentAccount.blockchain() === "eos";
    },

    tokenUnit() {
      const tokenUnit = {
        "4": "EOS",
        "6": "BOS"
      };
      return tokenUnit[this.currentBlockChainId];
    }
  },

  methods: {
    goRex() {
      if (this.currentBlockChainId === 4) {
        ElectronHelpers.openLinkInBrowser(
          "https://eos-rex.gz.bcebos.com/index.html#/"
        );
      }

      if (this.currentBlockChainId === 6) {
        ElectronHelpers.openLinkInBrowser("https://bos-rex.tokenpocket.pro/#/");
      }
    },

    goTransaction(token) {
      this.$store.commit("CURRENT_WALLET_TOKEN_INFO", token);
      this.$emit("token-info", token);
    },

    addToken() {
      this.$emit("shadow-type", "TOKEN_ADD");
    },

    initAccountToken() {
      this.$store.dispatch("INFO_WALLET", this.currentAccount);
      this.getAccountStaked();
    },

    async getAccountStaked() {
      if (this.isEos) {
        const eos = getCachedInstance(this.currentAccount.network());
        eos.getAccount(this.currentAccount.name).then(res => {
          if (res.self_delegated_bandwidth) {
            this.accountStaked =
              parseFloat(res.self_delegated_bandwidth.cpu_weight) +
              parseFloat(res.self_delegated_bandwidth.net_weight);
          }
        });

        await eos
          .getTableRows({
            code: "eosio",
            json: true,
            limit: 1,
            lower_bound: this.currentAccount.name,
            scope: "eosio",
            table: "rexbal",
            table_key: "",
            upper_bound: this.currentAccount.name
          })
          .then(res => {
            if (res.rows.length > 0) {
              this.rexBalance = parseFloat(res.rows[0].rex_balance);
            } else {
              this.rexBalance = 0;
            }
          });

        eos
          .getTableRows({
            code: "eosio",
            json: true,
            limit: 1,
            scope: "eosio",
            table: "rexpool"
          })
          .then(res => {
            if (res.rows.length > 0) {
              const row = res.rows[0];
              const price =
                parseFloat(row.total_lendable) / parseFloat(row.total_rex);
              this.rexToken = (this.rexBalance * price).toFixed(4);
            }
          });
      }
    }
  },
  created() {},

  mounted() {
    this.initAccountToken();
  },

  watch: {
    currentAccount() {
      this.initAccountToken();
    }
  }
};
</script>

<style scoped lang="scss">
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.asset-nav {
  width: 600px;
  margin: 0 auto;
  padding: 15px 0;
  text-align: right;

  img {
    width: 40px;
    height: 40px;
  }

  .refresh {
    // &.rotate {
    // animation: rotation 3s linear infinite;
    // }
  }
}

.asset-arrow {
  display: inline-block;
  width: 7px;
  height: 12px;
  background: url(../../assets/images/myAssets/asset-arrow.png) no-repeat 100% /
    contain;
}

.TokenList {
  background: url(../../assets/images/myAssets/asset-bg.png) no-repeat 100%;
  background-position: top;
  background-size: 100% 300px;
}

.asset-header {
  .asset-balance {
    // padding-top: 73px;
    font-size: 28px;
    font-weight: 500;
    line-height: 40px;
  }

  .asset-balance-text {
    font-size: 18px;
    font-weight: 400;
    line-height: 25px;
  }

  .asset-balance-view {
    display: flex;
    justify-content: center;
    margin-top: 17px;
    .asset-balance-btn {
      display: inline-block;
      width: 200px;
      padding: 10px 0;
      text-align: center;
      border-radius: 26px;
      background: #fff;

      h5,
      p {
        margin: 0;
      }

      h5 {
        font-size: 16px;
        color: #101010;
        line-height: 22px;
      }

      p {
        color: #999;
        font-size: 12px;
      }

      &:last-child {
        margin-left: 30px;
      }
    }
  }
}

.asset-main {
  width: 600px;
  margin: 30px auto 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 40px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #f5f5f5;

  .asset-operation {
    display: flex;
    align-items: center;
    margin: 0 32px;
    padding: 20px 0;
    .asset-token-title {
      font-size: 20px;
      color: #101010;
      font-weight: 500;
      flex: 1;
    }

    /deep/ .asset-token-search input {
      height: 30px;
      line-height: 30px;
      border: 1px solid #eee;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 400;
    }

    /deep/ .el-input__icon {
      line-height: 30px;
    }

    .asset-token-add {
      margin-left: 20px;
      display: inline-block;
      width: 30px;
      height: 30px;
      background: url(../../assets/images/myAssets/asset-add.png) no-repeat 100% /
        contain;
    }
  }

  .asset-tokens {
    height: calc(100vh - 357px);
    overflow-y: auto;
  }

  .asset-token-item {
    margin-left: 32px;
    padding: 20px 32px 20px 0;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }

    .asset-token-logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .asset-token-right {
      display: flex;
      align-items: center;
      flex: 1;
      margin: 0 30px;

      h5,
      p {
        margin: 0;
      }

      h5 {
        font-size: 18px;
        color: #101010;
        font-weight: 500;
        line-height: 25px;
      }

      .asset-token-name,
      .asset-token-balance {
        flex: 1;
      }

      .asset-token-name {
        text-align: left;
      }

      .asset-token-balance {
        text-align: right;
      }
    }
  }
}
</style>
