<template>
  <el-main>
    <img alt="GNY logo" src="../assets/logo.png" />
    <br />

    <el-input v-model="newAccount" v-if="!!newAccount"></el-input>
    <div align="center" v-if="!!newAccount">
      <el-alert
        title="Please save your passphrase to a safe place!"
        type="error"
        :closable="false"
        center
      >
      </el-alert>
    </div>
    <br />
    <el-input
      placeholder="Enter your passphrase"
      v-model="passphrase"
      show-password
    ></el-input>
    <br />
    <br />

    <el-button type="info" @click="login">Login</el-button>
    <el-button type="info" @click="register">New Account</el-button>
  </el-main>
</template>

<script>
import * as Mnemonic from 'bitcore-mnemonic';
import * as Cookie from 'tiny-cookie'

export function generateSecret() {
  return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
}

export default {
  data() {
    return {
      passphrase: '',
      newAccount: '',
    };
  },
  methods: {
    async register() {
      try {
        this.newAccount = generateSecret();
      } catch (error) {
        console.log(error);
      }
    },
    async login() {
      try {
        Cookie.set('bip39', this.passphrase);

        this.$store.dispatch('setPassphrase', this.passphrase);
        this.$store.dispatch('setToken', this.passphrase);
        await this.$store.dispatch('refreshAccounts');
        this.$router.push('/home');
        location.reload();
      } catch (error) {
        console.log('in login', error);
      }
    },
  },
};
</script>

<style scoped>
.el-main {
  text-align: center;
}

img {
  width: 300px;
}

.el-input {
  width: 500px;
}

.el-alert {
  width: 500px;
}
</style>
