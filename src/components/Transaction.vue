<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="From">
        <el-input v-model="form.from"></el-input>
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
        <el-button type="primary" @click="onSubmit">Send</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { Connection } from '@gny/client';
// const connection = new Connection('192.168.1.252', 4096, 'testnet');

export default {
  data() {
    return {
      balance: 0,
      amountPlaceholder: '',
      form: {
        from: '',
        to: '',
        amount: '',
        memo: ''
      }
    };
  },
  computed: {
    ...mapState(['user', 'passphrase'])
  },
  methods: {
    async onSubmit() {
      // const response = await connection.api.Transfer.post

      console.log('submit!');
      console.log(this.user);
    }
  },
  mounted() {
    this.form.from = this.$store.state.user.address;
    this.balance = this.$store.state.user.balance;
    this.amountPlaceholder = `You have ${this.balance} GNY in your account`;
  }
};
</script>

<style></style>
