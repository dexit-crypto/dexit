import Units from "ethereumjs-units";

const priceConsumerArtifacts = require("../assets/contracts/PriceConsumerV3");

export default class PriceOracle {

    constructor(web3, tokens) {
        this.web3 = web3
        this._prices = new Map
        this.tokens = tokens
    }

    async init(){
        for (const token of this.tokens) {
            await this.feedPrice(token.symbol, token.oracle)
        }
    }

    async feedPrice(tokenSymbol, oracleAddress){
        const oracle = new this.web3.eth.Contract(priceConsumerArtifacts.abi, oracleAddress, {
            from: window.ethereum.selectedAddress,
        });
        const price = await oracle.methods.getLatestPrice().call()
        const priceInDollars = 1 / Units.convert(price, 'wei', 'eth')

        this._prices.set(tokenSymbol, priceInDollars)
    }

    get prices() {
        return this._prices;
    }

}
