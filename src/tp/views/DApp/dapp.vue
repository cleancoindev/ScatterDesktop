<template>
  <div class="dapp-main-wrap">
    <main class="wrap container-layout">
      <el-row class="m-bottom-15">
        <el-input v-model="dappKey" @keyup.enter.native="searchDapp" clearable>
          <el-button slot="append" icon="el-icon-search" @click="searchDapp"></el-button>
        </el-input>
      </el-row>

      <el-row class="dapp-category">
        <span
          class="category-title c-999 ft-16 pointer"
          v-for="(item, index) in category"
          :key="index"
          :class="{'c-115CE8': categoryIndex === index}"
          @click="categoryChange(item, index)"
        >{{item.title}}</span>
      </el-row>

      <el-row :gutter="20" class="category-list">
        <el-col class="dapp-list" v-for="(item, index) in dappList" :key="index">
          <div class="dapp-wrap pointer" @click.prevent="goGame(item)">
            <div class="dapp-header">
              <i
                class="dapp-icon"
                :style="{background: `url('${item.icon_url}') no-repeat center 100%/cover`}"
              ></i>
              <h4 class="dapp-title ft-16 c-333 helveticaNeue-Medium">{{item.title}}</h4>
            </div>
            <!---->
            <p class="dapp-desc ft-14 c-999">{{item.desc}}</p>
            <!---->
          </div>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ElectronHelpers from "../../../util/ElectronHelpers";
import { urlReg } from "../../utils/RegExp";
const ipc = window.require("electron").ipcRenderer;

export default {
  name: "home-main",
  props: {
    categoryList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dappList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  data() {
    return {
      categoryIndex: 0,
      dappKey: "",
      form: {
        start: 0,
        count: 40,
        lang: "zh-Hans",
        key: "",
        status: 0,
        category_id: null,
        version: "10.0.0"
      },
      systemList: [],
      isFixedCategory: false,
      loading: false
    };
  },
  computed: {
    ...mapGetters(["language", "currentAccount"]),
    category() {
      const categoryList = [...this.categoryList];
      categoryList.unshift({
        hid: -1,
        title: this.$t("TP.GENERIC.All")
      });
      return categoryList;
    }
  },
  watch: {
    async language() {
      // await this.$store.dispatch('GET_CATEGORY_LIST')
      // await this.$store.dispatch('GET_DAPP_LIST', { nextPage: false })
    }

    // dappKey() {
    //   if (!urlReg(this.dappKey)) {
    //     this.$emit('dapp-key', this.dappKey)
    //   }
    // }
  },
  methods: {
    async moreDapp() {
      // await this.$store.dispatch('GET_CATEGORY_LIST')
      // this.$store.dispatch('GET_DAPP_LIST', { nextPage: true })
    },

    goDetail(id) {
      //   CreateDAppWebView(
      //     `https://dapp.mytokenpocket.vip/detail/index.html#/dapp/${id}`
      //   );
      // ElectronHelpers.openLinkInBrowser('https://dapp.mytokenpocket.vip/detail/index.html#/dapp/' + id);
    },

    goGame(item) {
      // console.log(item)
      // return false
      if (item.platform.trx === 1) {
        ipc.send("goGame", {
          data: item,
          account: {
            ...this.currentAccount,
            blockchain: this.currentAccount.blockchain()
          }
        });
      } else {
        ElectronHelpers.openLinkInBrowser(item.url);
      }
    },

    searchDapp() {
      if (urlReg(this.dappKey)) {
        ElectronHelpers.openLinkInBrowser(this.dappKey);
      } else {
        this.$store.commit("DAPP_FORM", { type: "reset" });
        this.$store.commit("DAPP_LIST", []);
        this.$store.dispatch("GET_DAPP_LIST", { key: this.dappKey });
      }
    },

    async categoryChange(item, index) {
      this.categoryIndex = index;
      this.$store.commit("DAPP_FORM", { type: "reset" });
      this.$store.commit("DAPP_LIST", []);
      await this.$store.dispatch("GET_CATEGORY_ID", item.hid);
      await this.$store.dispatch("GET_DAPP_LIST", { key: this.dappKey });
    }
  }
};
</script>

<style lang="scss" scoped>
.category-list {
  display: flex;
  flex-wrap: wrap;
}

.dapp-category {
  padding: 15px 10px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(218, 226, 235, 1);
  border-radius: 8px;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow-x: auto;
}

.category-title {
  display: inline-block;
  margin: 0 8px;
}

.dapp-list {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 25%;
}

.dapp-wrap {
  width: 275px;
  /*height: 250px;*/
  background: #fff;
  display: inline-block;
  border: 1px solid #dae2eb;
  /*padding: 16px 24px 30px;*/
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 26px 40px -24px rgba(0, 36, 100, 0.3);
  }

  .dapp-header {
    display: flex;
    align-items: center;
    /*position: relative;*/
    .dapp-icon {
      display: inline-block;
      width: 47px;
      min-width: 47px;
      height: 47px;
      background-size: 100%;
      border-radius: 5px;
    }

    .dapp-title {
      /*position: absolute;*/
      /*left: 65px;*/
      margin: 0 0 0 19px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 设置行数 */
      -webkit-box-orient: vertical;
      max-width: 138px;
      max-height: 62px;
      word-break: break-all;
    }
  }

  .dapp-desc {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 设置行数 */
    -webkit-box-orient: vertical;
    line-height: 1.5em;
    padding: 10px 0 0;
    height: 40px;
  }
}

.dapp-rate {
  display: flex;
  align-items: baseline;

  p {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0;

    &:first-child {
      flex: 2;
    }
  }
}

.dapp-info {
  display: flex;
  align-items: center;
  margin-top: 15px;

  span {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  i {
    margin-right: 10px;
  }
}

.icon-detail {
  display: inline-block;
  width: 18px;
  height: 19px;
  background: url(../../assets/images/icon-detail.png) no-repeat 100% 100%/100%
    100%;
}

.icon-game {
  display: inline-block;
  width: 24px;
  height: 19px;
  background: url(../../assets/images/icon-game.png) no-repeat 100% 100%/100%
    100%;
}

/deep/ .el-rate {
  display: inline-block;
  height: auto;
  line-height: normal;
}

/deep/ .el-rate__icon {
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .dapp-wrap {
    width: 100%;
  }
}

@media screen and (max-width: 420px) {
  .dapp-category {
    margin-bottom: 20px;
  }

  .dapp-wrap {
    padding: 10px 10px 15px;
  }

  .dapp-wrap .dapp-desc {
    font-size: 12px;
  }

  .dapp-wrap .dapp-header .dapp-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }

  .dapp-wrap .dapp-header .dapp-title {
    font-size: 14px;
    margin: 0 0 0 10px;
  }

  .dapp-list {
    margin-bottom: 20px;
  }

  .dapp-rate {
    /*display: block;*/
  }

  .dapp-rate p {
    display: flex;
    align-items: center;
    font-size: initial;

    &:first-child {
      flex: 1;

      span {
        &:last-child {
          display: none !important;
        }
      }
    }

    &:last-child {
      flex: 3;
      font-size: 12px;
      /*margin-top: 5px;*/
    }
  }

  .dapp-info {
    margin-top: 15px;
  }
}
</style>
