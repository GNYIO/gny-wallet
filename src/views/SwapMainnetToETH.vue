<template>
  <el-col :span="12">

    <el-card v-if="!connectedToMetaMask">
      <div slot="header">
        <span>MetaMask Information</span>
      </div>

      <h3>You are not connected to MetaMask!</h3>
      <el-button type="primary" @click="connect">Connect to metamask
      </el-button>
    </el-card>

    <el-card v-if="connectedToMetaMask">
      <div slot="header">
        <span>Mainnet Account</span>
      </div>

      <el-row>
        <p v-if="user.username">
          Username: <b>{{ user.username }}</b>
        </p>
        <p>
          Address: <b>{{ user.address }}</b>
        </p>

        <br v-if="user.lockHeight !== '0'" />


        <p v-if="user.lockHeight !== '0'">
          Locked Balance: <b>{{ user.lockAmountPretty }} GNY</b>
        </p>
        <p v-if="user.lockHeight !== '0'">
          Available to unlock at Block Height: <b>{{ user.lockHeight }}</b>
        </p>
        <p v-if="user.lockHeight !== '0'">
          Unlocked Balance: <b>{{ user.balancePretty }} GNY</b>
        </p>

        <br v-if="user.lockHeight !== '0'" />

        <p>
          Total Balance: <b> {{ user.totalBalancePretty }} GNY</b>
        </p>
        <p v-if="user.secondPublicKey">
          Has Second Secret:
          <b>{{ user.secondPublicKey === null ? 'No' : 'Yes' }}</b>
        </p>
        <p v-if="user.secondPublicKey">
          Second PublicKey: <b>{{ user.secondPublicKey }}</b>
        </p>
      </el-row>
    </el-card>

    <br />


    <el-card v-if="connectedToMetaMask">
      <div slot="header">
        <span>ETH Account</span>
      </div>

      <p>Currently connected to ETH wallet: <strong>{{ ethAddress }}</strong></p>
      <p>MetaMask GNY ERC20 balance: <strong>{{ metaMaskBalance | prettPrintETHValue }} ERC20 GNY</strong> </p>
      <br />
    </el-card>

    <br />


    <el-card v-if="connectedToMetaMask">
      <div slot="header">
        <span>Swap from Mainnet to ETH</span>
      </div>

      <el-form :model="form" ref="form" :rules="rules" label-width="130px">
        <el-form-item label="Amount" prop="amount" required>
          <el-input type="text" v-model="form.amount"></el-input>
        </el-form-item>

        <el-form-item>
          <div style="float: left">
            <el-badge :value="feeVisible" type="info">
              <el-button type="primary" @click="sendSwap">Swap</el-button>
            </el-badge>
          </div>

          <el-button @click="refresh" style="float: left; margin-left: 10px;">Refresh</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </el-col>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { BigNumber } from 'bignumber.js';
import { prettPrintETHValueFilter } from '../filters/index';

const fee = Number(process.env.VUE_APP_MAINNET_TO_ETH_SWAPGATE_FEE);


export default {
  filters: {
    prettPrintETHValue: prettPrintETHValueFilter,
  },
  data() {
    const validateGNYAmount = (rule, value, callback) => {
      if (new BigNumber(value).isNaN()) {
        callback('is not a number');
      }

      // add 1 GNY fee so the GUI can calculate with the 0.1 GNY transaction fee
      const feeRaw = new BigNumber(fee).plus(1).times(1e8);
      const currentInput = new BigNumber(value).times(1e8);

      console.log(`userBalance: ${this.user.balance}`);

      if (new BigNumber(this.user.balance).isLessThan(feeRaw)) {
        return callback(
          new Error(
            `you don't have enough GNY to cover the swap fee of ${fee} GNY`
          )
        );
      }

      if (currentInput.plus(feeRaw).isLessThanOrEqualTo(this.user.balance)) {
        callback();
      } else {
        const pretty = new BigNumber(this.user.balance)
          .minus(feeRaw)
          .dividedBy(1e8)
          .toFormat(0);
        callback(
          new Error(
            `amount too big, you only have "${pretty}" available to swap (fee: ${fee} GNY)`
          )
        );
      }
    };

    return {
      feeVisible: `${fee} GNY`,

      form: {
        amount: '',
      },

      rules: {
        amount: [
          {
            required: true,
            message: 'Amount is required',
            trigger: 'blur',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            message: 'Is not a number',
            trigger: 'change',
          },
          {
            validator: validateGNYAmount,
            trigger: 'change'
          },
        ],
      }
    };
  },
  computed: {
    ...mapState(['passphrase', 'secondPassphrase']),
    ...mapGetters([
      'user',
      'positiveBalance',
      'connectedToMetaMask',
      'metaMaskBalance',
      'ethAddress',
    ]),
  },
  methods: {

    async connect() {

      const setResult = await this.$store.dispatch('setWeb3');
      console.log(`set3Result: ${setResult}`);

      const actionResult = await this.$store.dispatch('connectToMetaMask');
      console.log(`actionResult: ${actionResult}`);
      if (!actionResult) {
        return;
      }

      await this.$store.dispatch('listenForMetaMaskChanges');

      await this.$store.dispatch('queryMetaMask');

    },

    async sendSwap() {
      try {
        await this.$refs['form'].validate();
      } catch (err) {
        console.log(`err: ${err}`);
        return; // remove TODOO
      }

      const amount = this.form.amount;
      try {
        // if we press "OK" it returns normally
        // if we press "Cancel" or "X" (close) a error is thrown
        console.log(`amount: ${amount}`);
        await this.$confirm(
          `Are you sure that you want to swap "${amount}" GNY from mainnet to ETH account "${this.ethAddress}"?\nYou will pay a fee of ${process.env.VUE_APP_MAINNET_TO_ETH_SWAPGATE_FEE} GNY.`,
          'Warning',
          {
            confirmButtonText: 'Swap',
            cancelButtonText: 'Cancel',
            type: 'warning',
            customClass: 'custom-message-box',
          }
        );
      } catch (err) {
        this.$refs['form'].resetFields();

        this.$message({
          message: 'Mainnet to ETH swap canceled!',
          type: 'error',
        });
        return;
      }


      await this.$store.dispatch('mainnet2Eth', amount);

      this.$refs['form'].resetFields();

    },

    async refresh() {
      console.log(`[SwapMainnetToETH] queryMetaMask`);
      await this.$store.dispatch('queryMetaMask');

      console.log(`[SwapMainnetToETH] refreshAccounts`);
      await this.$store.dispatch('refreshAccounts');
    },

  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
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

