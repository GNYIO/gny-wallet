<template>
  <div>
    <el-card class="box-card1">
      <div slot="header">
        <span>Account Info</span>
      </div>
      <p v-if="user.username">Username: {{ user.username }}</p>
      <p>Address: {{ user.address }}</p>
      <p>Balance: {{ user.balance / 1e8 }} GNY</p>
      <!--<p>Public key: {{ user.publicKey }}</p>-->
    </el-card>
    <el-card class="box-card1" v-if="!user.username">
      <div slot="header" class="clearfix">
        <span>Set Username</span>
      </div>

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="Username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="setUsername">Set Username</el-button>
        </el-form-item>
      </el-form>
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
import { mapState } from 'vuex';

import * as client from '@gny/client';
const connection = new client.Connection(process.env['GNY_ENDPOINT'], process.env['GNY_PORT'], process.env['GNY_NETWORK']);

export default {
  computed: {
    ...mapState(['user', 'passphrase']),
  },
  methods: {
    async setUsername() {
      try {
        console.log(this.form.username);
        console.log(this.passphrase);

        const trs = client.basic.setUserName(this.form.username, this.passphrase);
        await connection.api.Transport.sendTransaction(trs);

      } catch (err) {
        console.log(err);
      }
    }
  },
  data() {
    return {
      transactions: [],
      placeholder: '',
      form: {
        username: ''
      }
    };
  },
  async mounted() {
    const address = this.user.address;

    this.transactions = (
      await connection.api.Transaction.getTransactions({
        senderId:address
      })
    ).transactions;
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
