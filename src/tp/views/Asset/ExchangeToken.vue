<template>
  <section class="ExchangeToken" :class="{'show': isShow}">
    <div class="exchange-wrap">
      <h5>{{$t('TP.TRANSFER.ReceiverAccount')}}</h5>
      <input
        type="text"
        class="exchange-to"
        :placeholder="$t('TP.TRANSFER.Receiver')"
        v-model="recipient"
      />

      <h5>{{$t('TP.TRANSFER.Amount')}}</h5>
      <input type="number" :placeholder="$t('TP.TRANSFER.AmountInput')" v-model="amount" />

      <h5>{{$t('TP.TRANSFER.Balance')}}</h5>
      <p>{{tokenInfo.amount}} {{tokenInfo.symbol}}</p>

      <h5>{{$t('TP.TRANSFER.Memo')}}</h5>
      <textarea rows="5" v-model="memo"></textarea>

      <button
        class="tp-button ft-14"
        :class="{'on': canSend}"
        style="padding: 10px 0;"
        @click="send"
      >{{$t('TP.GENERIC.Confirm')}}</button>
    </div>
    <div class="exchange-close" @click="exchangeHidden">
      <span class="TP-Font tp-font-arrow ft-20"></span>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import BalanceService from "../../../services/blockchain/BalanceService";
import TransferService from "../../../services/blockchain/TransferService";
import PasswordService from "../../../services/secure/PasswordService";
import PriceService from "../../../services/apis/PriceService";
export default {
  name: "ExchangeToken",
  props: {
    tokenInfo: {
      type: Object
      //   required: true
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      something: "",
      memo: "",
      recipient: "",
      toSend: {},
      sending: false,
      token: null,
      amount: null
    };
  },

  computed: {
    ...mapGetters(["currentAccount"]),
    canSend() {
      return (
        !this.sending &&
        this.recipient &&
        this.recipient.length &&
        this.toSend.amount > 0
      );
    }
  },

  methods: {
    exchangeHidden() {
      this.toSend = {};
      this.recipient = "";
      this.amount = null;
      this.memo = "";
      this.$emit("showState", false);
    },
    setToken(token) {
      PriceService.setPrices();
      this.token = (() => {
        const t = this.currentAccount
          .tokens()
          .find(x => x.uniqueWithChain() === token.uniqueWithChain());
        if (t) return t.clone();
        const clone = token.clone();
        clone.amount = 0;
        return clone;
      })();
      this.toSend = this.token.clone();
      this.amount = 0;
    },

    async send() {
      const reset = () => (this.sending = false);
      if (!this.canSend) return;
      this.sending = true;
      if (!(await PasswordService.verifyPIN())) return reset();
      // this.setWorkingScreen(true);
      const sent = await TransferService[this.currentAccount.blockchain()]({
        account: this.currentAccount,
        recipient: this.recipient,
        amount: this.toSend.amount,
        memo: this.memo,
        token: this.token,
        promptForSignature: false
      }).catch(err => {
        console.log(err);
        // this.setWorkingScreen(false);
      });
      reset();
      // this.setWorkingScreen(false);
      if (sent)
        setTimeout(() => {
          BalanceService.loadBalancesFor(this.account);
        }, 500);
    }
  },

  created() {},
  watch: {
    tokenInfo() {
      if (this.tokenInfo.uniqueWithChain) this.setToken(this.tokenInfo);
    },

    amount(val1, val2) {
      if (
        parseFloat(this.amount) > 0 &&
        parseFloat(this.amount) > parseFloat(this.tokenInfo.amount)
      ) {
        this.amount = this.tokenInfo.amount;
      }

      this.toSend.amount = this.amount;
    }
  }
};
</script>

<style scoped lang="scss">
.ExchangeToken {
  position: fixed;
  top: 210px;
  right: -287px;
  display: flex;
  height: calc(100% - 210px);
  border-left: 1px solid #e8ebf4;
  transition: all 0.5s ease-in-out;
  opacity: 0;

  &.show {
    right: 0;
    opacity: 1;
  }

  .exchange-wrap {
    width: 267px;
    height: 100%;
    background: #fff;
    padding: 20px 32px 0 32px;

    h5 {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC, sans-serif;
      font-weight: 500;
      color: #333;
      line-height: 22px;
      margin: 10px 0 5px 0;
    }

    p {
      height: 17px;
      font-size: 14px;
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      color: #333;
      line-height: 17px;
      margin: 0 0 15px 0;
    }

    input {
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      height: 36px;
      padding: 0 12px;
      color: #2890fe;
      font-size: 14px;
      &::-webkit-input-placeholder {
        color: #999999;
      }
    }

    .exchange-amount {
      position: relative;
      font-size: 12px;
      font-family: PingFangSC, sans-serif;
      font-weight: 400;
      color: #333;
      line-height: 17px;

      span {
        display: inline-block;
        position: absolute;
        top: 15px;
        left: 12px;
        font-size: 14px;
      }

      input {
        padding-left: 45px;
        &::-webkit-input-placeholder {
          color: #2890fe;
        }
      }
    }

    textarea {
      //   margin-top: 30px;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      width: 100%;
      outline: none;
      padding: 10px;
      font-size: 14px;
      color: #2890fe;
    }

    button {
      margin-top: 30px;
    }
  }

  .exchange-close {
    width: 20px;
    height: 100%;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      color: #2890fe;
    }
  }
}
</style>
    