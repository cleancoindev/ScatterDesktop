<template>
	<section class="pop-in generate-key">

		<!-- SELECT IMPORT TYPE -->
		<section class="select-type">
			<section class="head">
				<Key />
				<br>
				<br>
				<figure class="title">Generate Keypair</figure>
			</section>
			<br>
			<br>

			<section class="type-selector">
				<section class="types">
					<section class="type" v-for="blockchain in Blockchains" @click="generate(blockchain)">
						<figure class="type-icon" :class="`token-${blockchain}-${blockchain}`"></figure>
						<figure class="type-text">{{blockchainName(blockchain)}}</figure>
					</section>
				</section>
			</section>


		</section>


		<ActionBar :buttons-left="[{text:'Cancel', click:() => this.returnResult(false)}]"  />


	</section>
</template>

<script>
	import { mapActions, mapGetters, mapState } from 'vuex'
	import * as Actions from '../../../store/constants';
	import KeyPairService from "../../../services/secure/KeyPairService";
	import Keypair from "../../../models/Keypair";
	import {BlockchainsArray} from '../../../models/Blockchains'
	import IdGenerator from "../../../util/IdGenerator";
	import AccountService from "../../../services/blockchain/AccountService";
	import Key from '../../svgs/Key'

	export default {
		components:{Key},
		props:['popin'],
		data(){return {
			Blockchains:BlockchainsArray.map(x => x.value)
		}},
		computed:{
			...mapGetters([
				'keypairs'
			]),

			options(){
				return this.popin.data.props.options;
			},
		},
		methods:{
			returnResult(keypair){
				this.popin.data.callback(keypair);
				this[Actions.RELEASE_POPUP](this.popin);
			},

			async generate(blockchain){
				this.setWorkingScreen(true);
				const keypair = Keypair.placeholder();
				keypair.blockchains = [blockchain];
				await KeyPairService.generateKeyPair(keypair);
				await KeyPairService.makePublicKeys(keypair);
				keypair.setName();
				await KeyPairService.saveKeyPair(keypair);
				await AccountService.importAllAccounts(keypair, true, [blockchain]);
				this.returnResult(keypair);
				this.setWorkingScreen(false);
			},

			...mapActions([
				Actions.RELEASE_POPUP
			])
		},

	}
</script>

<style scoped lang="scss">
	@import "../../../styles/variables";

	.generate-key {


		.select-type {


		}

	}

</style>