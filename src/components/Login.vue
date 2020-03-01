<template>
  <el-main>
    <img alt="GNY logo" src="../assets/logo.png" />

    <el-input v-model="newAccount" v-if="newAccount"></el-input>

    <el-alert
      title="Please save your passphrase to a safe place!"
      type="error"
      :closable="false"
      center
      v-if="newAccount"
    ></el-alert>

    <el-input placeholder="Enter your passphrase" v-model="passphrase" show-password></el-input>

    <el-row>
      <el-button type="info" @click="login">Login</el-button>
      <el-button type="info" @click="register">New Account</el-button>
    </el-row>
  </el-main>
</template>

<script>
import * as Mnemonic from "bitcore-mnemonic";
import * as Cookie from "tiny-cookie";

export function generateSecret() {
  return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
}

export default {
  data() {
    return {
      passphrase: "",
      newAccount: ""
    };
  },
  methods: {
    async register() {
      try {
        this.newAccount = generateSecret();
      } catch (error) {
        console.log(`Register error: ${error}`);
      }
    },
    async login() {
      try {
        Cookie.set("bip39", this.passphrase);
        await this.$store.dispatch("setPassphrase", this.passphrase);
        await this.$store.dispatch("setToken", this.passphrase);
        await this.$store.dispatch("refreshAccounts");
        this.$router.push("/home");
        // location.reload();
      } catch (error) {
        console.log(`Login error: ${error}`);
      }
    }
  }
};
</script>

<style scoped>
.el-main {
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

img {
  width: 300px;
  margin-bottom: 100px;
}

.el-input {
  width: 500px;
  margin: 15px 0;
}

.el-alert {
  width: 500px;
}

.el-input {
  display: block-inline;
}
</style>
