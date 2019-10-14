<template>
  <div class="Token-QR-Code">
    <div class="qr-code-title">Receive Code</div>

    <div class="qr-code-img">
      <img :src="qrcode" alt class />
    </div>

    <div class="qr-code-text">Your Account:</div>

    <div class="qr-code-account">{{accountNames}}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import QRcode from "qrcode";
export default {
  name: "TokenQRCode",
  props: {
    tokenInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      qrcode: "",
      accountNames: ""
    };
  },
  computed: {
    ...mapGetters(["currentAccount", "currentWalletTokenInfo"])
  },

  mounted() {
    // console.log(this.currentAccount);

    this.accountNames = this.currentAccount.name
      ? this.currentAccount.name
      : this.currentAccount.publicKey;
    const decimal =
      this.currentWalletTokenInfo.decimal > 0
        ? this.currentWalletTokenInfo.decimal
        : this.currentWalletTokenInfo.precision;
    // console.log(this.accountNames);

    // console.log(this.tokenInfo)

    QRcode.toDataURL(
      JSON.stringify({
        amount: 0,
        protocol: "ScanProtocol",
        symbol: this.currentWalletTokenInfo.symbol,
        address: this.currentAccount.publicKey,
        blockchain: "EOS",
        action: "transfer",
        precision: decimal,
        contract: this.currentWalletTokenInfo.address
      })
    ).then(url => {
      this.qrcode = url;
      // console.log(url);
    });
  }
};
</script>

<style scoped lang="scss">
.Token-QR-Code {
  text-align: center;
  margin-top: 50px;
  .qr-code-title {
    font-size: 22px;
    font-weight: 500;
    color: #101010;
  }

  .qr-code-text {
    font-size: 20px;
    font-weight: 400;
    color: #101010;
  }

  .qr-code-account {
    display: inline-block;
    width: 198px;
    font-size: 16px;
    color: #666;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 5px 10px;
    margin-top: 15px;
  }

  .qr-code-img {
    margin: 25px 0 35px;
    img {
      width: 164px;
      height: 164px;
    }
  }
}
</style>