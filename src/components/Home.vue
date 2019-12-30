<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Account Info</span>
      </div>
      <p v-if="user.username">{{ user.username }}</p>
      <p>Address: {{ user.address }}</p>
      <p>Balance: {{ user.balance }}</p>
      <!--<p>Public key: {{ user.publicKey }}</p>-->
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Transaction History</span>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      user: {}
    };
  },
  mounted() {
    this.user = this.$store.state.user;
    console.log(this.$store.state.user);
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 18px;
}

.box-card {
  margin: 18px 18px;
  padding: 18px 18px;
  width: 480px;
  float: left;
}
</style>
