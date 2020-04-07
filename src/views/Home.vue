<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>Account Info</span>
          </div>

          <el-row>
            <el-col :span="12">
              <p v-if="user.username">
                Username: <b>{{ user.username }}</b>
              </p>
              <p>
                Address: <b>{{ user.address }}</b>
              </p>
              <p>
                Balance: <b>{{ user.balancePretty }} GNY</b>
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                Is Locked: <b>{{ user.lockHeight === '0' ? 'No' : 'Yes' }}</b>
              </p>
              <p v-if="user.lockHeight !== '0'">
                Lock Height: <b>{{ user.lockHeight }}</b>
              </p>
              <p v-if="user.lockHeight !== '0'">
                Lock Amount: <b>{{ user.lockAmountPretty }} GNY</b>
              </p>
              <p v-if="user.secondPublicKey">
                Has Second Secret:
                <b>{{ user.secondPublicKey === null ? 'No' : 'Yes' }}</b>
              </p>
              <p v-if="user.secondPublicKey">
                Second PublicKey: <b>{{ user.secondPublicKey }}</b>
              </p>
            </el-col>
          </el-row>
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
              <div style="float: left">
                <el-badge
                  value="5 GNY"
                  type="info"
                  @mouseover.native="hideSetUsernameBadge = false"
                  @mouseleave.native="hideSetUsernameBadge = true"
                  :hidden="hideSetUsernameBadge"
                >
                  <el-button
                    type="primary"
                    @click="setUsername"
                    :disabled="hasUsername"
                    >Set Username</el-button
                  >
                </el-badge>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="user.lockHeight === '0'">
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
              <div style="float: left">
                <el-badge
                  value="5 GNY"
                  type="info"
                  @mouseover.native="hideSetSecondPassphraseBadge = false"
                  @mouseleave.native="hideSetSecondPassphraseBadge = true"
                  :hidden="hideSetSecondPassphraseBadge"
                >
                  <el-button
                    type="primary"
                    @click="setSecondPassphrase"
                    :disabled="isSecondPassphrase"
                    >Set Second Passphrase</el-button
                  >
                </el-badge>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

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

          <el-form
            ref="lockAccountForm"
            :model="lockAccountForm"
            label-width="80px"
            :rules="lockAccountFormRules"
          >
            <el-form-item label="height" prop="lockHeight">
              <el-tooltip
                effect="light"
                content="Hide amount until lock height"
                placement="top-start"
              >
                <el-input
                  v-model="lockAccountForm.lockHeight"
                  :disabled="isLocked"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="amount" prop="lockAmount">
              <el-tooltip
                effect="light"
                content="Amount to lock"
                placement="top-start"
              >
                <el-input
                  v-model="lockAccountForm.lockAmount"
                  :disabled="isLocked"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <div style="float: left;">
                <el-badge
                  value="0.1 GNY"
                  type="info"
                  @mouseover.native="hideLockBadge = false"
                  @mouseleave.native="hideLockBadge = true"
                  :hidden="hideLockBadge"
                >
                  <el-button
                    type="primary"
                    @click="lockAccount"
                    :disabled="isLocked"
                    >Lock Account</el-button
                  >
                </el-badge>
              </div>
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

<script>
import * as Cookie from 'tiny-cookie';
import { mapState, mapGetters } from 'vuex';
import TransactionsPaged from './TransactionsPaged';
import { BigNumber } from 'bignumber.js';

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
    const validateBlockHeight = (rule, value, callback) => {
      try {
        const minLockHeight = new BigNumber(this.minLockHeight);
        if (minLockHeight.isLessThan(value)) {
          callback();
        } else {
          callback(
            new Error(`Lock height must be greater than ${this.minLockHeight}`),
          );
        }
      } catch (err) {
        callback(
          new Error(`Lock height must be greater than ${this.minLockHeight}`),
        );
      }
    };

    return {
      hideLockBadge: true,
      hideSetUsernameBadge: true,
      hideSetSecondPassphraseBadge: true,

      hasUsername: false,
      isSecondPassphrase: false,
      isLocked: false,

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
        lockHeight: '',
        lockAmount: '',
      },
      lockAccountFormRules: {
        lockHeight: [
          {
            required: true,
            message: 'Please add a lockHeight',
            trigger: 'change',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            trigger: 'change',
          },
          {
            validator: validateBlockHeight,
            trigger: 'change',
          },
        ],
        lockAmount: [
          {
            required: true,
            message: 'Please add a lockAmount',
            trigger: 'change',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            trigger: 'change',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['passphrase', 'secondPassphrase']),
    ...mapGetters([
      'user',
      'positiveBalance',
      'hasSecondPassphrase',
      'minLockHeight',
    ]),
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
        const secondPassphrase = this.secondPassphraseForm.secondPassphrase;
        const result = await connection.contract.Basic.setSecondPassphrase(
          this.passphrase,
          secondPassphrase,
        );
        this.$message(result.transactionId);

        // disable button and input
        this.isSecondPassphrase = true;

        // set cookie
        Cookie.set('bip39Second', secondPassphrase);
        await this.$store.dispatch('setSecondPassphrase', secondPassphrase);
        await this.$store.dispatch('refreshAccounts');
      } catch (err) {
        console.log(err);
      }
    },
    async lockAccount() {
      try {
        await this.$refs['lockAccountForm'].validate();
      } catch (err) {
        console.log(err);
        console.log('Validation for lockAccountForm failed');
        return;
      }

      try {
        const height = this.lockAccountForm.lockHeight;
        const amount = new BigNumber(this.lockAccountForm.lockAmount)
          .multipliedBy(1e8)
          .toFixed();

        const result = await connection.contract.Basic.lockAccount(
          height,
          amount,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
        this.isLocked = true;
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
