<template>
  <div class="Token-Add">
    <div class="token-search">
      <el-input
        class="asset-token-search"
        :placeholder="$t('TP.GENERIC.Search')"
        prefix-icon="el-icon-search"
        v-model="allTokenForm.key"
      ></el-input>
    </div>

    <div class="token-list">
      <div class="token-list-item" v-for="(item, index) in allTokenList" :key="index">
        <img :src="item.icon_url" alt class="token-logo" @error="getImgError" />
        <span class="token-symbol">{{item.symbol}}</span>
        <i
          class="token-status"
          :class="{'on': item.added === 1, 'off': item.added === 0}"
          @click="changeAdded(item)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getAllTokenList,
  searchTokenList,
  addWalletToken,
  delWalletToken
} from "../../api/Wallet";
export default {
  name: "TokenAdd",
  props: {},
  computed: {
    ...mapGetters(["currentAccount", "currentWalletId", "currentBlockChainId"])
  },
  data() {
    return {
      allTokenList: [],
      allTokenForm: {
        start: 0,
        count: 200,
        key: ""
      },
      searchToken: ""
    };
  },
  methods: {
    changeAdded(item) {
      if (item.added === 0) this.addWalletToken(item);
      if (item.added === 1) this.delWalletToken(item);
    },

    addWalletToken(item) {
      addWalletToken({
        wallet_id: this.currentWalletId,
        token_id: item.hid
      }).then(res => {
        if (res.result === 0) {
          this.getAllTokenList();
          this.$store.dispatch("INFO_WALLET", this.currentAccount);
        }
      });
    },

    delWalletToken(item) {
      delWalletToken({
        token_id: item.hid,
        wallet_id: this.currentWalletId
      }).then(res => {
        if (res.result === 0) {
          this.getAllTokenList();
          this.$store.dispatch("INFO_WALLET", this.currentAccount);
        }
      });
    },

    getAllTokenList(hasNext = false) {
      getAllTokenList({
        ...this.allTokenForm,
        wallet_id: this.currentWalletId,
        blockchain_id: this.currentBlockChainId
      }).then(res => {
        if (res.result === 0) {
          this.allTokenList = res.data;
        }
      });
    },

    getSearchToken() {
      searchTokenList({
        ...this.allTokenForm,
        blockchain_id: this.currentBlockChainId,
        wallet_id: this.currentWalletId
      }).then(res => {
        if (res.result === 0) {
          this.allTokenList = res.data;
        }
      });
    },

    getImgError(el) {
      let imgStyle = el.target.style;

      switch (parseInt(this.currentBlockChainId)) {
        case 4:
          imgStyle.src = require("../../assets/images/platform/eos.png");
          break;
        case 10:
          imgStyle.src = require("../../assets/images/platform/trx.png");
          break;
        case 1:
          imgStyle.src = require("../../assets/images/platform/eth.png");
          break;
        default:
          imgStyle.backgroundColor = "#ccc";
      }
    }
  },
  created() {
    this.getAllTokenList();
  },
  watch: {
    "allTokenForm.key"() {
      this.allTokenForm.key ? this.getSearchToken() : this.getAllTokenList();
    }
  }
};
</script>

<style scoped lang="scss">
.token-search {
  margin: 15px 25px;
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
}

.Token-Add {
  height: calc(100vh - 40px - 70px);
  overflow-y: auto;
  .token-list-item {
    display: flex;
    align-items: center;
    margin-left: 25px;
    padding: 20px 25px 20px 0;
    border-bottom: 1px solid #eee;
    .token-logo {
      width: 40px;
      height: 40px;
      // background: #ccc;
      border-radius: 50%;
    }

    .token-symbol {
      font-size: 18px;
      font-weight: 500;
      color: #101010;
      flex: 1;
      margin-left: 20px;
    }

    .token-status {
      display: inline-block;
      width: 24px;
      height: 24px;
      &.on {
        background: url(../../assets/images/myAssets/asset-check-on.png)
          no-repeat 100% / contain;
      }

      &.off {
        background: url(../../assets/images/myAssets/asset-check-off.png)
          no-repeat 100% / contain;
      }
    }
  }
}
</style>