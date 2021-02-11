<template>
  <v-container>
    <v-card
        class="mx-auto"
        max-width="512"
        elevation="2"
        outlined
        :loading="loading"
    >
      <v-card-title>Admin</v-card-title>
      <v-row class="mx-2 my-2">
        <v-col class="col-12">
          <v-btn block @click="deploySwap" color="primary">
            Setup Swap Contract
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'Admin',
  data: () => ({
    loading: false,
    factoryContractAddress: null,
    setupInfo: null,
    ethPrice: null,
  }),
  methods: {
    deploySwap() {
      this.loading = true
      this.admin.setup(this.deployReceiptCallback, this.deployError)
    },
    async deployReceiptCallback(receipt) {
      console.log("contract deployed at: ", receipt.contractAddress)
      this.factoryContractAddress = receipt.contractAddress
      this.setupInfo = await this.admin.getInformation(receipt.contractAddress)
      console.log(JSON.stringify(this.setupInfo))
      this.loading = false
    },
    async deployError(err) {
      console.log("error occurred while deploying: ", err);
      this.loading = false
    },
  },
  async mounted() {

  },
  computed: {
    ...mapState(["web3", "admin"])
  },
}
</script>
