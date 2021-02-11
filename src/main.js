import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import {initWeb3} from "@/web3";
import {getConfigForNetworkId} from "@/web3/config";
import Admin from "@/web3/Admin";
import Swapper from "@/web3/Swapper";
import PriceOracle from "@/web3/PriceOracle";

Vue.config.productionTip = false

initWeb3(onWeb3Ready)

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')

async function onWeb3Ready(web3) {
    store.state.web3 = web3
    store.state.admin = new Admin(web3)
    const networkId = await web3.eth.net.getId()
    console.log('Web3 enabled and connected to network: ', networkId)
    const config = getConfigForNetworkId(networkId)
    store.state.tokens = config.tokens
    store.state.swapper = new Swapper(web3, config.swapper.address, null)
    await loadTokensPrice(web3, store.state.tokens)
}

async function loadTokensPrice(web3, tokens){
    const oracle = new PriceOracle(web3, tokens)
    await oracle.init()
    store.state.prices = oracle.prices
}
