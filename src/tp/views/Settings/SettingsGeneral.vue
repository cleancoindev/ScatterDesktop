<template>
    <section>
        <!-- 版本 -->
        <!--<section class="action-box top-pad">-->
            <!--<label>{{$t($langKeys.SETTINGS.GENERAL.VersionLabel)}}</label>-->
            <!--<b>Scatter Desktop v{{version}}</b>-->

            <!--<btn :class="{'wiggle':needsUpdate}"-->
                 <!--:disabled="!needsUpdate"-->
                 <!--:red="needsUpdate"-->
                 <!--v-on:clicked="openUpdateLink"-->
                 <!--:text="needsUpdate-->
                     <!--? $t($langKeys.SETTINGS.GENERAL.UpdateAvailable)-->
                     <!--: $t($langKeys.SETTINGS.GENERAL.NoUpdateAvailable)">-->
            <!--</btn>-->
        <!--</section>-->

        <!-- 白名单通知 -->
        <section class="action-box top-pad">
            <label>{{$t('TP.GENERAL.WhitelistNotificationsLabel')}}</label>
            <p>{{$t('TP.GENERAL.WhitelistNotificationsDescription')}}</p>

            <section class="switch bottomed" @click="toggleNotifications">
                <figure class="dot" :class="{'disabled':!showNotifications}"></figure>
            </section>
        </section>

        <!-- 数据储存 -->
        <!--<section class="action-box top-pad">-->
            <!--<label>{{$t($langKeys.SETTINGS.GENERAL.DataPathLabel)}}</label>-->
            <!--<p>{{$t($langKeys.SETTINGS.GENERAL.DataPathDescription)}}</p>-->

            <!--<br>-->
            <!--<br>-->
            <!--<cin style="margin-bottom:0;"-->
                 <!--dynamic-button="icon-folder-open-empty"-->
                 <!--disabled="1" :text="dataPath"-->
                 <!--v-on:dynamic="openFilePathLink">-->
            <!--</cin>-->
        <!--</section>-->

        <!-- 调试工具 -->
        <!--<section class="action-box top-pad">-->
            <!--<label>{{$t($langKeys.SETTINGS.GENERAL.DeveloperConsoleLabel)}}</label>-->
            <!--<p>{{$t($langKeys.SETTINGS.GENERAL.DeveloperConsoleDescription)}}</p>-->
            <!--<btn @click.native="openConsole"-->
                 <!--:text="$t($langKeys.SETTINGS.GENERAL.DeveloperConsoleButton)"></btn>-->
        <!--</section>-->

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex'
    import * as Actions from '../../../store/constants';

    // import UpdateService from '../../../services/UpdateService';
    import WindowService from '../../../services/utility/WindowService';
    import ElectronHelpers from '../../../util/ElectronHelpers';

    import {remote} from '../../../util/ElectronHelpers';
    const app = remote.app;

    export default {
        data () {return {
            needsUpdate:null,
        }},
        computed:{
            ...mapState([
                'scatter'
            ]),
            ...mapGetters([
                'showNotifications',
                'version',
            ]),
            dataPath(){
            	return app.getPath('userData');
            }
        },
        mounted(){
            // UpdateService.needsUpdateNoPrompt(false).then(needsUpdate => {
            //     this.needsUpdate = !!needsUpdate;
            // })
        },
        methods: {
        	openFilePathLink(){
        	    ElectronHelpers.openLinkInBrowser(this.dataPath);
            },

	        openUpdateLink(){
		        // ElectronHelpers.openLinkInBrowser(UpdateService.updateUrl());
	        },

	        openConsole(){ WindowService.openTools(); },
            async toggleNotifications(){
                const scatter = this.scatter.clone();
                scatter.settings.showNotifications = !scatter.settings.showNotifications;
                this[Actions.SET_SCATTER](scatter);
            },
            ...mapActions([
                Actions.SET_SCATTER
            ])
        },
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    @import "../../../styles/variables";


    .line {
      width:100%;
      height:1px;
      background:rgba(0,0,0,0.1);
      margin-top:30px;
    }
</style>
