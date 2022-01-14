<template>
  <el-main>
    <p>GNY Address</p>
    <el-input v-model="gnyAddress" :disabled="true"></el-input>
    <br />
    <p>Ethereum Address</p>
    <el-input
      v-model="ethAddress"
      placeholder="ethereum address"
      :disabled="true"
    ></el-input>
    <br />
    <br />
    <br />

    <el-button type="primary" @click="connect"
      >1. Connect to metamask
    </el-button>

    <br />
    <br />
    <br />

    <el-button type="primary" @click="bind">2. Bind</el-button>

    <br />
    <br />
    <br />

    <el-button type="primary" @click="approve">3. Approve</el-button>

    <br />
    <br />
    <br />

    <el-input v-model="amount"></el-input>

    <br />
    <br />

    <el-button type="primary" @click="deposit">4. Deposit</el-button>
  </el-main>
</template>

<script>
import Web3 from 'web3';
import Swapgate from '../assets/swapgate_abi';
import IERC20 from '../assets/ierc20_abi';
import { mapState } from 'vuex';
import { BigNumber } from 'bignumber.js';

// mainnet
const SWAPGATE_ADDRESS = '0xc514B6f44b93Fc6f42F6c800937dA0eeB394C393';
const TOKEN_ADDRESS = '0xe4A4Ad6E0B773f47D28f548742a23eFD73798332';

export default {
  computed: {
    ...mapState(['user']),
  },
  data() {
    return {
      gnyAddress: '',
      ethAddress: '',
      amount: '',
    };
  },
  methods: {
    async connect() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        // window.ethereum.disable();
        const accounts = await window.web3.eth.getAccounts();

        this.ethAddress = accounts[0];
        await this.isAllowed();
        return true;
      }
      return false;
    },
    async bind() {
      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(Swapgate, SWAPGATE_ADDRESS);
      const res = await contract.methods
        .bind(this.gnyAddress)
        .send({ from: this.ethAddress });
      return res;
    },
    async isAllowed() {
      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(IERC20, TOKEN_ADDRESS);
      const res = await contract.methods
        .allowance(this.ethAddress, SWAPGATE_ADDRESS)
        .call();
      return res === 0 ? false : true;
    },
    async approve() {
      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(IERC20, TOKEN_ADDRESS);
      const res = await contract.methods
        .approve(SWAPGATE_ADDRESS, new BigNumber(1e27).toFixed())
        .send({ from: this.ethAddress });
      console.log(res);
      return res;
    },
    async deposit() {
      const web3 = new Web3(window.web3.currentProvider);
      const contract = new web3.eth.Contract(Swapgate, SWAPGATE_ADDRESS);
      if (this.amount <= 0) return false;
      let balance = new BigNumber(this.amount).multipliedBy(1e18).toFixed();
      const res = await contract.methods
        .deposit(balance)
        .send({ from: this.ethAddress });
      return res;
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    this.gnyAddress = this.$store.state.user.address;
  },
};
</script>
