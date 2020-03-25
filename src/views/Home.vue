<template>
  <div>
    <el-row :gutter="20">
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
        <el-card v-if="!positiveBalance">
          <div>
            <h3>You need 5 GNY to set your username</h3>
          </div>
        </el-card>

        <el-card v-if="!user.username && positiveBalance">
          <div slot="header">
            <span>Set Username</span>
          </div>

          <el-form
            ref="usernameForm"
            :model="usernameForm"
            label-width="80px"
            :rules="usernameFormRules"
          >
            <el-form-item label="Usern." prop="username">
              <el-input
                v-model="usernameForm.username"
                :disabled="hasUsername"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="setUsername"
                style="float: left"
                :disabled="hasUsername"
                >Set Username</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="!positiveBalance">
          <div>
            <h3>You need 5 GNY to set a second password</h3>
          </div>
        </el-card>

        <el-card v-if="!hasSecondPassphrase && positiveBalance">
          <div slot="header">
            <span>Set Second password</span>
          </div>

          <el-form
            ref="secondPassphraseForm"
            :model="secondPassphraseForm"
            label-width="80px"
            :rules="secondPassphraseFormRules"
          >
            <el-form-item label="2nd P." prop="secondPassphrase">
              <el-tooltip
                effect="light"
                content="Second Passphrase"
                placement="top-start"
              >
                <el-input
                  :disabled="isSecondPassphrase"
                  v-model="secondPassphraseForm.secondPassphrase"
                ></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="setSecondPassphrase"
                style="float: left"
                :disabled="isSecondPassphrase"
                >Set Second Passphrase</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="user.lockHeight === '0'">
      <el-col :span="12">
        <el-card v-if="!positiveBalance">
          <div>
            <h3>You need 0.1 GNY to lock your account</h3>
          </div>
        </el-card>

        <el-card v-if="positiveBalance">
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
import { mapState, mapGetters } from 'vuex';
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
  data() {
    return {
      hasUsername: false,
      isSecondPassphrase: false,

      placeholder: '',
      usernameForm: {
        username: '',
      },
      usernameFormRules: {
        username: [
          {
            required: true,
            message: 'Please add a username',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[a-z0-9_]{2,20}$/,
            trigger: 'change',
          },
        ],
      },

      secondPassphraseForm: {
        secondPassphrase: '',
      },
      secondPassphraseFormRules: {
        secondPassphrase: [
          {
            required: true,
            message: 'Please add a second passphrase',
            trigger: 'blur',
          },
        ],
      },

      lockAccountForm: {
        lockHeight: '0',
        lockAmount: '0',
      },
    };
  },
  computed: {
    ...mapState(['user', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['positiveBalance', 'hasSecondPassphrase']),
  },
  methods: {
    async setUsername() {
      try {
        await this.$refs['usernameForm'].validate();
      } catch (err) {
        console.log('Validation for usernameForm failed');
        return;
      }

      try {
        const result = await connection.contract.Basic.setUserName(
          this.usernameForm.username,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
        this.hasUsername = true;
      } catch (err) {
        console.log(err);
      }
    },
    async setSecondPassphrase() {
      try {
        await this.$refs['secondPassphraseForm'].validate();
      } catch (err) {
        console.log('Validation for secondPassphraseForm failed');
        return;
      }

      try {
        const result = await connection.contract.Basic.setSecondPassphrase(
          this.passphrase,
          this.secondPassphraseForm.secondPassphrase,
        );
        this.$message(result.transactionId);

        // TODO set
        this.isSecondPassphrase = true;
      } catch (err) {
        console.log(err);
      }
    },
    async lockAccount() {
      try {
        const height = this.lockAccountForm.lockHeight;
        const amount = this.lockAccountForm.lockAmount * 1e8;

        const result = await connection.contract.Basic.lockAccount(
          height,
          amount,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
      } catch (err) {
        console.log(err.message);
      }
    },
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
