<template>
  <el-main>
    <img alt="GNY logo" src="../assets/logo.png" />

    <div v-if="newAccount">
      <el-alert
        :title="newAccount"
        type="success"
        center
        effect="dark"
        :closable="false"
      ></el-alert>
      <!-- <el-button @click="copyPassword" style="display:inline">
        Copy <i class="el-icon-document-copy"></i>
      </el-button> -->
    </div>

    <el-alert
      title="Please save your passphrase to a safe place!"
      type="error"
      :closable="false"
      center
      v-if="newAccount"
    ></el-alert>

    <el-row>
      <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="passphrase">
          <el-input
            placeholder="Enter your passphrase"
            v-model="loginForm.passphrase"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-button type="info" @click="login">Login</el-button>
      <el-button type="info" @click="register">New Account</el-button>
    </el-row>
  </el-main>
</template>

<script>
import * as Mnemonic from 'bitcore-mnemonic';
import * as Cookie from 'tiny-cookie';

export function generateSecret() {
  return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
}

export default {
  data() {
    const validatePassphrase = (rule, value, callback) => {
      try {
        if (Mnemonic.isValid(value)) {
          callback();
        } else {
          callback(new Error('not a valid BIP39'));
        }
      } catch (err) {
        callback(new Error('not a valid BIP39'))
      }
    };

    return {
      newAccount: '',
      loginForm: {
        passphrase: '',
      },
      loginFormRules: {
        passphrase: [
          { validator: validatePassphrase, trigger: 'change' },
        ],
      },
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
        await this.$refs['loginForm'].validate();
      } catch (err) {
        console.log(`validation for loginForm failed`);
        return;
      }

      try {
        const passphrase = this.loginForm.passphrase;

        Cookie.set('bip39', passphrase);
        await this.$store.dispatch('setPassphrase', passphrase);
        await this.$store.dispatch('setToken', passphrase);
        await this.$store.dispatch('refreshAccounts');
        this.$router.push('/home');
      } catch (error) {
        console.log(`Login error: ${error}`);
      }
    },
  },
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
}

.el-input {
  width: 500px;
  margin: 15px 0;
}

.el-alert {
  padding: 2rem;
  margin-top: 15px;
  width: auto;
}
</style>
