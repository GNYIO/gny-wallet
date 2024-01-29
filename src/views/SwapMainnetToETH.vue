<template>
  <el-col :span="12">

    <el-card v-if="!isConnected">
      <div slot="header">
        <span>MetaMask Information</span>
      </div>

      <h3>You are not connected to MetaMask!</h3>
      <el-button type="primary" @click="connect">Connect to metamask
      </el-button>
    </el-card>

    <el-card v-if="isConnected">
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


    <el-card v-if="isConnected">
      <div slot="header">
        <span>ETH Account</span>
      </div>

      <p>Currently connected to ETH wallet: <strong>{{ ethAddress }}</strong></p>
      <p>MetaMask GNY ERC20 balance: <strong>{{ metaMaskBalance | prettPrintETHValue }} ERC20 GNY</strong> </p>
      <br />
    </el-card>

    <br />


    <el-card v-if="isConnected">
      <div slot="header">
        <span>Swap from Mainnet to ETH</span>
      </div>

      <el-form :model="form" ref="form" :rules="rules" label-width="130px">
        <el-form-item label="Amount" prop="amount" required>
          <el-input type="text" v-model="form.amount" :placeholder="amountPlaceholder"></el-input>
        </el-form-item>

        <el-form-item>
          <div style="float: left">
            <el-badge value="0.1 GNY" type="info">
              <el-button type="primary" @click="sendSwap">Swap</el-button>
            </el-badge>
          </div>

          <el-button @click="resetForm" style="float: left; margin-left: 10px;">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </el-col>
</template>

<script>
import { showErrorPopup } from '../helpers/errorDisplay';
import { mapState, mapGetters } from 'vuex';
import * as client from '@gny/client';
import { BigNumber } from 'bignumber.js';
import { prettPrintETHValueFilter } from '../filters/index';


const mainnetToBSCReceiver = process.env.VUE_APP_SWAP_MAINNET_TO_BSC;

const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  filters: {
    prettPrintETHValue: prettPrintETHValueFilter,
  },
  data() {
    const validateGNYAmount = (rule, value, callback) => {
      if (new BigNumber(value).isNaN()) {
        callback('is not a number');
      }

      const currentInput = new BigNumber(value).times(1e8);

      console.log(`userBalance: ${this.user.balance}`);

      if (currentInput.isLessThanOrEqualTo(this.user.balance)) {
        callback();
      } else {
        const pretty = new BigNumber(this.user.balance)
          .dividedBy(1e8)
          .toFormat(0);
        callback(
          new Error(
            `amount too big, you only have "${pretty}" available`,
          ),
        );
      }
    };

    return {
      isConnected: false,

      balance: 0,
      amountPlaceholder: '',
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
    ...mapGetters(['user', 'positiveBalance']),
  },
  methods: {
    async connect() {
      this.isConnected = !this.isConnected;

      this.ethAddress = '0xhello';
      this.metaMaskBalance = 1000;

    },
    async sendSwap() {
      try {
        await this.$refs['form'].validate();
      } catch (err) {
        console.log(`err: ${err}`);
        return; // remove TODOO
      }

      console.log(`swap to: ${this.form}`);

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


      try {
        // if we press "OK" it returns normally
        // if we press "Cancel" or "X" (close) a error is thrown
        const am = this.form.amount;
        console.log(`amount: ${am}`);
        await this.$confirm(
          `Are you sure that you want to swap "${am}" GNY from mainnet to ETH?`,
          'Warning',
          {
            confirmButtonText: 'Swap',
            cancelButtonText: 'Cancel',
            type: 'warning',
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

