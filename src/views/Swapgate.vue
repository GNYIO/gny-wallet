<template>
  <el-main>
    <p>GNY Address</p>
    <el-input v-model="from" placeholder='ggggf'></el-input>
    <br />
    <p>Ethereum Address</p>
    <el-input v-model="ethAddress" placeholder="ethereum address"></el-input>
    <br />
    <br />
    <br />

    <el-button type="primary" @click="connect">Bind</el-button>

    <br />
    <br />
    <br />

    <el-button type="primary" @click="connect">Connect</el-button>
  </el-main>
</template>

<script>
import Web3 from 'web3';
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
        console.log('tt', this.ethAddress);
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    this.from = this.$store.state.user.address;
  },
};
</script>
