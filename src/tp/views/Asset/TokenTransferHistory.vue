<template>
  <div class="TokenTransferHistory">
    <div class="asset-back c-fff" @click="backTokenList">
      <i class="asset-back-arrow"></i>
      Back
    </div>

    <div class="asset-main">
      <div class="transfer-info">
        <img class="transfer-logo" src="../../assets/images/platform/eos.png" alt />

        <div class="transfer-info-right">
          <div class="transfer-text">
            <h5>{{tokenInfo.symbol}}</h5>
            <p>{{tokenInfo.account}}</p>
          </div>

          <div class="transfer-balance">
            <h5>{{tokenInfo.balance}}</h5>
            <p>≈ {{tokenInfo.price_usd ? tokenInfo.price_usd.toFixed(tokenInfo.precision) : 0}}</p>
          </div>
        </div>
      </div>

      <div class="transfer-operation">
        <div class="transfer-status">
          <span
            class="transfer-status-item"
            :class="{'active': transactionTabStatus === 0}"
            @click="changeTabStatus(0)"
          >全部</span>
          <span
            class="transfer-status-item"
            :class="{'active': transactionTabStatus === 1}"
            @click="changeTabStatus(1)"
          >转入</span>
          <span
            class="transfer-status-item"
            :class="{'active': transactionTabStatus === 2}"
            @click="changeTabStatus(2)"
          >转出</span>
        </div>

        <div class="transfer-search">
          <input type="text" class="transfer-search-input" placeholder="搜索" />
        </div>
      </div>

      <div class="transfer-list">
        <div class="transfer-item" v-for="(item, index) in transactionActionList" :key="index">
          <img :src="transactionImg(item.status)" alt class="transfer-item-logo" />

          <div class="transfer-item-right">
            <div class="transfer-item-text">
              <h5>{{item.from}}</h5>
              <p>{{$moment(item.timestamp * 1000).format('MM/DD HH:mm')}}</p>
            </div>

            <div
              class="transfer-item-balance"
              :class="{'in': item.status === 1, 'out': item.status === 2}"
            >
              <span v-if="item.status === 1">+</span>
              <span v-if="item.status === 2">-</span>
              <span>{{item.count}}</span>
              <span>{{item.symbol}}</span>
            </div>
          </div>

          <i class="transfer-arrow"></i>
        </div>
      </div>

      <div class="transfer-in-out">
        <div class="transfer-out">
          <i></i>
          转账
        </div>

        <div class="transfer-in">
          <i></i>
          收款
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TokenTransferHistory",
  props: {
    tokenInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      transactionTabStatus: 0
    };
  },

  computed: {
    ...mapGetters(["currentAccount", "transactionActionList"])
  },
  methods: {
    
    transactionImg(type) {
      switch (type) {
        case 1:
          return require("../../assets/images/myAssets/asset-in.png");
        case 2:
          return require("../../assets/images/myAssets/asset-out.png");
      }
    },

    changeTabStatus(status) {
      this.transactionTabStatus = status;
    },

    backTokenList() {
      this.$emit('asset-type', 'TOKEN_LIST');
    }
  },

  created() {
    this.$store.dispatch("GET_TRANSACTION_ACTION", {
      ...this.tokenInfo,
      ...this.currentAccount
    });
  }
};
</script>

<style lang="scss" scoped>
.TokenTransferHistory {
  position: relative;
  background: url(../../assets/images/myAssets/asset-bg.png) no-repeat 100% /
    contain;
  background-position: top;
  // padding-top: 75px;
}

.asset-back {
  font-size: 28px;
  font-weight: 400;
  // line-height: 40px;
  position: relative;
  width: 550px;
  margin: 0 auto;
  display:flex;
  align-items: center;
  padding-top: 20px;
  .asset-back-arrow {
    display: inline-block;
    width: 11px;
    height: 20px;
    background: url(../../assets/images/myAssets/asset-back.png) no-repeat 100% / cover;
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
    height: calc(100vh - 363px);
    overflow-y: auto;
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
      i {
        display:inline-block;
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }
    }

    .transfer-out {
      background: #57d4aa;
      i {
        background: url(../../assets/images/myAssets/asset-exchange.png) no-repeat 100% / contain;
      }
    }

    .transfer-in {
      background: #3590fe;
      i {
        background: url(../../assets/images/myAssets/asset-collection.png) no-repeat 100% / contain;
      }
    }
  }
}
</style>