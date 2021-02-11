import Vue from 'vue'
import Vuex from 'vuex'
import {defaultConfig} from "@/web3/config";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        web3: null,
        tokens: defaultConfig.tokens,
        swapper: defaultConfig.swapper,
        prices: null,
        admin: null,
    },
    getters: {
        web3Enabled: state => state.web3 !== null,
    },
    mutations: {}
})

export default store;
