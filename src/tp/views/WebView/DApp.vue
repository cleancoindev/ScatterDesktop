<template>
  <div class="tp-webview-dapp">
    <section class="menu-bar">
      <div class="munu-navigation">
        <span @click="changeNavigation('goBack')">
          <i class="munu-navigation-goBack" :class="{'canGoBack': canGoBack}"></i>
        </span>
        <span @click="changeNavigation('goForward')">
          <i class="munu-navigation-goForward" :class="{'canGoForward': canGoForward}"></i>
        </span>
        <span @click="changeNavigation('reload')">
          <i class="munu-navigation-reload"></i>
        </span>
      </div>
      <div class="menu-search">
        <input type="text" :placeholder="dappInput" v-model="url" @keyup.enter="initWebview" />
      </div>
    </section>

    <webview
      id="webview"
      style="height:calc(100vh - 100px)"
      nodeintegrationinsubframes
      enableremotemodule="true"
      nodeintegration
      allowpopups
    ></webview>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AES from "aes-oop";
import Scatter from "../../../models/Scatter";
import { LOAD_SCATTER, SET_SCATTER } from "../../../store/constants";
import PluginRepository from "../../../plugins/PluginRepository";

import StorageService from "../../../services/utility/StorageService";
import PasswordService from "../../../services/secure/PasswordService";
import { ipcAsync } from "../../../util/ElectronHelpers";

const URL = window.require("url");
const ipc = window.require("electron").ipcRenderer;
const remote = window.require("electron").remote;
const { ipcMain } = remote;

export default {
  name: "WebViewDApp",
  data() {
    return {
      url: "",
      res: {},
      inject: "",
      webview: null,
      canGoBack: false,
      canGoForward: false,
      webviewGoBack: null,
      webviewGoForward: null,
      dappURL: ""
    };
  },
  computed: {
    ...mapState(["scatter"]),
    ...mapGetters(["currentAccount"]),
    dappInput() {
      return this.$i18n.locale !== "en"
        ? "输入输入DApp的URL"
        : "Input DApps URL";
    }
  },
  methods: {
    changeNavigation(type) {
      this.webview[type]();
    },

    isCanLoadURL(url) {
      const protocol = URL.parse(url).protocol;
      return protocol === "http:" || protocol === "https:";
    },

    initWebview() {
      const loadURL = this.isCanLoadURL(this.url)
        ? this.url
        : `http://${this.url}`;

      const webview = document.querySelector("#webview");
      this.webview = webview;

      webview.src = loadURL;

      webview.addEventListener("did-finish-load", res => {
        webview.openDevTools();
        this.canGoBack = webview.canGoBack();
        this.canGoForward = webview.canGoForward();
        webview.executeJavaScript(this.inject, true).then(result => {
          // console.log("insert INIT_TRON_WEB");
          // 发送给 insert/trx.js
          ipc.send("CONTACT_TRON_WEB", this.res.account);
          //
        });
      });

      // 当发生页内导航时，触发该事件。
      // 当发生页内导航时，虽然页面地址发生变化，但它并没有导航到其它页面。 例如，点击锚点链接，或者DOM的 hashchange事件被触发时，都会触发该事件
      webview.addEventListener("did-navigate-in-page", e => {
        // console.log(e, "did-navigate-in-page");
        this.url = e.url;
        this.canGoBack = webview.canGoBack();
        this.canGoForward = webview.canGoForward();
      });

      webview.addEventListener("new-window", e => {
        if (this.isCanLoadURL(e.url)) {
          webview.src = e.url;
        }
      });

      webview.addEventListener("close", () => {
        webview.src = null;
      });
    },

    getSigns() {
      // console.log(this.currentAccount);
      // console.log(this.currentAccount.network());
      ipcMain.on("DAPP_SIGNS", (event, arg) => {
        let datas = {};
        if (typeof arg === "string") {
          try {
            datas = JSON.parse(arg);
          } catch (e) {
            console.log(e);
          }
        } else {
          datas = arg;
        }

        // console.log(datas, "DAPP_SIGNS");
        const plugin = PluginRepository.plugin("trx");

        plugin
          .dappSign({
            ...datas,
            account: this.currentAccount
          })
          .then(res => {
            // console.log(res, 'dappSign res')
            ipc.send("REQUEST_SIGNATURE", { res });
          })
          .catch(error => {
            ipc.send("REQUEST_SIGNATURE", { error });
          });
      });
    }
  },
  async created() {
    let scatter =
      StorageService.getScatter() || StorageService.getLocalScatter();
    const seed = await ipcAsync("seed");
    // console.log(seed, 'seed')
    scatter = AES.decrypt(scatter, seed);
    scatter = Scatter.fromJson(scatter);
    scatter.decrypt(seed);
    this.$store.commit(SET_SCATTER, scatter);

    ipc.on("INSERT_WEBVIEW_DATA", (event, arg) => {
      this.url = arg.data.url;
      this.res = arg;
      this.inject = arg.js;
      this.initWebview();
    });

    this.getSigns();
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
// $navigationHeight: 28px;

.menu-bar {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #e6e6e6;
}

.munu-navigation {
  span {
    display: inline-block;
    // width: 30px;
    text-align: center;
    padding: 0 20px;
  }
  .munu-navigation-goBack {
    display: inline-block;
    width: 9px;
    height: 16px;
    background: url("../../assets/images/webview/webview-2.png") no-repeat 100% /
      contain;
    &.canGoBack {
      background: url("../../assets/images/webview/webview-1.png") no-repeat
        100% / contain;
    }
  }

  .munu-navigation-goForward {
    display: inline-block;
    width: 9px;
    height: 16px;
    background: url("../../assets/images/webview/webview-4.png") no-repeat 100% /
      contain;
    &.canGoForward {
      background: url("../../assets/images/webview/webview-3.png") no-repeat
        100% / contain;
    }
  }

  .munu-navigation-reload {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url("../../assets/images/webview/webview-6.png") no-repeat 100% /
      contain;
  }
}

.menu-search {
  flex: 1;
  margin-right: 100px;
  input {
    height: 30px;
    border-radius: 15px;
    width: -webkit-fill-available;
    border: 1px solid #d7d7d7;
    display: inline-block;
    font-size: 14px;
    color: #333;
    &::--webkit-input-placeholder {
      color: #999;
    }
  }
}
</style>