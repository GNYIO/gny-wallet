<template>
  <div>
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <span>Account Info</span>
      </div>
      <p v-if="user.username">{{ user.username }}</p>
      <p>Address: {{ user.address }}</p>
      <p>Balance: {{ user.balance / 1e8 }} GNY</p>
      <!--<p>Public key: {{ user.publicKey }}</p>-->
    </el-card>
    <el-card class="box-card2">
      <div slot="header" class="clearfix">
        <span>Transaction History</span>
      </div>
      <el-table :data="transactions" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="type" label="Type" width="80"></el-table-column>
        <el-table-column prop="args" label="Args"></el-table-column>
        <el-table-column
          prop="height"
          label="height"
          width="80"
        ></el-table-column>
        <el-table-column prop="message" label="Message"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script scoped>
import * as gnyClient from '@gny/client';
const connection = new gnyClient.Connection('45.76.215.117', 4096, 'testnet');

export default {
  data() {
    return {
      user: {},
      transactions: [],
      placeholder: '',
    };
  },
  async mounted() {
    this.user = this.$store.state.user;
    this.transactions = (
      await connection.api.Transaction.getTransactions({
        senderId: this.user.address,
      })
    ).transactions;
    console.log(this.transactions);
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 18px;
}

.box-card1 {
  margin: 18px 18px;
  padding: 18px 18px;
  width: 480px;
  float: left;
}

.box-card2 {
  margin: 18px 18px;
  padding: 18px 18px;
  width: 100%;
  float: left;
}
</style>
