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
        <span>Account Info</span>
      </div>
      <p>Connect BSC wallet: <strong>{{ ethAddress }}</strong></p>
      <p>Allowance to GNY Swapgate contract: <strong>{{ allowance | prettyPrintBSCValue }} GNY</strong> </p>
      <p>MetaMask GNY BEP20 balance: <strong>{{ metaMaskBalance | prettyPrintBSCValue }} BEP20 GNY</strong> </p>
      <br />

      <el-form :model="depositForm" ref="depositForm" :rules="rules" label-width="80px">
        <el-form-item label="Amount" prop="amount">
          <el-input prop v-model="depositForm.amount"></el-input>
        </el-form-item>

        <!--show only if -->
        <el-form-item>
          <el-button v-if="!allowanceEnough" type="warning" plain @click="submitAllowance" style="float: left;">First set allowance for contract</el-button>
        </el-form-item>

        <el-form-item>
          <el-button v-if="allowanceEnough" type="success" @click="deposit" style="float: left;">Deposit GNY BEP20 to Mainnet</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </el-col>
</template>


<script>
import { mapGetters } from 'vuex';
import { BigNumber } from 'bignumber.js';
import Swapgate from '../assets/swapgate_abi';
import IERC20 from '../assets/ierc20_abi';
import Web3 from 'web3';
import { prettyPrintBSCValueFilter } from '../filters/index';

const BSC_SWAPGATE_ADDRESS = process.env.VUE_APP_BSC_SWAPGATE_ADDRESS;
const BSC_ERC20_ADDRESS = process.env.VUE_APP_BSC_ERC20_ADDRESS;


export default {
  filters: {
    prettyPrintBSCValue: prettyPrintBSCValueFilter,
  },
  computed: {
    ...mapGetters(['user']),
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
      if (currentInput.isLessThan(this.metaMaskBalance)) {
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
      isConnected: false,
      allowance: 0,
      metaMaskBalance: 0,

      ethAddress: '',

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
    connect: async function () {
      if (!window.ethereum) {
        this.$message({
          message: 'could not find MetaMask',
          type: 'error',
          duration: 7 * 1000,
        });
        return;
      }

      const web3 = new Web3(window.ethereum);
      console.log(web3);
      this.web3 = web3;


      const chainId = await web3.eth.getChainId();

      // either BSC (56) in productio
      // or hardhat (31337) in development
      const check =
        (
          process.env.NODE_ENV === 'production' &&
          chainId === 56
        )
        ||
        (
          process.env.NODE_ENV === 'development' &&
          chainId === 31337
        );

      if (!check) {
        this.$message({
          message: 'You need to use the BSC Chain in MetaMask!',
          type: 'error',
          duration: 10 * 1000,
        });
        return;
      }


      console.log(`chainId: ${chainId}`);

      console.log('before');
      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      console.log('before2');

      const accounts = await web3.eth.getAccounts();
      console.log(`first account: ${accounts[0]}`);
      this.ethAddress = accounts[0];


      // new
      console.log(`BSC_ERC20_ADDRESS: ${BSC_ERC20_ADDRESS}`);
      const gnyBEP20Contract = new web3.eth.Contract(IERC20, BSC_ERC20_ADDRESS);
      const currentAllowance = await gnyBEP20Contract.methods.allowance(
        this.ethAddress,
        BSC_SWAPGATE_ADDRESS
      ).call();
      console.log(`currentAllowance: ${currentAllowance}`);


      const metaMaskBalance = await gnyBEP20Contract.methods.balanceOf(
        this.ethAddress
      ).call();
      console.log(`metaMaskBalance: ${metaMaskBalance}`);


      this.allowance = currentAllowance;
      this.isConnected = true;

      this.metaMaskBalance = metaMaskBalance;
    },

    submitAllowance: async function () {
      // todo: show modal to explain why this needed

      // todo: show if allowance currently really smaller
      // if already bigger, stop and show success message

      // is the allowance as high as as the?
      const amount = this.depositForm.amount;
      console.log(`amount to approve: ${amount}`)

      // todo: show modal
      const web3 = this.web3;
      const gnyContract = new web3.eth.Contract(IERC20, BSC_ERC20_ADDRESS);
      const amount18 = new BigNumber(amount).multipliedBy(1e18).toFixed();

      try {
        // approve amount
        await gnyContract.methods
          .approve(BSC_SWAPGATE_ADDRESS, amount18)
          .send({ from: this.ethAddress });

        this.$message({
          message: 'Please wait for the transaction to confirm. Then press "refresh" to reload the data!',
          type: 'success',
          duration: 15 * 1000,
        });
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
          duration: 10 * 1000,
        });
        console.log('error occured when trying to set allowance');
        console.log(err)
      }
    },

    deposit: async function () {
      // todo: first check again if balance is higher than "amount"
      // todo: then check if allowance is really higher

      // todo: show modal to explain user and user needs to agree

      // todo: has account enough GNY BEP20 to deposit?

      const web3 = this.web3;
      const swapgateContract = new web3.eth.Contract(
        Swapgate,
        BSC_SWAPGATE_ADDRESS
      );

      const amountInBSC = new BigNumber(this.depositForm.amount)
        .multipliedBy(1e18)
        .toFixed();
      console.log(`amountInBSC: ${amountInBSC}`);

      // todo: use GNY address from form
      const myAddress = this.user.address;
      console.log(`myAddress: ${myAddress}`);

      try {
        const res = await swapgateContract.methods
          .deposit(amountInBSC, myAddress)
          .send({ from: this.ethAddress });

        console.log(`res: ${res}`);
      } catch (err) {
        this.$message({
          message: err.message,
          type: 'error',
          duration: 10 * 1000,
        });
        console.log("error occured when depositing into Swapgate contract");
        console.error(err);
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    // this.gnyAddress = this.$store.state.user.address;
  },
};

</script>
