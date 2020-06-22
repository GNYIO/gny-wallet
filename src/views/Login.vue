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
    </div>

    <el-alert
      title="Please save your passphrase to a safe place!"
      type="error"
      :closable="false"
      center
      v-if="newAccount"
    ></el-alert>

    <el-row>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginFormRules"
        v-show="secondPublicKey === null"
      >
        <el-form-item prop="passphrase">
          <el-tooltip effect="light" content="Passphrase" placement="top-start">
            <el-input
              placeholder="Enter your passphrase"
              v-model="loginForm.passphrase"
              show-password
            ></el-input>
          </el-tooltip>
        </el-form-item>

        <div class="button-container">
          <el-button type="primary" @click="login">Login</el-button>
          <el-button @click="register">New Account</el-button>
        </div>
      </el-form>

      <el-form
        ref="secondLoginForm"
        :model="secondLoginForm"
        :rules="secondLoginFormRules"
        v-show="secondPublicKey !== null"
      >
        <el-form-item prop="secondPassphrase">
          <el-tooltip
            effect="light"
            content="Second Passphrase"
            placement="top-start"
          >
            <el-input
              placeholder="Second passphrase"
              v-model="secondLoginForm.secondPassphrase"
            ></el-input>
          </el-tooltip>
        </el-form-item>

        <div class="button-container">
          <el-button type="primary" @click="secondLogin"
            >Login with second Passphrase</el-button
          >
        </div>
      </el-form>
    </el-row>
  </el-main>
</template>

<script>
import * as Mnemonic from 'bitcore-mnemonic';
import { mapGetters } from 'vuex';
import * as client from '@gny/client';

const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

export function generateSecret() {
  return new Mnemonic(Mnemonic.Words.ENGLISH).toString();
}

async function getSecondPublicKey(passphrase) {
  const keys = client.crypto.getKeys(passphrase);
  try {
    const response = await connection.api.Account.openAccount(keys.publicKey);
    if (response.success) {
      if (response.account.secondPublicKey) {
        return response.account.secondPublicKey;
      }
    }
    return null;
  } catch {
    return null;
  }
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
        callback(new Error('not a valid BIP39'));
      }
    };

    const validateSecondPassphrase = (rule, value, callback) => {
      try {
        console.log(`secondValidate: ${value}`);

        const secondPublicKey = this.secondPublicKey;
        if (!secondPublicKey) {
          callback();
        }

        const typedSecondPublicKey = client.crypto.getKeys(value).publicKey;
        if (typedSecondPublicKey === secondPublicKey) {
          callback();
        } else {
          callback(new Error('not valid second passphrase'));
        }
      } catch (err) {
        callback(new Error('not valid second passphrase'));
      }
    };

    return {
      secondPublicKey: null,
      showSecondPassword: false,
      newAccount: '',
      loginForm: {
        passphrase: '',
      },
      loginFormRules: {
        passphrase: [{ validator: validatePassphrase, trigger: 'change' }],
      },
      secondLoginForm: {
        secondPassphrase: '',
      },
      secondLoginFormRules: {
        secondPassphrase: [
          { validator: validateSecondPassphrase, trigger: 'change' },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['hasSecondPassphrase']),
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
        const secondPublicKey = await getSecondPublicKey(passphrase);

        if (secondPublicKey) {
          this.secondPublicKey = secondPublicKey;
          return;
        } else {
          this.$store.dispatch('setSecondPassphrase', null);

          this.$store.dispatch('setPassphrase', passphrase);
          this.$store.dispatch('setLogin', true);

          this.$router.push('/home');
        }
      } catch (error) {
        console.log(`Login error: ${error}`);
      }
    },
    async secondLogin() {
      try {
        await this.$refs['secondLoginForm'].validate();
      } catch (err) {
        console.log(`validation for secondLoginForm failed`);
        return;
      }

      const secondPassphrase = this.secondLoginForm.secondPassphrase;
      const passphrase = this.loginForm.passphrase;

      await this.$store.dispatch('setSecondPassphrase', secondPassphrase);

      await this.$store.dispatch('setPassphrase', passphrase);
      await this.$store.dispatch('setLogin', true);
      await this.$store.dispatch('refreshAccounts');

      this.$router.push('/home');
    },
  },
};
</script>

<style scoped>
.el-main {
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

.button-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
