<template>
  <div class="tp-webview-dapp">
    <button @click="sendMessgae">Send Message</button>
    <webview id="webview" style="height:calc(100vh - 40px)" nodeintegration :src="url"></webview>
  </div>
</template>

<script>
// import Stroage
import PluginRepository from "../../../plugins/PluginRepository";
// import TransferService from "../../../services/blockchain/TransferService";
const ipc = window.require("electron").ipcRenderer;
const remote = window.require("electron").remote;
const { ipcMain } = remote;

export default {
  name: "WebViewDApp",
  data() {
    return {
      url: "https://www.baidu.com",
      res: {},
      inject: ""
    };
  },
  methods: {
    sendMessgae() {
      const webview = document.querySelector("#webview");

      webview.addEventListener("dom-ready", res => {
        webview.isLoadingMainFrame(true);
        webview.openDevTools();
        webview.executeJavaScript(this.inject, true).then(result => {
          // 发送给 insert trx.js
          ipc.send("CONTACT_TRON_WEB", this.res.account);
        });
      });

    webview.addEventListener('close', () => {
      webview.src = null;
    })
    }
  },
  created() {},
  mounted() {
    ipc.on("INSERT_WEBVIEW_DATA", (event, arg) => {
      // console.log(arg, "INSERT_WEBVIEW_DATA");
      this.url = arg.data.url;
      this.res = arg;
      this.inject = arg.js;
      this.sendMessgae();
    });

    ipcMain.on("DAPP_SIGNS", (event, arg) => {
      let datas = {};
      if (typeof arg === "string") {
        try {
          datas = JSON.parse(arg)
        } catch (e){
          console.log(e)
        }
      } else {
        datas = arg
      }

      console.log(datas, "DAPP_SIGNS");
      const plugin = PluginRepository.plugin('trx');
      plugin.dappSign(datas)
    });
  }
};
</script>