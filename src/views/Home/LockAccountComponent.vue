<template>
  <el-col :span="12">
    <el-card v-if="!positiveBalance">
      <div>
        <h3>You need 0.1 GNY to lock your account</h3>
      </div>
    </el-card>

    <el-card v-if="positiveBalance">
      <div slot="header" v-if="user.lockHeight === '0'">
        Lock your account
      </div>
      <div slot="header" v-else>
        Increase your lock amount
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
</template>

<script>
import { showErrorPopup } from '../../helpers/errorDisplay';
import { BigNumber } from 'bignumber.js';

import * as client from '@gnyio/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  props: {
    user: Object,
    positiveBalance: Boolean,
    minLockHeight: String,
    maxLockHeight: String,
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    const validateLockHeight = (rule, rawValue, callback) => {

      const value = new BigNumber(rawValue);
      if (value.isInteger === false) {
        return callback(new Error('lock height is not valid'));
      }

      const minLockHeight = new BigNumber(this.minLockHeight);
      const maxLockHeight = new BigNumber(this.maxLockHeight);

      if (
        value.isGreaterThanOrEqualTo(minLockHeight) &&
        value.isLessThanOrEqualTo(maxLockHeight)
      ) {
        return callback(); // success
      } else {
        return callback(new Error(`lock height must be between "${minLockHeight.toFixed()}" and "${maxLockHeight.toFixed()}"`));
      }
    };

    const validateLockAmount = (rule, rawValue, callback) => {

      const value = new BigNumber(rawValue);
      if (value.isInteger === false) {
        return callback(new Error('lock amount is not valid'));
      }

      if (value.isLessThanOrEqualTo(1000000)) {
        return callback();
      } else {
        return callback(new Error('you can only lock 1 million at a time'));
      }
    };

    return {
      isLocked: false,

      hideLockBadge: true,

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
            validator: validateLockHeight,
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
          {
            validator: validateLockAmount,
            trigger: 'change',
          },
        ],
      },
    };
  },

  methods: {
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
        showErrorPopup.apply(this, [err]);
      }
    },
  },
};
</script>
