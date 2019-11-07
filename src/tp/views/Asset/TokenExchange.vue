<template>
  <div class="TokenExchange">
    <h5>{{$t('TP.ACCOUNT.TRANSFER.ReceiverAccount')}}</h5>
    <input
      type="text"
      class="exchange-to"
      :placeholder="$t('TP.ACCOUNT.TRANSFER.Receiver')"
      v-model="recipient"
    />

    <h5>{{$t('TP.ACCOUNT.TRANSFER.Amount')}}</h5>
    <input
      type="number"
      :placeholder="$t('TP.ACCOUNT.TRANSFER.AmountInput')"
      v-model.number="amount"
    />

    <h5
      style="font-size:12px;color:#2890FE;"
    >{{$t('TP.ACCOUNT.TRANSFER.Balance')}}: {{currentWalletTokenInfo.balance}} {{currentWalletTokenInfo.symbol}}</h5>

    <div v-if="hasMemo">
      <h5>{{$t('TP.GENERIC.Memo')}}</h5>
      <textarea rows="5" v-model="memo"></textarea>
    </div>

    <button
      class="confirm-btn tp-button ft-14"
      :class="{'on': canSend}"
      style="padding: 10px 0;"
      @click="send"
    >{{$t('TP.GENERIC.Confirm')}}</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Token from "../../../models/Token";
import TransferService from "../../../services/blockchain/TransferService";

export default {
  name: "ExchangeToken",
  props: {
    tokenInfo: {
      type: Object
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
      sending: false,
      amount: null,
      token: {
        amount: null
      }
    };
  },

  computed: {
    ...mapGetters(["currentAccount", "currentWalletTokenInfo"]),

    canSend() {
      return this.recipient && parseFloat(this.amount) > 0;
    },

    hasMemo() {
      const blacklist = [1, 10];
      return !blacklist.includes(this.currentWalletTokenInfo.blockchain_id);
    }

    // totalBalance() {
    //   if (!isNaN(this.token.amount)) {
    //     return this.currentWalletTokenInfo.balance - this.token.amount;
    //   }
    //   return this.currentWalletTokenInfo.balance;
    // }
  },

  methods: {
    exchangeHidden() {
      this.recipient = "";
      this.amount = null;
      this.memo = "";
      this.$emit("showState", false);
    },

    async send() {
      if (!this.canSend) return false;

      const tokenInfo = this.currentWalletTokenInfo;

      const decimal =
        tokenInfo.decimal > 0 ? tokenInfo.decimal : tokenInfo.precision;
      const chainId = this.currentAccount.network().chainId;

      const token = new Token(
        this.currentAccount.blockchain(),
        tokenInfo.address,
        tokenInfo.symbol,
        tokenInfo.symbol,
        decimal,
        chainId
      );

      token.amount = this.amount;

      const sent = await TransferService[this.currentAccount.blockchain()]({
        account: this.currentAccount,
        recipient: this.recipient,
        amount: parseFloat(token.amount),
        memo: this.memo,
        token: token,
        promptForSignature: false,
        type: this.currentWalletTokenInfo.token_type
      }).catch(err => {
        // console.log(err);
        this.$emit("transfer-state");
      });

      if (sent) {
        this.exchangeHidden();
        this.$emit("transfer-state");
      }
    }
  },

  created() {
    // console.log(this.currentWalletTokenInfo);

    // const tokenInfo = this.currentWalletTokenInfo;

    // const decimal =
    //   tokenInfo.decimal > 0 ? tokenInfo.decimal : tokenInfo.precision;
    // const chainId = this.currentAccount.network().chainId;

    // const token = new Token(
    //   this.currentAccount.blockchain(),
    //   tokenInfo.address,
    //   tokenInfo.symbol,
    //   tokenInfo.symbol,
    //   decimal,
    //   chainId
    // );

    // console.log(token);

    // this.token = { ...this.token, ...token, amount: null };
  },
  watch: {
    currentWalletTokenInfo() {
      // console.log(this.currentWalletTokenInfo, "currentWalletTokenInfo");
      //   if (this.tokenInfo.uniqueWithChain) this.setToken(this.tokenInfo);
    }
  }
};
</script>

<style scoped lang="scss">
.TokenExchange {
  padding: 25px;

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
    