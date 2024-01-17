<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card v-if="!isConnected">
          <h3>You are not connected to MetaMask!</h3>
          <el-button type="primary" @click="connect"
            >Connect to metamask
          </el-button>
        </el-card>

        <el-card v-if="isConnected">
          <p>Allowance to GNY Swapgate contract: <strong>{{ allowance | prettyPrintBSCValue }} GNY</strong> </p>
          <p>MetaMask GNY BEP20 balance: <strong>{{ metaMaskBalance | prettyPrintBSCValue }} BEP20 GNY</strong> </p>
          <el-form :model="depositForm" ref="depositForm" label-width="80px">
            <el-form-item label="Amount" prop="amount">
              <el-input prop v-model="depositForm.amount"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                  type="primary"
                  @click="deposit"
                  style="float: left;"
              >Deposit GNY BEP20 to Mainnet</el-button>
            </el-form-item>
          </el-form>
        </el-card>

      </el-col>
    </el-row>
  </div>
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
  },
  data() {
    return {
      web3: {},
      isConnected: false,
      allowance: 0,
      metaMaskBalance: 0,

      ethAddress: '',

      depositForm: {
        amount: 0,
      },
    };
  },
  methods: {
    connect: async function() {
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
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        BSC_SWAPGATE_ADDRESS
      ).call();
      console.log(`currentAllowance: ${currentAllowance}`);


      const metaMaskBalance = await gnyBEP20Contract.methods.balanceOf(
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      ).call();
      console.log(`metaMaskBalance: ${metaMaskBalance}`);


      this.allowance = currentAllowance;
      this.isConnected = true;

      this.metaMaskBalance = metaMaskBalance;
    },

    deposit: async function() {
      // todo: validate the form
      // does this address even have GNY BEP20 ?
      //

      const web3 = this.web3;
      const contract = new web3.eth.Contract(
        Swapgate,
        BSC_SWAPGATE_ADDRESS
      );

      // is the allowance as high as as the
      const amount = this.depositForm.amount;
      const allowance = this.allowance;

      if (Number(amount) > Number(allowance)) {
        // todo: show modal
        const gnyContract = new web3.eth.Contract(IERC20, BSC_ERC20_ADDRESS);
        const amount18 = new BigNumber(amount).multipliedBy(1e18).toFixed();

        // approve amount
        await gnyContract.methods
          .approve(BSC_SWAPGATE_ADDRESS, amount18)
          .send({ from: this.ethAddress });

      }

      // show modal to get confirmation from user



      const amountInBSC = new BigNumber(amount)
        .multipliedBy(1e18)
        .toFixed();
      console.log(`amountInBSC: ${amountInBSC}`);

      // todo
      const myAddress = this.user.address;
      console.log(`myAddress: ${myAddress}`);

      const res = await contract.methods
        .deposit(amountInBSC, myAddress)
        .send({ from: this.ethAddress });

      console.log(`res: ${res}`);
    }
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    // this.gnyAddress = this.$store.state.user.address;
  },
};

</script>
