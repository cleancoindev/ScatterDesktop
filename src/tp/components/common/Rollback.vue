<template>
    <div class="TP-Rollback">
        <section class="action-bar short bottom centered">
            <Button :text="$t('TP.GENERIC.Back')" @click.native="back" />
<!--            <Button :text="locale(langKeys.GENERIC.Enable)" blue="1" @click.native="returnResult(true)" />-->
        </section>
<!--        <button @click="back">Back</button>-->
    </div>
</template>

<script>
  export default {
    name: "Rollback",
    data() {
       return {

       }
    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        back() {
            this.$router.go(-1)
        }
    },
    watch: {

    }
  }
</script>

<style lang="scss" scoped>
    .TP-Rollback {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        height: 70px;
        border: 1px solid #dfe0e1;
        background: #fff;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 20px;
        /*height: 40px;*/
        /*line-height: 40px;*/
        /*padding: 0 20px;*/
    }
</style>
