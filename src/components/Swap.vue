<template>
  <v-container>
    <v-card
        title="Swap"
        class="mx-auto"
        max-width="512"
        :color="mainCardColor"
        elevation="2"
        outlined
        :loading="swapInProgress"
    >
      <v-card-title>Swap</v-card-title>

      <v-card rounded outlined class="mx-2">
        <v-card-subtitle>From</v-card-subtitle>
        <v-row>
          <v-col class="col-md-3">
            <v-text-field
                flat solo placeholder="0.0"
                hide-details="auto"
                v-model="amountFrom"
                v-on:input="updateToTokenAmount"
            ></v-text-field>
          </v-col>
          <v-col class="col-md-2 mt-2">
            <v-btn @click="setFromTokenMaxBalance" :color="btnMaxColor">
              Max
            </v-btn>
          </v-col>
          <v-col
              class="d-flex col-6 ml-2"
          >
            <v-select
                :items="tokens"
                v-model="tokenFrom"
                item-text="symbol"
                item-value="symbol"
                return-object
                single-line
                outlined
            >
              <template v-slot:selection="{item}">
                <v-avatar size="36">
                  <img
                      :src="imgSrcForSymbol(item.symbol)"
                      :alt="item.symbol"
                  >
                </v-avatar>
                <v-spacer></v-spacer>
                {{ item.symbol }} {{tokenFromUsd}}
              </template>
              <template v-slot:item="{item}">
                <v-avatar size="36">
                  <img
                      :src="imgSrcForSymbol(item.symbol)"
                      :alt="item.symbol"
                  >
                </v-avatar>
                <v-spacer></v-spacer>
                {{ item.symbol }} {{priceLabel(item.symbol)}}
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card>

      <v-row class="mt-4 mb-2">
        <v-col cols="12" sm="12" md="12" class="text-center">
          <v-icon x-large color="success">
            mdi-arrow-down-bold-circle-outline
          </v-icon>
        </v-col>
      </v-row>

      <v-card rounded outlined class="mx-2">
        <v-card-subtitle>To</v-card-subtitle>
        <v-row>
          <v-col class="col-md-5">
            <v-text-field
                readonly
                flat solo placeholder="0.0"
                hide-details="auto"
                v-model="amountTo"
                v-on:input="updateFromTokenAmount"
            ></v-text-field>
          </v-col>
          <v-col
              class="d-flex col-md-6 ml-2"
          >
            <v-select
                :items="tokens"
                v-model="tokenTo"
                item-text="symbol"
                item-value="symbol"
                v-on:change="tokenToChanged"
                return-object
                single-line
                outlined
            >
              <template v-slot:selection="{item}">
                <v-avatar size="36">
                  <img
                      :src="imgSrcForSymbol(item.symbol)"
                      :alt="item.symbol"
                  >
                </v-avatar>
                <v-spacer></v-spacer>
                {{ item.symbol }} {{priceLabel(item.symbol)}}
              </template>
              <template v-slot:item="{item}">
                <v-avatar size="36">
                  <img
                      :src="imgSrcForSymbol(item.symbol)"
                      :alt="item.symbol"
                  >
                </v-avatar>
                <v-spacer></v-spacer>
                {{ item.symbol }} {{priceLabel(item.symbol)}}
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card>

      <v-row align-content="center" class="mt-4 mx-1 mb-2">
        <v-col class="col-6">
          <v-btn
              @click="allow"
              color="dark"
              large
              block
          >
            Allow
            <v-icon
                class="ml-2"
                dark
            >
              mdi-account-check
            </v-icon>
          </v-btn>
        </v-col>
        <v-col class="col-6">
          <v-btn
              @click="swap"
              color="primary"
              large
              block
              :disabled="!swapEnabled"
          >
            Swap
            <v-icon
                class="ml-2"
                dark
            >
              mdi-swap-horizontal-bold
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import colors from 'vuetify/lib/util/colors'
import Units from "ethereumjs-units";
import ERC20Manager from "@/web3/Erc20";

export default {
  name: 'Swap',
  data: () => ({
    erc20: null,
    swapInProgress: false,
    tokenFrom: null,
    amountFrom: null,
    tokenTo: null,
    amountTo: null,
  }),
  methods: {
    tokenToChanged(){
      this.updateToTokenAmount()
    },
    priceLabel(symbol){
      return `~${this.priceFor(symbol)} $`
    },
    swap() {
      if (this.tokenFrom.symbol !== this.tokenTo.symbol) {
        if (this.tokenFrom.symbol === 'ETH' || this.tokenFrom.symbol === 'BNB') {
          this.swapEthToErc20()
        } else if (this.tokenTo.symbol === 'ETH' || this.tokenTo.symbol === 'BNB') {
          this.swapErc20ToEth()
        } else {
          this.swapErc20ToErc20()
        }
      } else {
        console.error('from token and to token must be different')
      }
    },
    swapEthToErc20() {
      this.swapInProgress = true
      const _amount = Units.convert(this.amountFrom, 'eth', 'wei')
      this.swapper.swapEthToErc20(null, window.ethereum.selectedAddress, this.tokenTo.address, _amount, this.swapSuccess, this.swapError)
    },
    swapErc20ToErc20() {
      this.swapInProgress = true
      const _amount = Units.convert(this.amountFrom, 'eth', 'wei')
      this.swapper.swapErc20ToErc20(null, window.ethereum.selectedAddress, this.tokenFrom.address, this.tokenTo.address, _amount, this.swapSuccess, this.swapError)
    },
    swapErc20ToEth() {
    },
    swapSuccess(receipt) {
      console.log('swap success: ', receipt)
      this.swapInProgress = false
    },
    swapError(error) {
      console.error('swap error: ', error)
      this.swapInProgress = false
    },
    allow() {
      const _amount = Units.convert(this.amountFrom, 'eth', 'wei')
      this.swapper.approve(null, window.ethereum.selectedAddress, this.tokenFrom.address, _amount, this.swapSuccess, this.swapError)
    },
    async setFromTokenMaxBalance() {
      if (this.tokenFrom.symbol === 'ETH' || this.tokenFrom.symbol === 'BNB') {
        this.amountFrom = Units.convert(await this.web3.eth.getBalance(window.ethereum.selectedAddress), 'wei', 'eth')
      } else {
        const contract = this.erc20.newContract(this.tokenFrom.address)
        const userBalance = await contract.methods.balanceOf(window.ethereum.selectedAddress).call()
        this.amountFrom = Units.convert(userBalance, 'wei', 'eth')

      }
    },
    updateFromTokenAmount() {

    },
    updateToTokenAmount() {
      if (this.amountFrom === null || this.amountFrom === 0 || this.amountFrom === '') {
        this.amountTo = 0.0
      }
      if (this.amountFrom !== null && this.amountFrom !== 0 && this.amountFrom !== '0.' && this.amountFrom !== '0'
          && this.amountFrom !== '0.0') {
        const fromPrice = this.priceFor(this.tokenFrom.symbol)
        const toPrice = this.priceFor(this.tokenTo.symbol)
        const ratio = ((fromPrice / toPrice) * this.amountFrom).toFixed(2)
        if (ratio !== 'Infinity') {
          this.amountTo = ratio
        }
      }
    },
    imgSrcForSymbol(symbol) {
      return `/img/tokens/${symbol}.png`
    },
    priceFor(symbol) {
      return this.prices.get(symbol).toFixed(2)
    },
  },
  async mounted() {
    this.erc20 = new ERC20Manager(this.web3)
    if (Array.isArray(this.tokens) && this.tokens.length > 0) {
      this.tokenFrom = this.tokens[0]
      if (this.tokens.length > 1) {
        this.tokenTo = this.tokens[1]
      }
    }

  },
  computed: {
    tokenFromUsd(){
      return `~${this.priceFor(this.tokenFrom.symbol)} $`
    },
    tokenToUsd(){
      return `~${this.priceFor(this.tokenTo.symbol)} $`
    },
    swapEnabled() {
      return this.tokenFrom !== null && this.tokenTo !== null
          && this.amountFrom !== null
          && this.amountFrom !== 0
    },
    mainCardColor() {
      return colors.grey.darken4
    },
    btnMaxColor() {
      return colors.pink.lighten2
    },
    ...mapState(["web3", "tokens", "swapper", "prices"])
  },
}
</script>
