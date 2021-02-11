const erc20Artifacts = require("../assets/contracts/ERC20");

export default class ERC20Manager {

    constructor(web3) {
        this.web3 = web3
    }

    async balanceOf(contract = null, address) {
        return await contract.methods.balanceOf(address)
    }

    newContract(address) {
        return new this.web3.eth.Contract(erc20Artifacts.abi, address, {
            from: window.ethereum.selectedAddress,
        });
    }

}
