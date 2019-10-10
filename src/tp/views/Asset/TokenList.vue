<template>
  <section class="TokenList">
     <div class="asset-header text-center">
      <div class="asset-balance c-fff">$123,123.00</div>
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
      <div class="asset-operation"></div>

      <div class="asset-tokens">
        <div class="asset-token-item">
          <img class="asset-token-logo" src="../../assets/images/platform/eos.png" alt />

          <div class="asset-token-right">
            <div class="asset-token-name">
              <h5>EOS</h5>
              <p class="ft-12">Liquid</p>
            </div>

            <div class="asset-token-balance">
              <h5>123.1234</h5>
              <p class="ft-14">≈$123.1234</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>

         <div class="asset-token-item">
          <img class="asset-token-logo" src="../../assets/images/platform/eos.png" alt />

          <div class="asset-token-right">
            <div class="asset-token-name">
              <h5>EOS</h5>
              <p class="ft-12">Liquid</p>
            </div>

            <div class="asset-token-balance">
              <h5>123.1234</h5>
              <p class="ft-14">≈$123.1234</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>

         <div class="asset-token-item">
          <img class="asset-token-logo" src="../../assets/images/platform/eos.png" alt />

          <div class="asset-token-right">
            <div class="asset-token-name">
              <h5>EOS</h5>
              <p class="ft-12">Liquid</p>
            </div>

            <div class="asset-token-balance">
              <h5>123.1234</h5>
              <p class="ft-14">≈$123.1234</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>

         <div class="asset-token-item">
          <img class="asset-token-logo" src="../../assets/images/platform/eos.png" alt />

          <div class="asset-token-right">
            <div class="asset-token-name">
              <h5>EOS</h5>
              <p class="ft-12">Liquid</p>
            </div>

            <div class="asset-token-balance">
              <h5>123.1234</h5>
              <p class="ft-14">≈$123.1234</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>

         <div class="asset-token-item">
          <img class="asset-token-logo" src="../../assets/images/platform/eos.png" alt />

          <div class="asset-token-right">
            <div class="asset-token-name">
              <h5>EOS</h5>
              <p class="ft-12">Liquid</p>
            </div>

            <div class="asset-token-balance">
              <h5>123.1234</h5>
              <p class="ft-14">≈$123.1234</p>
            </div>
          </div>

          <i class="asset-arrow"></i>
        </div>
      </div>
    </div>
    <!-- <section class="tokens">
      <section
        class="single-asset"
        :class="{
            'hoverable':hoverable, 
            'active': tokenInfo.uniqueWithChain && tokenInfo.uniqueWithChain() === token.uniqueWithChain(),
            'show': isShow
            }"
        v-for="(token, index) in sortedBalances"
        :key="index"
        @click="selectToken(token)"
      >
        <section class="row">
          <section class="token-symbol">
            <div
              class="symbol"
              :class="[{'iconed':token.symbolClass(), 'small':token && token.symbol.length >= 4, 'unusable':!!token.unusable}, token.symbolClass()]"
            ></div>
            <figure class="title ft-26">{{token.symbol}}</figure>
          </section>
          <section class="token-value" v-if="token.amount">
            <figure class="value c-232538 ft-20">{{formatNumber(token.amount, true)}}</figure>
            <figure
              class="fiat c-232538 ft-14"
              v-if="token.fiatBalance() && parseFloat(token.fiatBalance())"
            >≈ {{fiatSymbol(displayCurrency)}}{{formatNumber(token.fiatBalance(false), true)}}</figure>
          </section>
        </section>

        <section class="row">
          <section class="token-conversion staked" v-if="token.unusable">
            <figure class="locked icon-lock ft-14">{{token.unusable}}</figure>
          </section>
        </section>
      </section>

      <ExchangeToken :token-info="tokenInfo" :is-show="isShow" @showState="getShowState" />
    </section> -->
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import * as Actions from "../../../store/constants";
import Token from "../../../models/Token";
import ExchangeToken from "./ExchangeToken";

export default {
  name: 'TokenList',
  components: {
    ExchangeToken
  },
  props: ["balances", "hoverable", "selected", "noSearch", "terms"],
  data() {
    return {
      tokenInfo: {},
      isShow: false
    };
  },
  computed: {
    ...mapState([]),
    ...mapGetters(["networkTokens", "balanceFilters", "displayCurrency"]),
    sortedBalances() {
      return this.balances
        .filter(token => {
          if (!this.terms.length) return true;
          if (this.terms === "-")
            return (
              this.change(token) &&
              !this.change(token).plus &&
              token.fiatBalance(false)
            );
          if (this.terms === "+")
            return (
              this.change(token) &&
              this.change(token).plus &&
              token.fiatBalance(false)
            );
          if (this.terms.indexOf("::") > -1)
            return (
              `${token.contract.toLowerCase()}::${token.symbol.toLowerCase()}` ===
              this.terms
            );
          if (isNaN(this.terms))
            return (
              token.symbol.toLowerCase().indexOf(this.terms) > -1 ||
              token.contract.toLowerCase().indexOf(this.terms) > -1
            );
          return token.amount >= parseFloat(this.terms);
        })
        .sort((a, b) => {
          if (this.terms === "+" || this.terms === "-")
            return this.change(b, true) - this.change(a, true);
          return Token.sorter(a, b);
        });
    }
  },
  methods: {
    selectToken(token) {
      if (!token.unusable) {
        this.tokenInfo = token;
        this.isShow = true;
      }
    },

    getShowState(state) {
      this.isShow = state;
      this.tokenInfo = {};
    },
    change(token, numOnly = false) {
      const dummy = { plus: false, perc: "0%" };
      if (!this.priceData || !this.priceData.hasOwnProperty("today"))
        return dummy;
      if (token.unusable) return dummy;
      const hour = this.priceData.today.latest;
      const totaled = this.getTokensTotaled();
      const latest = totaled[totaled.length - 1]
        ? totaled[totaled.length - 1].data
        : null;
      const earliest = totaled[0] ? totaled[0].data : null;
      if (
        !latest ||
        !earliest ||
        !latest[token.uniqueWithChain()] ||
        !earliest[token.uniqueWithChain()]
      )
        return "--";
      const diff =
        earliest[token.uniqueWithChain()] - latest[token.uniqueWithChain()];
      const change = (diff / earliest[token.uniqueWithChain()]) * 100;
      if (numOnly) return Math.abs(parseFloat(change).toFixed(2));
      const symbol = change > 0 ? "-" : "+";
      return {
        plus: change <= 0,
        perc: `${symbol}${Math.abs(parseFloat(change).toFixed(2))}%`
      };
    }
  },
  watch: {
    ["terms"]() {
      this.$emit("balances", this.sortedBalances);
    }
  }
};
</script>

<style scoped lang="scss">
.asset-header {
  background: url(../../assets/images/myAssets/asset-bg.png) no-repeat 100% /
    cover;
  height: 300px;

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
  margin: 0 auto;
  background: #fff;
  position: relative;
  top: -60px;
  border-radius: 8px;
  box-shadow: 0px 2px 40px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #f5f5f5;

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

      p {
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



// @import "../../../styles/variables";

// .token-list {
//   height: calc(100vh - 170px - 40px);
//   overflow: auto;
//   width: 100%;
//   flex: 1;

//   .search-and-filter {
//     padding: 0 20px;
//     border-bottom: 0;
//   }

//   .tokens {
//     position: relative;
//     overflow-y: auto;

//     .single-asset {
//       cursor: pointer;
//       //   border-radius: $radius;
//       background: transparent;
//       border-bottom: 1px solid #e8ebf4;
//       display: flex;
//       flex-direction: column;
//       padding: 25px 10px;
//       justify-content: center;
//       transition: all 0.5s ease-in-out;
//       width: 100%;

//       &.show {
//         width: calc(100% - 287px);
//       }

//       .row {
//         display: flex;
//         justify-content: space-between;
//       }

//       .token-symbol {
//         align-self: flex-start;
//         line-height: 34px;
//         font-size: 21px;
//         font-weight: bold;
//         padding-left: 15px;
//         flex: 1;

//         .symbol {
//           float: left;
//           font-size: 34px;
//           margin-left: -8px;
//         }
//       }

//       .icon-lock {
//         float: left;
//         color: #c4c7d2;
//       }

//       .token-value {
//         align-self: center;
//         font-weight: bold;
//         padding-right: 15px;
//         text-align: right;
//         flex: 1;

//         .fiat {
//           color: #c4c7d2;
//           font-weight: normal;
//         }
//       }

//       .token-conversion {
//         align-self: center;
//         font-size: $medium;
//         padding-left: 15px;

//         .stake {
//           color: $red;
//         }
//       }

//       .token-change {
//         align-self: center;
//         padding-right: 15px;
//         text-align: right;
//       }

//       &:hover,
//       &:active,
//       &.active {
//         .token-symbol,
//         .token-value,
//         .token-conversion,
//         .token-change {
//           color: #2980fe;

//           .value {
//             color: #2980fe;
//           }

//           .fiat {
//             color: #2980fe;
//             // color: rgba(255, 255, 255, 0.7);
//           }
//         }

//         .icon-lock {
//           color: #2980fe;
//         }
//       }
//     }
//   }
// }
</style>
