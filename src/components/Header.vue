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

export default {
  data() {
    return {
      blockHeight: null
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push('/login');
    }
  },
  computed: {
    ...mapState(['user', 'latestBlock'])
  },
  async mounted() {
    try {
      // console.log('user', this.user);
      // console.log('block', this.latestBlock.height);
      setInterval(async () => {
        await this.$store.dispatch('refreshAccounts');
        this.blockHeight = this.latestBlock.height;
        // console.log(this.$store.state);
      }, 10000);
      // this.blockHeight = (await connection.api.Block.getHeight()).height;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style scoped>
.head-wrap {
}
</style>
