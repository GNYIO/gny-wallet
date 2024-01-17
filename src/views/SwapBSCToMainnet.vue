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
          <p>Allowance to GNY Swapgate contract: <strong>{{ allowance }} GNY</strong> </p>
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
import { showErrorPopup } from '../helpers/errorDisplay';
import { BigNumber } from 'bignumber.js';
import Swapgate from '../assets/swapgate_abi';
import IERC20 from '../assets/ierc20_abi';
import Web3 from 'web3';

const BSC_SWAPGATE_ADDRESS = process.env.VUE_APP_BSC_SWAPGATE_ADDRESS;
const BSC_ERC20_ADDRESS = process.env.VUE_APP_BSC_ERC20_ADDRESS;

export default {
  computed: {
    ...mapGetters(['user']),
  },
  data() {
    return {
      web3: {},
      isConnected: false,
      allowance: 0,

      ethAddress: '',

      depositForm: {
        amount: 0,
      },
    };
  },
  methods: {
    connect: async function() {
      if (!window.ethereum) {
        const couldNotFindMetaMask = new Error('could not find MetaMask');
        showErrorPopup.apply(this, [couldNotFindMetaMask]);
        return;
      }

      const web3 = new Web3(window.ethereum);
      console.log(web3);
      this.web3 = web3;

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      console.log(window.ethereum);

      const accounts = await web3.eth.getAccounts();
      console.log(`first account: ${accounts[0]}`);
      this.ethAddress = accounts[0];


      console.log(BSC_SWAPGATE_ADDRESS);
      console.log(BSC_ERC20_ADDRESS);


      // new
      console.log(`BSC_SWAPGATE_ADDRESS: ${BSC_SWAPGATE_ADDRESS}`);
      const contract = new web3.eth.Contract(IERC20, BSC_ERC20_ADDRESS);
      const currentAllowance = await contract.methods.allowance(
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        BSC_SWAPGATE_ADDRESS
      ).call();

      console.log(currentAllowance);

      this.allowance = currentAllowance;
      this.isConnected = true;
    },
    deposit: async function() {
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
