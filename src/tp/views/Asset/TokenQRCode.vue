<template>
  <div class="Token-QR-Code">
    <div class="qr-code-title">Receive Code</div>

    <div class="qr-code-img">
      <img :src="qrcode" alt class />
    </div>

    <div class="qr-code-text">Receive Code</div>

    <div class="qr-code-account"></div>
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
    ...mapGetters(["currentAccount"])
  },

  mounted() {
    console.log(this.currentAccount);

    this.accountNames = this.currentAccount.name
      ? this.currentAccount.name
      : this.currentAccount.publicKey;

    console.log(this.accountNames);

    QRcode.toDataURL(
      JSON.stringify({
        amount: 0,
        protocol: "ScanProtocol",
        symbol: this.tokenInfo.symbol,
        address: this.currentAccount.publicKey,
        blockchain: "BTC",
        action: "transfer",
        precision: 8,
        contract: "0"
      })
    ).then(url => {
      this.qrcode = url;
      console.log(url);
    });
  }
};
</script>

<style scoped lang="scss">
.Token-QR-Code {
  text-align: center;

  .qr-code-img {
    img {
      width: 164px;
      height: 164px;
    }
  }
}
</style>