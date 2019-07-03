<template>
    <section class="tokens-panel">
        <section class="tokens-header">
            <section class="tokens-header-top">
                <section>
                    <h3 class="c-fff ft-22">{{$t('TP.GENERIC.MyAsset')}}</h3>
                </section>

                <section class="text-right">
                    <!-- 刷新 -->
                    <el-button class="btn-transfer"
                               size="mini"
                               round
                               @click="refreshTokens"
                               :loading="loadingBalances">
                        {{$t('TP.GENERIC.RefreshBalances')}}
                    </el-button>

                    <!-- 转账 -->
<!--                    <el-button class="btn-transfer"-->
<!--                               size="mini"-->
<!--                               round-->
<!--                               @click="$router.push({name: RouteNames.TRANSFER})">-->
<!--                        {{$t('TP.TRANSFER.Title')}}-->
<!--                    </el-button>-->
                </section>

            </section>

            <section class="tokens-header-bottom">
                <section class="c-fff">
                    <h3>{{assetInfo.unit || '$'}} {{currentAccount.totalFiatBalance ? currentAccount.totalFiatBalance() : 0}}</h3>
                </section>

                <!-- 搜索token -->
                <section class="text-right">
                    <div class="tokens-search-wrap">
                        <div class="tokens-search-bar ">
                            <!--                            <svg-icon icon-class="search" :class-name="['c-fff']"></svg-icon>-->
                            <input type="search"
                                   class="ft-16"
                                   :placeholder="$t('TP.GENERIC.Search')"
                                   v-model="terms"/>
                        </div>

                    </div>
                </section>
            </section>
        </section>

        <section class="tokens-content">
            <TokenList :balances="tokens" :terms="terms"/>
<!--            <section class="tokens" v-for="(token, index) in tokens" :key="index" @click="goTransfer(token)">-->
<!--                <section class="tokens-list pointer">-->
<!--                    <figure class="icon">-->
<!--&lt;!&ndash;                        <img class="symbol-icon" :src="token.icon_url" alt="">&ndash;&gt;-->
<!--                    </figure>-->

<!--                    <section class="name">-->
<!--                        <figure class="c-232538 ft-24">{{token.symbol}}</figure>-->
<!--                    </section>-->

<!--                    <section class="amount">-->
<!--                        <figure class="c-232538 ft-24" style="margin-bottom: 19px">{{token.balance}}</figure>-->
<!--                        <figure class="c-c4c7d2 ft-20">-->
<!--                            ≈ {{token.amount}}-->
<!--&lt;!&ndash;                            {{token.asset.toFixed(4)}}&ndash;&gt;-->
<!--                        </figure>-->
<!--                    </section>-->
<!--                </section>-->

<!--            </section>-->

        </section>


    </section>
</template>

<script>
    import { mapGetters } from 'vuex';
    import TokenList from './TokenList'
    import BalanceService from "../../../services/blockchain/BalanceService";

    export default {
        components: {
            TokenList
        },
        data() {
            return {
                loadingBalances: false,
                searchTerms: '',
                assetInfo: {},
                terms: '',
            };
        },

        computed: {
            ...mapGetters([
                'tpAccounts',
                'currentAccount'
            ]),
            tokens() {
               return this.currentAccount.tokens ? this.currentAccount.tokens() : []
            }
        },

        mounted() {
            // this.getAsset();
            // console.log(this.currentAccount.tokenCount());
            // console.log(this.currentAccount.totalFiatBalance());

            // const tokens =

            // console.log(tokens);
            // })
            this.lazyLoadBalances()
        },

        methods: {
            goTransfer(token) {
                this.$router.push({
                    name: this.RouteNames.TRANSFER,
                    query: { symbol: token.symbol }
                });
            },

            async refreshTokens() {
                this.lazyLoadBalances();
            },

            async lazyLoadBalances(){
                this.loadingBalances = true;
                await BalanceService.loadBalancesFor(this.currentAccount);
                setTimeout(() => this.loadingBalances = false, 500);
            },
        },

        watch: {
            currentAccount() {
                this.lazyLoadBalances();
            },
        }
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">

    .btn-transfer {
        background: transparent;
        color: #fff;
        height: 30px;
    }

    .tokens-header {
        padding: 35px 40px 40px 40px;
        background: linear-gradient(270deg, rgba(32, 72, 204, 1) 0%, rgba(22, 161, 248, 1) 100%);

        .tokens-header-top,
        .tokens-header-bottom {
            h3 {
                margin: 0;
            }

            display: flex;
            align-items: center;

            section {
                flex: 1;
            }
        }

        .tokens-header-top {
            margin-bottom: 25px;
        }


        .tokens-search-wrap {
            display: inline-block;

            .tokens-search-bar {
                display: flex;
                width: 300px;
                height: 40px;
                border: 1px solid #fff;
                border-radius: 20px;
                align-items: center;
                padding: 0 10px;

                > input {
                    font-family: "Microsoft YaHei", sans-serif;
                    outline: none;
                    box-shadow: none;
                    width: 100%;
                    height: 90%;
                    margin: 0 10px;
                    background: transparent;
                    color: #fff;
                    border: 0;

                    &::-webkit-input-placeholder {
                        color: #fff;
                    }
                }
            }
        }
    }


    .tokens-content {
        /*padding: 0 40px;*/
        height: calc(100vh - 170px - 40px);
        overflow: auto;

        .tokens {
            .tokens-list {
                display: flex;
                align-items: center;
                padding: 20px 40px;
                border-bottom: 1px solid #E8EBF4;

                .icon {
                    margin-right: 50px;

                    .symbol-icon {
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 50%;
                    }
                }

                .name,
                .amount {
                    flex: 1
                }

            }
        }
    }

</style>
