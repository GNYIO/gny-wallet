<template>
  <el-row>
    <el-col :span="22">
      <div class="head-wrap">GNY Wallet</div>
    </el-col>
    <el-col :span="2">
      <el-button @click="logout" type="info">Logout</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.head-wrap {
}
</style>
