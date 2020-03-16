<template>
  <div>
    <el-row :gutter="20" type="flex">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>Account Info</span>
          </div>
          <p v-if="user.username">
            Username: <b>{{ user.username }}</b>
          </p>
          <p>
            Address: <b>{{ user.address }}</b>
          </p>
          <p>
            Balance: <b>{{ user.balance / 1e8 }} GNY</b>
          </p>
          <p>
            Is Locked: <b>{{ user.lockHeight === '0' ? 'No' : 'Yes' }}</b>
          </p>
          <p v-if="user.lockHeight !== '0'">
            Lock Height: <b>{{ user.lockHeight }}</b>
          </p>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="!user.username">
          <div slot="header">
            <span>Set Username</span>
          </div>

          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="Username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="setUsername"
                >Set Username</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="user.lockHeight === '0'">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            Lock your account
          </div>

          <el-form :ref="lockAccountForm" label-width="80px">
            <el-form-item label="height">
              <el-input v-model="lockAccountForm.lockHeight"></el-input>
            </el-form-item>
            <el-form-item label="amount">
              <el-input v-model="lockAccountForm.lockAmount"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="lockAccount">Lock Account</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <TransactionsPaged></TransactionsPaged>
      </el-col>
    </el-row>
  </div>
</template>

<script scoped>
import { mapState } from 'vuex';
import { Notification } from 'element-ui';
import TransactionsPaged from './TransactionsPaged';

import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  process.env.VUE_APP_GNY_PORT,
  process.env.VUE_APP_GNY_NETWORK,
);

export default {
  components: {
    TransactionsPaged,
  },
  computed: {
    ...mapState(['user', 'passphrase']),
  },
  methods: {
    async setUsername() {
      try {
        const trs = client.basic.setUserName(
          this.form.username,
          this.passphrase,
        );
        const result = await connection.api.Transport.sendTransaction(trs);
        Notification({
          title: 'Success',
          message: result.transactionId,
        });
      } catch (err) {
        console.log(err);
      }
    },
    async lockAccount() {
      try {
        const height = this.lockAccountForm.lockHeight;
        const amount = this.lockAccountForm.lockAmount * 1e8;
        console.log(`height: ${height}, amount: ${amount}`);
        const trs = await client.basic.lock(height, amount, this.passphrase);
        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  data() {
    return {
      placeholder: '',
      form: {
        username: '',
      },
      lockAccountForm: {
        lockHeight: '0',
        lockAmount: '0',
      },
    };
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getTransactions');
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

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
