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

        <br v-if="user.lockHeight !== '0'"/>


        <p v-if="user.lockHeight !== '0'">
          Locked Balance: <b>{{ user.lockAmountPretty }} GNY</b>
        </p>
        <p v-if="user.lockHeight !== '0'">
          Available to unlock at Block Height: <b>{{ user.lockHeight }}</b>
        </p>
        <p v-if="user.lockHeight !== '0'">
          Unlocked Balance: <b>{{ user.balancePretty }} GNY</b>
        </p>

        <br v-if="user.lockHeight !== '0'"/>

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
      <p>Allowance granted: <strong>{{ allowance | prettPrintETHValue }} GNY</strong> </p>
      <p>MetaMask GNY BEP20 balance: <strong>{{ metaMaskBalance | prettPrintETHValue }} BEP20 GNY</strong> </p>
      <br />
    </el-card>

    <br />

    <el-card v-if="connectedToMetaMask">
      <div slot="header">
        <span>Swap from BSC to Mainnet</span>
      </div>


      <el-form :model="depositForm" ref="depositForm" :rules="rules" label-width="80px">
        <el-form-item label="Amount" prop="amount">
          <el-input prop v-model="depositForm.amount"></el-input>
        </el-form-item>

        <!--show only if -->
        <el-form-item>
          <el-button v-if="!allowanceEnough" type="warning" plain @click="submitAllowance" style="float: left;">First set allowance for contract</el-button>

          <el-button v-if="allowanceEnough" type="success" @click="deposit" style="float: left;">Deposit GNY BEP20 to Mainnet</el-button>

          <el-button @click="getInfo" style="float: left;">Refresh</el-button>
        </el-form-item>


      </el-form>
    </el-card>

  </el-col>
</template>


<script>
import { mapGetters } from 'vuex';
import { BigNumber } from 'bignumber.js';
import { prettPrintETHValueFilter } from '../filters/index';


export default {
  filters: {
    prettPrintETHValue: prettPrintETHValueFilter,
  },
  computed: {
    ...mapGetters([
      'user',
      'ethAddress',
      'allowance',
      'metaMaskBalance',
      'connectedToMetaMask',
    ]),
    allowanceEnough: function() {
      const amount = new BigNumber(this.depositForm.amount).multipliedBy(1e18);
      return new BigNumber(this.allowance).isGreaterThanOrEqualTo(amount);
    },
  },
  data() {
    const validateMetaMaskAmount = (rule, value, callback) => {
      if (new BigNumber(value).isNaN()) {
        callback('is not a number');
      }

      const currentInput = new BigNumber(value).times(1e18);
      if (currentInput.isLessThanOrEqualTo(this.metaMaskBalance)) {
        callback();
      } else {
        const pretty = new BigNumber(this.metaMaskBalance)
          .dividedBy(1e18)
          .toFormat(0);
        callback(
          new Error(
            `amount too big, you only have "${pretty}" available`,
          ),
        );
      }
    };

    return {
      web3: {},

      depositForm: {
        amount: 0,
      },

      rules: {
        amount: [
          {
            validator: validateMetaMaskAmount,
            trigger: 'change'
          }
        ],
      }

    };
  },
  methods: {

    getInfo: async function () {
      console.log(`[SwapETHToMainnet] queryMetaMask`);
      await this.$store.dispatch('queryMetaMask');
    },

    connect: async function () {
      // sometimes users switch their accounts in MetaMask
      // this change does **NOT** get propagated to the VUE app

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

    submitAllowance: async function () {
      const amount = this.depositForm.amount;
      await this.$store.dispatch('submitAllowance', amount);
    },

    deposit: async function () {
      const amount = this.depositForm.amount;
      await this.$store.dispatch('deposit', amount);
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    // this.gnyAddress = this.$store.state.user.address;
  },
};

</script>
