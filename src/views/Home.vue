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
      <Set2ndPasswordComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:passphrase="passphrase"
        v-bind:hasSecondPassphrase="hasSecondPassphrase"
      ></Set2ndPasswordComponent>

      <LockAccountComponent
        v-bind:user="user"
        v-bind:positiveBalance="positiveBalance"
        v-bind:minLockHeight="minLockHeight"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></LockAccountComponent>

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
import Set2ndPasswordComponent from './Home/Set2ndPasswordComponent';
import LockAccountComponent from './Home/LockAccountComponent';

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
    Set2ndPasswordComponent,
    LockAccountComponent,
  },
  data() {
    return {
      placeholder: '',

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
