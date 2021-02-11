<template>
  <v-container>
    <v-card
        class="mx-2 my-2"
        :color="mainCardColor"
        elevation="2"
        outlined
    >
      <v-row class="mx-2 my-2">
        <v-col class="col-md-6 col-lg-4" v-for="token in pool.tokens" :key="token.symbol">
          <v-card rounded outlined class="mx-2">
            <v-card-subtitle>
              <span>
                 <v-avatar size="36" class="mr-2">
                  <img
                      :src="imgSrcForSymbol(token.symbol)"
                      :alt="token.symbol"
                  >
                </v-avatar>
                {{ token.symbol }}
                   <v-btn
                       class="mx-2 float-right"
                       fab
                       dark
                       small
                       color="primary"
                       @click="performDeposit(token)"
                   >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
              </span>
            </v-card-subtitle>


            <v-card-text>
              <v-row>
                <v-col class="col-6">
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>Liquidity pool:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-chip class="d-flex justify-end" style="width: 100%;"><span>{{ token.poolBalance }}</span>
                        </v-chip>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Total supply:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-chip class="d-flex justify-end" style="width: 100%;"><span>{{ token.totalSupply }}</span>
                        </v-chip>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>User balance:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <v-chip class="d-flex justify-end" style="width: 100%;"><span> {{ token.userBalance }}</span>
                        </v-chip>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col class="col-6" v-if="isErc20(token)">
                  <v-progress-circular
                      class="text-center"
                      :rotate="360"
                      :size="150"
                      :width="15"
                      :value="token.poolRatio"
                      color="teal"
                  >
                    {{ token.poolRatio }} %
                  </v-progress-circular>
                </v-col>
              </v-row>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-card>
    <v-dialog
        v-if="selectedToken !== null"
        v-model="depositDialog"
        max-width="512"
    >
      <v-card loading>
        <v-card-title class="headline">
          Deposit {{ selectedToken.symbol }} to the pool ?
        </v-card-title>

        <v-card-text>
          <v-text-field label="Amount" v-model="depositAmount"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
              text
              @click="cancelDeposit"
          >
            Cancel
          </v-btn>
          <v-btn
              color="primary darken-1"
              text
              @click="allow"
          >
            Approve
          </v-btn>
          <v-btn
              color="primary darken-1"
              text
              @click="deposit"
          >
            Deposit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {mapState} from "vuex";
import colors from 'vuetify/lib/util/colors'
import ERC20Manager from "@/web3/Erc20";
import Units from "ethereumjs-units";

export default {
  name: 'Pool',
  data: () => ({
    depositDialog: false,
    depositInProgress: false,
    depositAmount: 0,
    selectedToken: null,
    erc20: null,
    pool: {
      tokens: []
    }
  }),
  methods: {
    isErc20(token) {
      return token.symbol !== 'ETH' && token.symbol !== 'BNB'
    },
    performDeposit(token) {
      this.selectedToken = token
      this.depositDialog = true
    },
    cancelDeposit() {
      this.selectedToken = null
      this.depositDialog = false
    },
    deposit() {
      this.depositInProgress = true
      if (this.selectedToken.symbol !== 'ETH' && this.selectedToken.symbol !== 'BNB') {
        this.depositErc20()
      } else {
        this.depositEth()
      }
    },
    async depositEth() {
      const _amount = Units.convert(this.depositAmount, 'eth', 'wei')
      await this.swapper.depositEth(null, window.ethereum.selectedAddress, _amount, this.depositEthSuccess, this.depositEthError)
    },
    async depositEthSuccess(receipt) {
      console.log('deposit eth completed: ', receipt)
      this.depositInProgress = false
      this.depositDialog = false
      await this.initData()
    },
    depositEthError(error) {
      console.error(error)
      this.depositInProgress = false
    },
    async allow() {
      const _amount = Units.convert(this.depositAmount, 'eth', 'wei')
      await this.swapper.approve(null, window.ethereum.selectedAddress, this.selectedToken.address, _amount, console.log, console.err)
    },
    async depositErc20() {
      const _amount = Units.convert(this.depositAmount, 'eth', 'wei')
      await this.swapper.depositErc20(null, window.ethereum.selectedAddress, this.selectedToken.address, _amount, this.depositErc20Success, this.depositErc20Error)
    },
    depositErc20Success(receipt) {
      console.log('deposit erc20 completed: ', receipt)
      this.depositInProgress = false
      this.depositDialog = false
    },
    depositErc20Error(error) {
      console.error(error)
      this.depositInProgress = false
    },
    imgSrcForSymbol(symbol) {
      return `/img/tokens/${symbol}.png`
    },
    async fetchTokenInformation(token) {
      const contract = this.erc20.newContract(token.address)
      const poolBalance = await contract.methods.balanceOf(this.swapper.address).call()
      const totalSupply = await contract.methods.totalSupply().call()
      const poolRatio = (poolBalance / totalSupply) * 100
      const userBalance = await contract.methods.balanceOf(window.ethereum.selectedAddress).call()
      return {
        poolBalance,
        totalSupply,
        userBalance,
        poolRatio,
      }
    },
    async initData() {
      this.erc20 = new ERC20Manager(this.web3)
      this.pool.tokens = []
      for (const token of this.tokens) {
        if (token.symbol !== 'ETH' && token.symbol !== 'BNB') {
          const tokenInfo = await this.fetchTokenInformation(token)
          token.poolBalance = Units.convert(tokenInfo.poolBalance, 'wei', 'eth')
          token.totalSupply = Units.convert(tokenInfo.totalSupply, 'wei', 'eth')
          token.userBalance = Units.convert(tokenInfo.userBalance, 'wei', 'eth')
          token.poolRatio = tokenInfo.poolRatio.toFixed(2)
          this.pool.tokens.push(token)
        } else {
          token.poolBalance = Units.convert(await this.web3.eth.getBalance(this.swapper.address), 'wei', 'eth')
          token.userBalance = Units.convert(await this.web3.eth.getBalance(window.ethereum.selectedAddress), 'wei', 'eth')
          token.totalSupply = 'N/A'
          this.pool.tokens.push(token)
        }
      }
    }
  },
  async mounted() {
    await this.initData()
  },
  computed: {
    mainCardColor() {
      return colors.grey.darken4
    },
    ...mapState(["web3", "tokens", "swapper"])
  },
}
</script>
