<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        Issue Assets
      </div>

      <el-form
        label-position="left"
        ref="issueAssetsForm"
        :model="issueAssetsForm"
        :rules="issueAssetsFormRules"
        label-width="80px"
      >
        <el-form-item label="Asset" prop="currency">
          <el-tooltip
            effect="light"
            content="Select Asset to issue"
            placement="top-start"
          >
            <el-select
              placeholder="select currency"
              clearable
              v-model="issueAssetsForm.currency"
              style="float: left; width:80%"
            >
              <el-option
                v-for="item in ownAssets"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; margin-right: 2em">{{
                  item.desc
                }}</span>
              </el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="Amount" prop="amount">
          <el-tooltip
            effect="light"
            content="Issue amount"
            placement="top-start"
          >
            <el-input
              v-model="issueAssetsForm.amount"
              :disabled="issueAssetsForm.currency === ''"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <div style="float: left;">
            <el-badge
              value="0.1 GNY"
              type="info"
              @mouseover.native="hideIssueAssetBadge = false"
              @mouseleave.native="hideIssueAssetBadge = true"
              :hidden="hideIssueAssetBadge"
            >
              <el-button type="primary" @click="issueAsset"
                >Issue Asset</el-button
              >
            </el-badge>
          </div>
          <el-button
            @click="resetIssueAsset"
            style="float: left; margin-left: 10px"
            >Reset</el-button
          >
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
    passphrase: String,
    secondPassphrase: String,
    ownAssets: Array,
  },
  data() {
    const validateIssueAmount = (rule, value, callback) => {
      try {
        if (!value) {
          callback(new Error('no value'));
        }

        const selectedCurrency = this.issueAssetsForm.currency;
        if (!selectedCurrency) {
          callback();
        }

        const leftToIssueRaw = this.ownAssets.filter(
          x => x.name === selectedCurrency,
        )[0].leftToIssuePretty;

        const leftToIssue = new BigNumber(leftToIssueRaw);
        const amount = new BigNumber(value);

        if (amount.isGreaterThan(leftToIssue)) {
          callback(`you can issue maximal ${leftToIssue}`);
        } else {
          callback();
        }
      } catch (err) {
        callback(new Error('test'));
      }
    };

    return {
      hideIssueAssetBadge: true,

      issueAssetsForm: {
        currency: '',
        amount: '',
      },

      issueAssetsFormRules: {
        currency: [
          {
            required: true,
            message: 'A currency is required',
          },
        ],
        amount: [
          {
            required: true,
            message: 'A amount is required',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            trigger: 'change',
          },
          {
            validator: validateIssueAmount,
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    async issueAsset() {
      try {
        await this.$refs['issueAssetsForm'].validate();
      } catch (err) {
        console.log(
          `validation for issueAssetsForm failed, error: ${err.message}`,
        );
        return;
      }

      try {
        const currency = this.issueAssetsForm.currency;
        const precisionRaw = this.ownAssets.filter(x => x.name === currency)[0]
          .precision;
        const precision = Math.pow(10, precisionRaw);

        const amount = new BigNumber(this.issueAssetsForm.amount)
          .times(precision)
          .toFixed();

        const result = await connection.contract.Uia.issueAsset(
          currency,
          amount,
          this.passphrase,
          this.secondPassphrase,
        );

        this.$message(result.transactionId);
        this.$refs['issueAssetsForm'].resetFields();
      } catch (err) {
        showErrorPopup.apply(this, [err]);
      }
    },

    resetIssueAsset() {
      this.$refs['issueAssetsForm'].resetFields();
    },
  },
};
</script>
