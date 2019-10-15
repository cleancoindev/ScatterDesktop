<template>
  <section class="TokenList">
    <div class="asset-header text-center">
      <div class="asset-balance c-fff">${{assetTokenInfo.total_asset}}</div>
      <div class="asset-balance-text c-fff">Total Balance</div>
      <div class="asset-balance-view">
        <div class="asset-balance-btn staked">
          <h5>20459.9724</h5>
          <p>Staked (EOS)</p>
        </div>
        <div class="asset-balance-btn rex">
          <h5>0.0000</h5>
          <p>REX (EOS)</p>
        </div>
      </div>
    </div>

    <div class="asset-main">
      <div class="asset-operation">
        <span class="asset-token-title">Token</span>
        <span style="display:flex;align-items:center;">
          <el-input
            class="asset-token-search"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="searchToken"
          ></el-input>
          <i class="asset-token-add" @click="addToken"></i>
        </span>
      </div>

      <div class="asset-tokens">
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
              <!-- <p class="ft-12">Liquid</p> -->
            </div>

            <div class="asset-token-balance">
              <h5>{{item.balance}}</h5>
              <p class="ft-14">≈ {{item.price_usd ? item.price_usd.toFixed(item.precision) : 0}}</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import * as Actions from "../../../store/constants";
import Token from "../../../models/Token";

export default {
  name: "TokenList",
  components: {},
  data() {
    return {
      searchToken: ""
    };
  },
  computed: {
    ...mapGetters(["currentAccount", "assetTokenInfo"]),
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
    }
  },
  methods: {
    goTransaction(token) {
      this.$store.commit("CURRENT_WALLET_TOKEN_INFO", token);
      this.$emit("token-info", token);
    },

    addToken() {
      this.$emit("shadow-type", "TOKEN_ADD");
    }
  },
  created() {},

  mounted() {
    this.$store.dispatch("INFO_WALLET", this.currentAccount);
  },

  watch: {
    currentAccount() {
      this.$store.dispatch("INFO_WALLET", this.currentAccount);
    }
  }
};
</script>

<style scoped lang="scss">
.asset-arrow {
  display: inline-block;
  width: 7px;
  height: 12px;
  background: url(../../assets/images/myAssets/asset-arrow.png) no-repeat 100% /
    contain;
}

.TokenList {
  background: url(../../assets/images/myAssets/asset-bg.png) no-repeat 100% /
    contain;
  background-position: top;
}

.asset-header {
  .asset-balance {
    padding-top: 73px;
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

  .asset-token-item {
    margin-left: 32px;
    padding: 20px 32px 20px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;

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
