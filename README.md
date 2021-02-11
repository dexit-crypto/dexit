# dexit

Dexit is a decentralized exchange of BEP-20 token on Binance Smart Chain.
It uses Chainlink oracle to determine equivalent prices of tokens.
Chainlink enables your contracts to access to any external data source, through a decentralized oracle network..

## Live demo

https://dexit.surge.sh/ working on BSC testnet.

## Youtube demo video

https://youtu.be/LAnusWk9fqc


## Price feed oracle

Each token is associated to its corresponded oracle address:

The DEX uses price feed oracle contracts to determine the price: https://docs.chain.link/docs/get-the-latest-price

For the purpose of the demo a mock implementing chainlink interface has been deployed for each token.

| Token Symbol 	|                   Address                   	| Oracle address                             	|
|:------------:	|:-------------------------------------------:	|--------------------------------------------	|
| AAVE         	| 00x07b8b9347b4cFc064613335a160598cc6e110292 	| 0x66145362745693A43392F5A9C9fa9e0767228392 	|
| BAT          	| 0xaC9f8801cA7e65c230a0E3c186731B5aD00e4936  	| 0x4561130548289d0a88Ad6652a7d0884BcF8aa5CD 	|
| GNO          	| 0x979ac46A3911b2ee71d07D01ebf99a3a8CE6e858  	| 0x7985F50E6b51a93D55819124c8469D1AD7A6004f 	|
| LINK         	| 0xAC3088c2deB916752779949161d2D4f2ae2Cd22B  	| 0x52E7D5fBC0a7F6A3bF57B10C96511d44447C24d0 	|
| UNI          	| 0xFf9854820CeF1fF1e795Cdc933CC87A82DaA105c  	| 0x2Dd7AfD29731C0e5138839c7c348414A51b0Da76 	|
| USDT         	| 0xE50d832c0fDE7A1A3D851e4E77481e85C9e547fF  	| 0x80Ac28337efE3095A99E64913a3c9e7B6c3FC690 	|


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
