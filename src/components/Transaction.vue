<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="From">
        <el-input v-model="form.from" readonly></el-input>
      </el-form-item>

      <el-form-item label="To">
        <el-input v-model="form.to"></el-input>
      </el-form-item>

      <el-form-item label="Amount">
        <el-input
          type="text"
          v-model="form.amount"
          :placeholder="amountPlaceholder"
        ></el-input>
      </el-form-item>

      <el-form-item label="Memo">
        <el-input v-model="form.memo"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="sendTransaction">Send</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as gnyClient from '@gny/client';
const connection = new gnyClient.Connection('45.76.215.117', 4096, 'testnet');

export default {
  data() {
    return {
      balance: 0,
      amountPlaceholder: '',
      form: {
        from: '',
        to: '',
        amount: '',
        memo: '',
      },
    };
  },
  computed: {
    ...mapState(['user', 'passphrase']),
  },
  methods: {
    async sendTransaction() {
      try {
        const trs = gnyClient.basic.transfer(
          this.form.to,
          this.form.amount * 1e8,
          this.form.memo,
          this.passphrase,
        );
        console.log(trs);
        const response = await connection.api.Transport.sendTransaction(trs);
        console.log(response);
        this.$message(`Transaction id: ${response.transactionId}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.form.from = this.$store.state.user.address;
    this.balance = this.$store.state.user.balance / 1e8;
    this.amountPlaceholder = `You have ${this.balance} GNY in your account`;
  },
};
</script>

<style></style>
