<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        Transfer Asset
      </div>
      <el-form
        ref="transferAssetForm"
        :model="transferAssetForm"
        :rules="transferAssetFormRules"
        label-width="80px"
      >
        <el-form-item label="Curr." prop="currency">
          <el-tooltip
            effect="light"
            content="Select currency"
            placement="top-start"
          >
            <el-select
              placeholder="select currency"
              clearable
              v-model="transferAssetForm.currency"
              style="float: left"
            >
              <el-option
                v-for="item in prettyBalances"
                :key="item.currency"
                :label="item.currency"
                :value="item.currency"
              >
              </el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Amount" prop="amount">
          <el-tooltip effect="light" content="Add amount" placement="top-start">
            <el-input
              v-model="transferAssetForm.amount"
              :min="0"
              :disabled="!transferAssetForm.currency"
            >
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Recip." prop="recipientId">
          <el-tooltip
            effect="light"
            content="Add recipient. e.g. GWrAxgXSiZxieGrLWungJqWe4Xws"
            placement="top-start"
          >
            <el-input v-model="transferAssetForm.recipientId"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Message" prop="message">
          <el-tooltip
            effect="light"
            content="Add optional message"
            placement="top-start"
          >
            <el-input v-model="transferAssetForm.message"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <div style="float: left;">
            <el-badge
              value="0.1 GNY"
              type="info"
              @mouseover.native="hideTransferAssetBadge = false"
              @mouseleave.native="hideTransferAssetBadge = true"
              :hidden="hideTransferAssetBadge"
            >
              <el-button type="primary" @click="transferAsset"
                >Transfer Asset</el-button
              >
            </el-badge>
          </div>
          <el-button
            @click="resetTransferAsset"
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
import { mapState, mapGetters } from 'vuex';
import * as client from '@gny/client';
import { isAddress, BigNumber } from '@gny/utils';

const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  data() {
    const validateAddress = (rule, value, callback) => {
      if (isAddress(value)) {
        callback();
      } else {
        callback(new Error('not a valid address'));
      }
    };

    return {
      hideTransferAssetBadge: true,

      transferAssetForm: {
        currency: '',
        amount: '',
        recipientId: '',
        message: '',
      },
      transferAssetFormRules: {
        currency: [
          {
            required: true,
            message: 'Currency is required',
            trigger: 'blur',
          },
        ],
        amount: [
          {
            required: true,
            message: 'Amount is required',
            trigger: 'blur',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            trigger: 'change',
          },
        ],
        recipientId: [
          {
            required: true,
            message: 'Recipient is required',
            trigger: 'blur',
          },
          { validator: validateAddress, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapState(['user', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['prettyBalances']),
  },
  methods: {
    async transferAsset() {
      try {
        await this.$refs['transferAssetForm'].validate();
      } catch (err) {
        console.log('validation for transferAssetForm failed');
        return;
      }

      try {
        const currency = this.transferAssetForm.currency;

        const precisionRaw = this.prettyBalances.filter(
          x => x.currency === currency,
        )[0].currency_precision;
        const precision = Math.pow(10, precisionRaw);

        const amountRaw = this.transferAssetForm.amount;
        const amount = new BigNumber(amountRaw).times(precision).toFixed();

        const recipientId = this.transferAssetForm.recipientId;
        const message = this.transferAssetForm.message;

        console.log(
          `currency: ${currency}, amount: ${amount}, recipientId: ${recipientId}, message: "${message}"`,
        );
        const result = await connection.contract.Uia.transfer(
          currency,
          amount,
          recipientId,
          message,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);

        this.$refs['transferAssetForm'].resetFields();
      } catch (err) {
        showErrorPopup.apply(this, [err]);
      }
    },
    resetTransferAsset() {
      this.$refs['transferAssetForm'].resetFields();
    },
  },
};
</script>
