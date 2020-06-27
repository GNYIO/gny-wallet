<template>
  <div>
    <el-row :gutter="20">
      <AccountInfoComponent v-bind:user="user"></AccountInfoComponent>
      <SetUsernameComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></SetUsernameComponent>
    </el-row>

    <el-row :gutter="20">
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

      <el-col :span="12" v-if="user.lockHeight === '0'">
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

      <el-col :span="12" v-if="user.lockHeight !== '0'">
        <el-card v-if="!positiveBalance">
          <div>
            <h3>You need 0.1 GNY to unlock your account</h3>
          </div>
        </el-card>

        <el-card v-if="positiveBalance">
          <div slot="header">
            Unlock your account
          </div>

          <el-form ref="unlockAccountForm" :model="unlockAccountForm">
            <el-form-item>
              <!--

              -->
              <el-badge
                value="0.1 GNY"
                type="info"
                @mouseover.native="hideUnlockAccountBadge = false"
                @mouseleave.native="hideUnlockAccountBadge = true"
                :hidden="hideUnlockAccountBadge"
              >
                <!-- :disabled="alreadyDelegate"-->
                <el-button type="primary" @click="unlockAccount"
                  >Unlock Account</el-button
                >
              </el-badge>
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
import { mapState, mapGetters } from 'vuex';
import TransactionsPaged from './TransactionsPaged';
import AccountInfoComponent from './Home/AccountInfoComponent';
import SetUsernameComponent from './Home/SetUsernameComponent';

import { BigNumber } from 'bignumber.js';

import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

export default {
  components: {
    TransactionsPaged,
    AccountInfoComponent,
    SetUsernameComponent,
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
      hideSetSecondPassphraseBadge: true,

      isSecondPassphrase: false,
      isLocked: false,

      placeholder: '',

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

      unlockAccountForm: {},
      hideUnlockAccountBadge: true,
    };
  },
  computed: {
    ...mapState(['passphrase', 'secondPassphrase', 'latestBlock']),
    ...mapGetters([
      'user',
      'positiveBalance',
      'hasSecondPassphrase',
      'minLockHeight',
    ]),
  },
  methods: {
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
    async unlockAccount() {
      const currentHeight = new BigNumber(this.latestBlock.height);
      const lockHeight = new BigNumber(this.user.lockHeight);

      if (currentHeight.isLessThan(lockHeight)) {
        this.$message({
          message: `You need to wait until height "${lockHeight.toFixed()}" to unlock your account`,
          type: 'error',
        });
        return;
      }

      try {
        const result = await connection.contract.Basic.unlockAccount(
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);
      } catch (err) {
        const message =
          err && err.response && err.response.data && err.response.data.error;
        this.$message({
          message: message,
          type: 'error',
        });
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
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
