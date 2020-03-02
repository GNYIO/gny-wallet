<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="From">
        <el-input v-model="form.from" :disabled="true"></el-input>
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

      <el-form-item label="Message">
        <el-input v-model="form.message"></el-input>
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
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env['GNY_ENDPOINT'],
  process.env['GNY_PORT'],
  process.env['GNY_NETWORK'],
);

export default {
  data() {
    return {
      balance: 0,
      amountPlaceholder: '',
      form: {
        from: '',
        to: '',
        amount: '',
        message: '',
      },
    };
  },
  computed: {
    ...mapState(['user', 'passphrase']),
  },
  methods: {
    async sendTransaction() {
      try {
        const trs = client.basic.transfer(
          this.form.to,
          this.form.amount * 1e8,
          this.form.message,
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
