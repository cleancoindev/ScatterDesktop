<template>
  <div class="TokenTransferHistory">
    <div class="asset-back c-fff" @click="backTokenList">
      <i class="asset-back-arrow"></i>
      {{$t('TP.GENERIC.Back')}}
    </div>

    <div class="asset-main">
      <div class="transfer-info">
        <img class="transfer-logo" :src="tokenInfo.icon_url" alt />

        <div class="transfer-info-right">
          <div class="transfer-text">
            <h5>{{tokenInfo.symbol}}</h5>
            <p>{{tokenInfo.account}}</p>
          </div>

          <div class="transfer-balance">
            <h5>{{tokenInfo.balance}}</h5>
            <p>≈ $ {{tokenAsset}}</p>
          </div>
        </div>
      </div>

      <div class="transfer-operation">
        <div class="transfer-status">
          <span
            class="transfer-status-item"
            :class="{'active': transactionTabStatus === 0}"
            @click="changeTabStatus(0)"
          >{{$t('TP.GENERIC.All')}}</span>
          <span
            class="transfer-status-item"
            :class="{'active': transactionTabStatus === 1}"
            @click="changeTabStatus(1)"
          >{{$t('TP.ACCOUNT.TRANSFER.In')}}</span>
          <span
            class="transfer-status-item"
            :class="{'active': transactionTabStatus === 2}"
            @click="changeTabStatus(2)"
          >{{$t('TP.ACCOUNT.TRANSFER.Out')}}</span>
        </div>

        <div class="transfer-search">
          <el-input
            class="asset-token-search"
            :placeholder="$t('TP.GENERIC.Search')"
            prefix-icon="el-icon-search"
            v-model="searchAccountActions"
          ></el-input>
        </div>
      </div>

      <div class="transfer-list" v-infinite-scroll="loadBottom">
        <div class v-if="hasTransactions">
          <div
            class="transfer-item"
            v-for="(item, index) in transactionActionList"
            :key="index"
            @click="goTransferDetail(item)"
          >
            <img :src="transactionImg(item)" alt class="transfer-item-logo" />

            <div class="transfer-item-right">
              <div class="transfer-item-text">
                <h5 v-if="item.to === currentName">{{spliceAccount(item.from)}}</h5>
                <h5 v-if="item.from === currentName">{{spliceAccount(item.to)}}</h5>
                <p>{{item.time}}</p>
              </div>

              <div
                class="transfer-item-balance"
                :class="{'in': item.to === currentName, 'out': item.from === currentName}"
              >
                <span v-if="item.to === currentName">+</span>
                <span v-if="item.from === currentName">-</span>
                <span>{{item.quantity}}</span>
                <span>{{item.symbol}}</span>
              </div>
            </div>

            <i class="transfer-arrow"></i>
          </div>
        </div>

        <div class="transfer-placeholder" v-if="!hasTransactions">
          <img src="../../assets/images/myAssets/asset-empty.png" alt class />
        </div>
      </div>

      <div class="transfer-in-out">
        <div class="transfer-out" @click="changeShadow('TOKEN_EXCHANGE')">
          <i></i>
          {{$t('TP.ACCOUNT.TRANSFER.Send')}}
        </div>

        <div class="transfer-in" @click="changeShadow('TOKEN_QR_CODE')">
          <i></i>
          {{$t('TP.ACCOUNT.TRANSFER.Receive')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ElectronHelpers from "../../../util/ElectronHelpers";
import { getTransactionAction } from "../../api/Wallet";

const toNonExponential = num => {
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
};

export default {
  name: "TokenTransferHistory",
  props: {
    tokenInfo: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      transactionTabStatus: 0,
      searchAccountActions: "",
      actionPage: 0,
      transactionActionList: [],
      tokenInformation: {
        account: "",
        balance: "",
        symbol: "",
        icon_url: ""
      }
    };
  },

  computed: {
    ...mapGetters([
      "currentAccount",
      "currentBlockChainId",
      "currentWalletName"
    ]),
    currentName() {
      return this.currentAccount.name
        ? this.currentAccount.name
        : this.currentAccount.publicKey;
    },
    hasTransactions() {
      const list = this.transactionActionList;
      return Array.isArray(list) ? list.length > 0 : false;
    },
    actionForm() {
      const isTrx =
        this.tokenInfo.blockchain_id === 10 && this.tokenInfo.token_type === 0;
      const form = {
        page: this.actionPage,
        count: 20,
        symbol: this.tokenInfo.symbol,
        search: this.searchAccountActions,
        code: isTrx ? "trx" : this.tokenInfo.address,
        account: this.currentWalletName,
        address: this.currentWalletName,
        // 记录类型：0--全部， 1--转入， 2--转出
        type: this.transactionTabStatus,
        blockchain_id: this.currentBlockChainId,
        contract_address:
          this.tokenInfo.token_type === 1 ? this.tokenInfo.address : "",
        // code: this.tokenInfo.address,
        new_way: "new",
        sort: "desc"
      };

      if (this.currentBlockChainId === 1) {
        delete form.account;
        delete form.code;
      } else {
        delete form.new_way;
      }

      if (this.currentBlockChainId === 10) {
        delete form.address;
        delete form.contract_address;
      }

      return form;
    },

    tokenAsset() {
      return this.tokenInfo.asset ? this.tokenInfo.asset.toFixed(2) : 0;
    }
  },
  methods: {
    loadBottom() {
      this.actionPage += 20;
      this.getTransactionAction(this.transactionTabStatus);
    },

    transactionImg(item) {
      if (item.to === this.currentName)
        return require("../../assets/images/myAssets/asset-in.png");
      if (item.from === this.currentName)
        return require("../../assets/images/myAssets/asset-out.png");
    },

    spliceAccount(account) {
      if (account.length > 32) {
        return account.replace(account.substring(8, 32), "******");
      }
      return account;
    },

    changeTabStatus(status) {
      this.actionPage = 0;
      this.transactionTabStatus = status;
      this.transactionActionList = [];
      this.getTransactionAction(status);
      // this.$store.dispatch("GET_TRANSACTION_ACTION", {
      //   type: status,
      //   search: this.searchAccountActions,
      //   ...this.tokenInfo,
      //   ...this.currentAccount
      // });
    },

    goTransferDetail(item) {
      const blockchainId = this.currentBlockChainId;

      switch (blockchainId) {
        case 1:
          ElectronHelpers.openLinkInBrowser(
            `https://cn.etherscan.com/tx/${item.hash}`
          );
          break;
        case 4:
          ElectronHelpers.openLinkInBrowser(
            `https://www.eosx.io/tx/${item.hid}`
          );
          break;
        case 6:
          ElectronHelpers.openLinkInBrowser(
            `https://bos.eosx.io/tx/${item.hid}`
          );
          break;
        case 10:
          ElectronHelpers.openLinkInBrowser(
            `https://tronscan.org/#/transaction/${item.trx_id}`
          );
          break;
      }
    },

    changeShadow(type) {
      this.$emit("shadow-type", type);
    },

    backTokenList() {
      this.$emit("asset-type", "TOKEN_LIST");
    },

    getTransactionAction(status = 0) {
      this.transactionTabStatus = status;
      getTransactionAction(this.actionForm).then(res => {
        if (res.result === 0 && res.data) {
          const filterAction = action => {
            if (this.currentBlockChainId === 10) {
              action.time = this.$moment(action.timestamp).format(
                "MM/DD HH:mm"
              );
            } else {
              action.time = this.$moment(action.timestamp * 1000).format(
                "MM/DD HH:mm"
              );
            }

            switch (this.currentBlockChainId) {
              case 1:
                if (this.tokenInfo.token_type === 0) {
                  action.quantity = toNonExponential(
                    parseFloat(action.value / `1e${action.decimal}`)
                  );
                }

                if (this.tokenInfo.token_type === 1) {
                  action.quantity = toNonExponential(
                    parseFloat(action.token_value / `1e${action.decimal}`)
                  );
                }

                action.browser_url = `https://cn.etherscan.com/tx/${action.hash}`;
                break;
              case 4:
                action.quantity = action.count;
                action.browser_url = `https://www.eosx.io/tx/${action.hid}`;
                break;
              case 6:
                action.quantity = action.count;
                action.browser_url = `https://bos.eosx.io/tx/${action.hid}`;
                break;
              case 10:
                action.quantity = action.asset_nmount / `1e${action.decimal}`;
                action.browser_url = `https://tronscan.org/#/transaction/${action.trx_id}`;
                break;
            }
            return action;
          };

          const actionList = res.data.map(action => filterAction(action));

          if (this.actionPage > 0) {
            this.transactionActionList = [
              ...this.transactionActionList,
              ...actionList
            ];
          } else {
            this.transactionActionList = actionList;
          }
        }
      });
    }
  },

  created() {
    this.getTransactionAction();
    Object.keys(this.tokenInfo).forEach(info => {
      // console.log(info);
      if (this.tokenInformation[info] != undefined) {
        this.tokenInformation[info] = this.tokenInfo[info];
      }
    });

    // this.tokenInformation.assets =

    // for (const key of this.tokenInfo) {
    //   console.log(key)
    // }
  },

  watch: {
    searchAccountActions() {
      // this.actionPage = 1;
      this.changeTabStatus(this.transactionTabStatus);
      // this.getTransactionAction(this.transactionTabStatus);
      // this.$store.dispatch("GET_TRANSACTION_ACTION", {
      //   type: this.transactionTabStatus,
      //   search: this.searchAccountActions,
      //   ...this.tokenInfo,
      //   ...this.currentAccount
      // });
    }
    // tokenInfo() {
    // if (this.tokenInfo.asset) this.
    // }
  }
};
</script>

<style lang="scss" scoped>
.TokenTransferHistory {
  position: relative;
  background: url(../../assets/images/myAssets/asset-bg.png) no-repeat 100% /
    contain;
  background-position: top;
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

.asset-back {
  font-size: 28px;
  font-weight: 400;
  // line-height: 40px;
  position: relative;
  width: 550px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-top: 20px;
  .asset-back-arrow {
    display: inline-block;
    width: 11px;
    height: 20px;
    background: url(../../assets/images/myAssets/asset-back.png) no-repeat 100% /
      cover;
    position: absolute;
    left: -25px;
  }
}

.transfer-arrow {
  display: inline-block;
  width: 7px;
  height: 12px;
  background: url(../../assets/images/myAssets/asset-arrow.png) no-repeat 100% /
    cover;
}

.asset-main {
  width: 550px;
  margin: 25px auto 0 auto;
  border-radius: 8px;
  box-shadow: 0px 2px 40px 0px rgba(0, 0, 0, 0.03);
  border: 1px solid #f5f5f5;
  background: #fff;

  .transfer-info {
    display: flex;
    margin: 30px;
    align-items: center;
    .transfer-logo {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    .transfer-info-right {
      flex: 1;
      display: flex;
      align-items: center;
      margin-left: 20px;

      h5,
      p {
        margin: 0;
      }

      h5 {
        font-size: 20px;
        font-weight: 500;
        color: #101010;
        line-height: 28px;
      }

      p {
        font-size: 16px;
        font-weight: 400;
        color: #666;
        line-height: 22px;
      }

      .transfer-item-text {
        flex: 1;
        text-align: left;
      }

      .transfer-balance {
        flex: 1;
        text-align: right;
      }
    }
  }

  .transfer-operation {
    display: flex;
    margin: 0 30px;
    .transfer-status {
      flex: 1;
      display: flex;

      .transfer-status-item {
        display: inline-block;
        padding: 5px 0;
        margin: 0 10px;
        color: #101010;
        font-size: 16px;
        font-weight: 400;
        border-bottom: 2px solid transparent;
        &.active {
          color: #2890fe;
          border-bottom: 2px solid #2890fe;
        }
      }
    }

    .transfer-search {
      .transfer-search-input {
        display: inline-block;
        width: 166px;
        height: 30px;
        outline: none;
        color: #101010;
        border: 1px solid #eee;
        border-radius: 20px;
        &::--webkit-input-placeholder {
          color: #c1c1c1;
        }
      }
    }
  }

  .transfer-list {
    margin-top: 20px;
    height: calc(100vh - 371px);
    overflow-y: auto;

    .transfer-placeholder {
      text-align: center;
      margin-top: 50px;
      img {
        width: 200px;
      }
    }

    .transfer-item {
      display: flex;
      align-items: center;
      margin-left: 30px;
      padding: 15px 30px 15px 0;
      border-bottom: 1px solid #eee;

      .transfer-item-logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .transfer-item-right {
        margin: 0 20px 0 30px;
        flex: 1;
        display: flex;
        align-items: center;
        .transfer-item-text {
          text-align: left;
          h5,
          p {
            margin: 0;
          }

          h5 {
            font-size: 16px;
            font-weight: 400;
            color: #101010;
            line-height: 22px;
          }

          p {
            font-size: 12px;
            font-weight: 400;
            color: #999;
            line-height: 17px;
          }
        }

        .transfer-item-balance {
          text-align: right;
          font-size: 16px;
          font-weight: 400;
          flex: 1;
          &.in {
            color: #3590fe;
          }

          &.out {
            color: #57d4aa;
          }
        }
      }
    }
  }

  .transfer-in-out {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    border-top: 1px solid #f5f5f5;
    .transfer-in,
    .transfer-out {
      width: 230px;
      height: 42px;
      line-height: 42px;
      border-radius: 8px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
      i {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }
    }

    .transfer-out {
      background: #57d4aa;
      i {
        background: url(../../assets/images/myAssets/asset-exchange.png)
          no-repeat 100% / contain;
      }
    }

    .transfer-in {
      background: #3590fe;
      i {
        background: url(../../assets/images/myAssets/asset-collection.png)
          no-repeat 100% / contain;
      }
    }
  }
}
</style>