<template>
  <el-col :span="12" v-if="user && user.lockHeight !== '0'">
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
</template>

<script>
import { BigNumber } from 'bignumber.js';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

export default {
  props: {
    user: Object,
    positiveBalance: Boolean,
    latestBlock: Object,
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    return {
      unlockAccountForm: {},
      hideUnlockAccountBadge: true,
    };
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
};
</script>
