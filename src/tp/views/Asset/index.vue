<template>
  <div class="TP-Assets">
    <TokenList
      v-if="assetType === 'TOKEN_LIST'"
      @token-info="getTokenInfo"
      @shadow-type="type => shadowType = type"
    />

    <TokenTransferHistory
      v-if="assetType === 'TOKEN_TRANSACTION'"
      :token-info="tokenInfo"
      @asset-type="type => assetType = type"
      @shadow-type="type => shadowType = type"
    />

    <TokenShadow
      v-if="shadowType"
      :token-info="tokenInfo"
      :type-info="shadowType"
      @asset-type="type => shadowType = type"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TokenList from "./TokenList";
import TokenTransferHistory from "./TokenTransferHistory";
import TokenShadow from "./TokenShadow";
// import BalanceService from "../../../services/blockchain/BalanceService";

export default {
  name: "TPAssets",
  components: {
    TokenList,
    TokenTransferHistory,
    TokenShadow
  },
  data() {
    return {
      loadingBalances: false,
      searchTerms: "",
      assetInfo: {},
      terms: "",
      tokenInfo: {},
      assetType: "TOKEN_LIST",
      shadowType: null
    };
  },

  computed: {
    ...mapGetters(["tpAccounts", "currentAccount"]),
    tokens() {
      return this.currentAccount.tokens ? this.currentAccount.tokens() : [];
    }
  },

  mounted() {},

  methods: {
    getTokenInfo(token) {
      this.tokenInfo = token;
      this.assetType = "TOKEN_TRANSACTION";
    },

    goTransfer(token) {
      this.$router.push({
        name: this.RouteNames.TRANSFER,
        query: { symbol: token.symbol }
      });
    }
  },

  watch: {
    currentAccount() {
      this.assetType = "TOKEN_LIST";
      this.tokenInfo = {};
      this.shadowType = null;
      this.$store.commit("CURRENT_WALLET_TOKEN_INFO", {});
    }
  }
};
</script>

<style scoped lang="scss">
</style>
