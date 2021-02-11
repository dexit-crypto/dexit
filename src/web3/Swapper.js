const swapArtifacts = require("../assets/contracts/Swap");
const erc20Artifacts = require("../assets/contracts/ERC20");

export default class Swapper {

    constructor(web3, address, tokenAddressMap) {
        this.web3 = web3
        this._address = address
        this.tokenAddressMap = tokenAddressMap
    }

    async swap(
        _swapContract = null,
        sender = window.ethereum.selectedAddress,
        fromSymbol,
        toSymbol,
        amount,
        onReceipt,
        onError,
    ) {
        this.assertKnown(fromSymbol)
        this.assertKnown(toSymbol)
        const swapContract = this.getSwapContract(_swapContract, sender)
        const tokenFromAddress = this.tokenAddressMap.get(fromSymbol)
        const tokenToAddress = this.tokenAddressMap.get(toSymbol)
        swapContract.methods
            .swap(tokenFromAddress, tokenToAddress, amount)
            .send({from: sender})
            .on("receipt", onReceipt)
            .on("error", onError);
    }

    async depositEth(_swapContract = null,
                     sender = window.ethereum.selectedAddress,
                     amount,
                     onReceipt,
                     onError,) {
        const swapContract = this.getSwapContract(_swapContract, sender)
        swapContract.methods
            .deposit()
            .send({from: sender, value: amount})
            .on("receipt", onReceipt)
            .on("error", onError);
    }

    async depositErc20(_swapContract = null,
                       sender = window.ethereum.selectedAddress,
                       erc20Address,
                       amount,
                       onReceipt,
                       onError,) {
        const swapContract = this.getSwapContract(_swapContract, sender)
        swapContract.methods
            .deposit(erc20Address, amount)
            .send({from: sender,})
            .on("receipt", onReceipt)
            .on("error", onError);
    }

    async swapEthToErc20(_swapContract = null,
                         sender = window.ethereum.selectedAddress,
                         erc20Address,
                         amount,
                         onReceipt,
                         onError,) {
        const swapContract = this.getSwapContract(_swapContract, sender)
        swapContract.methods
            .swap(erc20Address)
            .send({from: sender, value: amount})
            .on("receipt", onReceipt)
            .on("error", onError);
    }

    async swapErc20ToErc20(_swapContract = null,
                           sender = window.ethereum.selectedAddress,
                           erc20InputAddress,
                           erc20OutputAddress,
                           amount,
                           onReceipt,
                           onError,) {
        const swapContract = this.getSwapContract(_swapContract, sender)
        swapContract.methods
            .swap(erc20InputAddress, erc20OutputAddress, amount)
            .send({from: sender, value: amount})
            .on("receipt", onReceipt)
            .on("error", onError);
    }

    async approve(_swapContract = null,
                  sender = window.ethereum.selectedAddress,
                  erc20Address,
                  amount,
                  onReceipt,
                  onError,) {
        const erc20Contract = this.getErc20Contract(_swapContract, sender, erc20Address)
        erc20Contract.methods
            .approve(this._address, amount)
            .send({from: sender,})
            .on("receipt", onReceipt)
            .on("error", onError);
    }

    deploy(
        sender,
        sendTransactionCallBack,
        receiptCallback,
        deployedCallback
    ) {
        this.newSwapContract(sender)
            .deploy({
                data: swapArtifacts.bytecode,
                arguments: []
            })
            .send({from: sender}, sendTransactionCallBack)
            .on("receipt", receiptCallback)
            .then(deployedCallback);
    }


    getSwapContract(swapContract, sender) {
        this.assert(swapContract !== null || sender !== null)
        if (swapContract !== null) {
            return swapContract
        } else {
            return this.newSwapContract(sender)
        }
    }

    newSwapContract(sender) {
        return new this.web3.eth.Contract(swapArtifacts.abi, this._address, {
            from: sender
        });
    }

    getErc20Contract(contract, sender, address) {
        this.assert(contract !== null || sender !== null)
        if (contract !== null) {
            return contract
        } else {
            return this.newErc20Contract(sender, address)
        }
    }

    newErc20Contract(sender, address) {
        return new this.web3.eth.Contract(erc20Artifacts.abi, address, {
            from: sender
        });
    }

    assert(condition, errorMessage) {
        if (!condition) {
            throw new Error(errorMessage)
        }
    }

    assertKnown(key) {
        this.assert(this.tokenAddressMap.has(key), "unknown key")
        if (!this.tokenAddressMap.has(key)) {
            throw new Error("unknown key")
        }
    }

    get address() {
        return this._address;
    }

}
