<template>
  <div class="TokenTransferHistory">
    <div class="asset-header">
      <div class="asset-back c-fff">Back</div>
    </div>

    <div class="asset-main">
      <div class="transfer-info">
        <img class="transfer-logo" src="../../assets/images/platform/eos.png" alt />

        <div class="transfer-info-right">
          <div class="transfer-text">
            <h5>EOS</h5>
            <p>eosio.token</p>
          </div>

          <div class="transfer-balance">
            <h5>123,123.00</h5>
            <p>≈ $800.12</p>
          </div>
        </div>
      </div>

      <div class="transfer-operation">
        <div class="transfer-status">
          <span class="transfer-status-item">全部</span>
          <span class="transfer-status-item">转入</span>
          <span class="transfer-status-item">转出</span>
        </div>

        <div class="transfer-search">
          <input type="text" class="transfer-search-input" placeholder="搜索" />
        </div>
      </div>

      <div class="transfer-list">
        <div class="transfer-item">
          <img src="../../assets/images/myAssets/asset-out.png" alt class="transfer-item-logo" />

          <div class="transfer-item-right">
            <div class="transfer-item-text">
              <h5>bulls.bg</h5>
              <p>09/17 21.45</p>
            </div>

            <div class="transfer-item-balance out">-123.1234 EOS</div>
          </div>

          <i class="transfer-arrow"></i>
        </div>

         <div class="transfer-item">
          <img src="../../assets/images/myAssets/asset-out.png" alt class="transfer-item-logo" />

          <div class="transfer-item-right">
            <div class="transfer-item-text">
              <h5>bulls.bg</h5>
              <p>09/17 21.45</p>
            </div>

            <div class="transfer-item-balance out">-123.1234 EOS</div>
          </div>

          <i class="transfer-arrow"></i>
        </div>

          <div class="transfer-item">
          <img src="../../assets/images/myAssets/asset-out.png" alt class="transfer-item-logo" />

          <div class="transfer-item-right">
            <div class="transfer-item-text">
              <h5>bulls.bg</h5>
              <p>09/17 21.45</p>
            </div>

            <div class="transfer-item-balance out">-123.1234 EOS</div>
          </div>

          <i class="transfer-arrow"></i>
        </div>

          <div class="transfer-item">
          <img src="../../assets/images/myAssets/asset-out.png" alt class="transfer-item-logo" />

          <div class="transfer-item-right">
            <div class="transfer-item-text">
              <h5>bulls.bg</h5>
              <p>09/17 21.45</p>
            </div>

            <div class="transfer-item-balance in">+23.1234 EOS</div>
          </div>

          <i class="transfer-arrow"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TokenTransferHistory",
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
.TokenTransferHistory {
  position: relative;
}

.asset-header {
  background: url(../../assets/images/myAssets/asset-bg.png) no-repeat 100% /
    cover;
  height: 300px;
}

.asset-main {
  position: relative;
  top: -250px;
  width: 550px;
  margin: 0 auto;
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
    .transfer-status {
      flex: 1;
      display: flex;
    }
  }

  .transfer-list {
    .transfer-item {
      display: flex;
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
}
</style>