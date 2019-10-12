<template>
  <div class="Token-Add"></div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAllTokenList } from "../../api/Wallet";
export default {
  name: "TokenAdd",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(["currentAccount"])
  },
  data() {
    return {
      allTokenList: [],
      allTokenForm: {
        start: 0,
        count: 100
      }
    };
  },
  methods: {
    getAllTokenList() {
      getAllTokenList(this.allTokenForm).then(res => {
        if (res.result === 0) {
          console.log(res.data);
        }
      });
    }
  },
  created() {}
};
</script>

<style scoped lang="scss">
.Token-Add {
  // margin-left: 25px;
  // padding: 20px 25px 20px 0;
  // display: flex;
  // align-items: center;
  // border-bottom: 1px solid #eee;
  // span {
  //   flex: 1;
  //   font-size: 20px;
  //   font-weight: 500;
  // }

  // i {
  //   display: inline-block;
  //   width: 9px;
  //   height: 16px;
  //   background: url(../../assets/images/myAssets/asset-arrow.png) no-repeat 100% /
  //     contain;
  // }
}
</style>