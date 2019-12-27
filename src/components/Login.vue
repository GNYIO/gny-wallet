<template>
  <el-main class="login">
    <el-input v-model="newAccount"></el-input>
    <el-input
      placeholder="Enter your passphrase"
      v-model="passphrase"
      show-password
    ></el-input>

    <el-button type="info" class="mt-2">Login</el-button>

    <el-button type="info" @click="register">New Account</el-button>
  </el-main>
</template>

<script>
import { Connection } from '@gny/client';

const connection = new Connection('192.168.1.252', 4096, 'testnet');

export default {
  data() {
    return {
      passphrase: '',
      newAccount: ''
    };
  },
  methods: {
    async register() {
      try {
        this.newAccount = (
          await connection.api.Account.generateAccount()
        ).secret;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.login {
  margin: auto;
}
</style>
