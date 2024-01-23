<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card v-if="!positiveBalance">
          <h3>You have currently no GNY to swap</h3>
        </el-card>

        <el-card v-if="positiveBalance">
          Unlocked Balance: <b>{{ user.balancePretty }} GNY</b>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <el-card v-if="positiveBalance">
          <div slot="header">
            Swap Mainnet GNY to BSC
          </div>
          <el-form :model="form" ref="form" label-width="130px">
            <el-form-item label="ETH Address" prop="ethAddress" required>
              <el-tooltip
                effect="light"
                content="BSC Address e.g.: 0x123456789abcdef..."
                placement="top-start"
              >
                <el-input v-model="form.ethAddress"></el-input>
              </el-tooltip>

              <el-button
                @click="connectToMetaMask"
                style="float: right; margin-left: 10px;">
              </el-button>

            </el-form-item>

            <el-form-item label="Amount" prop="amount" required>
              <el-tooltip
                effect="light"
                :content="amountPlaceholder"
                placement="top-start"
              >
                <el-input
                  type="text"
                  v-model="form.amount"
                  :placeholder="amountPlaceholder"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <div style="float: left">
                <el-badge
                  value="0.1 GNY"
                  type="info"
                >
                  <el-button type="primary" @click="sendSwap"
                    >Swap</el-button
                  >
                </el-badge>
              </div>

              <el-button
                @click="resetForm"
                style="float: left; margin-left: 10px;"
                >Cancel</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { showErrorPopup } from '../helpers/errorDisplay';
import { mapState, mapGetters } from 'vuex';
import * as client from '@gny/client';
import { BigNumber } from 'bignumber.js';


const mainnetToBSCReceiver = process.env.VUE_APP_SWAP_MAINNET_TO_BSC;

const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  data() {
    return {
      balance: 0,
      amountPlaceholder: '',
      form: {
        to: '',
        amount: '',
      },
    };
  },
  computed: {
    ...mapState(['passphrase', 'secondPassphrase']),
    ...mapGetters(['user', 'positiveBalance']),
  },
  methods: {
    async sendSwap() {
      try {
        await this.$refs['form'].validate();
      } catch (err) {
        console.log(`err: ${err}`);
        return; // remove TODOO
      }

      console.log(`swap to: ${this.form.ethAddress}`);

      // try {
      //   const result = await connection.contract.Basic.send(
      //     mainnetToBSCReceiver,
      //     new BigNumber(this.form.amount).multipliedBy(1e8).toFixed(),
      //     this.passphrase,
      //     this.form.ethAddress,
      //     this.secondPassphrase,
      //   );
      //   this.$message(result.transactionId);
      //   this.$refs['form'].resetFields();
      // } catch (err) {
      //   showErrorPopup.apply(this, [err]);
      // }

      console.log(connection);
      console.log(BigNumber);
      console.log(mainnetToBSCReceiver);
      console.log(showErrorPopup);

    },
    async resetForm() {

    },

    async connectToMetaMask() {

    },
  },

};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>

