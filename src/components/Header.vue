<template>
  <el-row>
    <el-col :span="4">
      <div class="head-wrap">GNY Wallet</div>
    </el-col>
    <el-col :span="18">
      <span>Latest Block Height: {{ blockHeight }}</span>
    </el-col>
    <el-col :span="2">
      <el-button @click="logout" type="info">Logout</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import * as Cookie from 'tiny-cookie';

export default {
  data() {
    return {
      blockHeight: null,
    };
  },
  methods: {
    logout() {
      Cookie.remove('bip39');

      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push('/login');
    },
  },
  computed: {
    ...mapState(['user', 'latestBlock']),
  },
  async mounted() {
    try {
      await this.$store.dispatch('refreshAccounts');
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
