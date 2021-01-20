<template>
  <el-main>
    <p>GNY Address</p>
    <el-input v-model="gnyAddress" :disabled="true"></el-input>
    <br />
    <p>Ethereum Address</p>
    <el-input v-model="ethAddress" placeholder="ethereum address" :disabled="true"></el-input>
    <br />
    <br />
    <br />

    <el-button type="primary" @click="connect">Connect to metamask </el-button>

    <br />
    <br />
    <br />

    <el-button type="primary" @click="bind">Bind</el-button>
  </el-main>
</template>

<script>
import Web3 from 'web3';
import FundABI from '../assets/fund-abi';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
  },
  data() {
    return {
      gnyAddress: '',
      ethAddress: '',
      from: '',
    }
  },
  methods: {
    async connect() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        // window.ethereum.disable();
        const accounts = await window.web3.eth.getAccounts();

        this.ethAddress = accounts[0];
        return true;
      }
      return false;
    },
    async bind() {
      const web3 = new Web3(window.web3.currentProvider);

      const CONTRACT_ADDRESS = "0x2F26dAFbA58E9700cF3E8D4048ba16c55ba24cB9";
      const contract = new web3.eth.Contract(FundABI, CONTRACT_ADDRESS);
      console.log(contract);
      const res = await contract.methods.bind(this.gnyAddress).send({from: this.ethAddress});
      return res;
    }
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    this.gnyAddress = this.$store.state.user.address;
  },
};
</script>
