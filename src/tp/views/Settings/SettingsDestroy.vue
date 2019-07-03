<template>
    <section class="TP-Setting-Destroy">

        <p class="ft-16">{{$t('TP.SETTINGS.DESTROY.Description')}}</p>

        <el-button type="danger" size="mini" @click="destroy">
            {{$t('TP.GENERIC.Destroy')}}
        </el-button>

    </section>
</template>

<script>
    import { mapActions, mapGetters, mapState } from 'vuex';
    import * as Actions from '../../../store/constants';

    // import SocketService from '../../../services/SocketService';
    import StorageService from '../../../services/utility/StorageService';
    import PopupService from '../../../services/utility/PopupService';
    import { Popup } from '../../../models/popups/Popup';

    export default {
        data() {
            return {};
        },
        computed: {
            ...mapState([
                'scatter'
            ]),
            ...mapGetters([
                'networks',
            ])
        },
        methods: {
            destroy() {
                PopupService.push(Popup.destroyScatter());
            },
            ...mapActions([
                Actions.SET_SCATTER
            ])
        },
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    ///*@import "../../../styles/variables";*/

    .TP-Setting-Destroy {
        background: #fff;
        padding: 20px;
    }
</style>
