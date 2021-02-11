const factoryArtifacts = require("../assets/contracts/Factory");

export default class Admin {

    constructor(web3) {
        this.web3 = web3
    }

    setup(onSuccess, onError) {
        const factoryContract = new this.web3.eth.Contract(factoryArtifacts.abi)
        factoryContract.deploy({
            data: factoryArtifacts.bytecode,
            arguments: []
        })
            .send({from: window.ethereum.selectedAddress}, function (err, hash) {
                if (err !== null) {
                    onError(err)
                }
                console.log("transactionHash: ", hash)
            })
            .on("receipt", onSuccess)
    }

    async getInformation(factoryAddress) {
        const factoryContract = new this.web3.eth.Contract(factoryArtifacts.abi, factoryAddress)
        return {
            swap: await factoryContract.methods.getSwapContractAddress().call(),
            aave: await factoryContract.methods.getAave().call(),
            bat: await factoryContract.methods.getBat().call(),
            gno: await factoryContract.methods.getGno().call(),
            link: await factoryContract.methods.getLink().call(),
            uni: await factoryContract.methods.getUni().call(),
            usdt: await factoryContract.methods.getUsdt().call(),
            weth: await factoryContract.methods.getWeth().call(),
            wbtc: await factoryContract.methods.getWbtc().call(),
        }
    }
}
