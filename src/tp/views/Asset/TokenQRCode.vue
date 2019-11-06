<template>
  <div class="Token-QR-Code">
    <div class="qr-code-title">{{$t('TP.ACCOUNT.TRANSFER.ReceiveCode')}}</div>

    <div class="qr-code-img">
      <img :src="qrcode" />
    </div>

    <div class="qr-code-text">{{$t('TP.ACCOUNT.TRANSFER.YourAccount')}}:</div>

    <div class="qr-code-account">{{accountNames}}</div>

    <div class="qr-code-copy" @click="copyAccount">
      <i></i>
      {{$t('TP.GENERIC.Copy')}}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import QRcode from "qrcode";
import ElectronHelpers from "../../../util/ElectronHelpers";
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
    ...mapGetters([
      "currentAccount",
      "currentWalletTokenInfo",
      "currentWalletName"
    ])
  },

  methods: {
    copyAccount() {
      ElectronHelpers.copy(this.accountNames);
    }
  },

  mounted() {
    this.accountNames = this.currentAccount.name
      ? this.currentAccount.name
      : this.currentAccount.publicKey;

    const { decimal, precision } = this.currentWalletTokenInfo;
    // this.currentWalletTokenInfo.decimal > 0
    //   ? this.currentWalletTokenInfo.decimal
    //   : this.currentWalletTokenInfo.precision;

    const platform = blockchainId => {
      switch (blockchainId) {
        case 1:
          return "ETH";
        case 4:
          return "EOS";
        case 6:
          return "BOS";
        case 10:
          return "TRON";
      }
    };

    const isPrecision = ["EOS", "BOS"].includes(
      platform(this.currentWalletTokenInfo.blockchain_id)
    );

    const isDecimal = ["ETH", "TRON"].includes(
      platform(this.currentWalletTokenInfo.blockchain_id)
    );

    const form = {
      amount: 0,
      protocol: "ScanProtocol",
      symbol: this.currentWalletTokenInfo.symbol,
      address: this.currentWalletName,
      blockchain: platform(this.currentWalletTokenInfo.blockchain_id),
      action: "transfer",
      precision,
      decimal,
      contract: this.currentWalletTokenInfo.address
    };

    if (isPrecision) {
      delete form.decimal;
    }

    if (isDecimal) {
      delete form.precision;
    }

    QRcode.toDataURL(JSON.stringify(form)).then(url => {
      this.qrcode = url;
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

  .qr-code-copy {
    display: inline-block;
    width: 198px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-top: 15px;
    border-radius: 8px;
    color: #fff;
    background: #2890fe;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    i {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url(../../assets/images/myAssets/asset-copy.png) no-repeat
        100% / contain;
      vertical-align: middle;
    }
  }
}
</style>