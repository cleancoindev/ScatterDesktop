<template>
  <div class="Token-Shadow">
    <div class="shadow-operations">
      <div
        class="shadow-header"
        @click="$emit('asset-type', '')"
        :class="{'border': typeInfo !== 'TOKEN_ADD' }"
      >
        <span>{{shadowTitle}}</span>
        <i></i>
      </div>

      <TokenAdd v-if="typeInfo === 'TOKEN_ADD'" />
      <TokenExchange
        v-show="typeInfo === 'TOKEN_EXCHANGE'"
        :token-info="tokenInfo"
        @transfer-state="$emit('asset-type', '')"
      />
      <TokenQRCode v-if="typeInfo === 'TOKEN_QR_CODE'" />
    </div>
  </div>
</template>

<script>
import TokenAdd from "./TokenADD";
import TokenExchange from "./TokenExchange";
import TokenQRCode from "./TokenQRCode";
export default {
  name: "TokenShadow",
  components: {
    TokenAdd,
    TokenExchange,
    TokenQRCode
  },
  props: {
    tokenInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    typeInfo: {
      type: String
    }
  },
  data() {
    return {
      // shadowType: "TOKEN_ADD"
    };
  },
  computed: {
    shadowTitle() {
      const titleMap = {
        TOKEN_ADD: this.$t("TP.ACCOUNT.ASSET.AddToken"),
        TOKEN_EXCHANGE: this.$t("TP.ACCOUNT.TRANSFER.Send"),
        TOKEN_QR_CODE: this.$t("TP.ACCOUNT.TRANSFER.Receive")
      };
      return titleMap[this.typeInfo];
    }
  },
  methods: {},

  created() {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/consts";
.Token-Shadow {
  position: fixed;
  top: $view-base-top;
  right: 0;
  bottom: 0;
  left: $view-base-left;
  background: rgba(0, 0, 0, 0.5);

  .shadow-operations {
    width: 300px;
    height: 100%;
    background: #fff;
    position: absolute;
    // right: -300px;
    right: 0;
    transition: all 0.5 ease-in-out;
    &.show {
      right: 0;
    }
  }

  .shadow-header {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 500;
    color: #101010;
    padding: 0 25px 0 0;
    margin-left: 25px;
    height: 70px;
    line-height: 70px;

    span {
      flex: 1;
    }
    &.border {
      border-bottom: 1px solid #eee;
    }
    i {
      display: inline-block;
      width: 9px;
      height: 16px;
      background: url(../../assets/images/myAssets/asset-arrow.png) no-repeat
        100% / contain;
    }
  }
}
</style>