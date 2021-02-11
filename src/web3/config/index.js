const bscTestnetConfig = require("./bsc/testnet").config
const defaultConfig = bscTestnetConfig
const networkIdMap = new Map

networkIdMap.set(97, bscTestnetConfig)

function getConfigForNetworkId(networkId) {
    if(!networkIdMap.has(networkId)){
        throw new Error("unknown network id")
    }else{
        return networkIdMap.get(networkId)
    }
}

export {
    getConfigForNetworkId,
    defaultConfig,
}
