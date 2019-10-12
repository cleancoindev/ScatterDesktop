<template>
  <div class="Token-Shadow">
    <div class="shadow-operations">
      <div class="Token-Header">
        <span>{{title}}</span>
        <i></i>
      </div>

      <TokenQRCode v-if="shadowType === 'QR_CODE'" />
    </div>
  </div>
</template>

<script>
import TokenQRCode from "./TokenQRCode";
export default {
  name: "TokenShadow",
  props: {
    title: {
      type: String
    },
    typeInfo: {
      type: String,
      default: "QR_CODE"
    }
  },
  components: {
    TokenQRCode
  },
  data() {
    return {
      shadowType: "QR_CODE"
    };
  },
  methods: {},

  created() {
    this.shadowType = this.typeInfo;
  }
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
}
</style>