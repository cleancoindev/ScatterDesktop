<template>
  <section class="token-list" :style="{overflow: isShow ? 'hidden' : 'auto'}">
    <section class="tokens">
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
    </section>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import * as Actions from "../../../store/constants";
import Token from "../../../models/Token";
import ExchangeToken from "./ExchangeToken";

export default {
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
@import "../../../styles/variables";

.token-list {
  height: calc(100vh - 170px - 40px);
  overflow: auto;
  width: 100%;
  flex: 1;

  .search-and-filter {
    padding: 0 20px;
    border-bottom: 0;
  }

  .tokens {
    position: relative;
    overflow-y: auto;

    .single-asset {
      cursor: pointer;
      //   border-radius: $radius;
      background: transparent;
      border-bottom: 1px solid #e8ebf4;
      display: flex;
      flex-direction: column;
      padding: 25px 10px;
      justify-content: center;
      transition: all 0.5s ease-in-out;
      width: 100%;

      &.show {
        width: calc(100% - 287px);
      }

      .row {
        display: flex;
        justify-content: space-between;
      }

      .token-symbol {
        align-self: flex-start;
        line-height: 34px;
        font-size: 21px;
        font-weight: bold;
        padding-left: 15px;
        flex: 1;

        .symbol {
          float: left;
          font-size: 34px;
          margin-left: -8px;
        }
      }

      .icon-lock {
        float: left;
        color: #c4c7d2;
      }

      .token-value {
        align-self: center;
        font-weight: bold;
        padding-right: 15px;
        text-align: right;
        flex: 1;

        .fiat {
          color: #c4c7d2;
          font-weight: normal;
        }
      }

      .token-conversion {
        align-self: center;
        font-size: $medium;
        padding-left: 15px;

        .stake {
          color: $red;
        }
      }

      .token-change {
        align-self: center;
        padding-right: 15px;
        text-align: right;
      }

      &:hover,
      &:active,
      &.active {
        .token-symbol,
        .token-value,
        .token-conversion,
        .token-change {
          color: #2980fe;

          .value {
            color: #2980fe;
          }

          .fiat {
            color: #2980fe;
            // color: rgba(255, 255, 255, 0.7);
          }
        }

        .icon-lock {
          color: #2980fe;
        }
      }
    }
  }
}
</style>
