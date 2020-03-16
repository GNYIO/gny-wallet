<template>
  <el-card>
    <div slot="header">
      Transfer Asset
    </div>
    <el-form :ref="transferAssetForm" :model="transferAssetForm" label-width="80px">
      <el-form-item label="Currency">
        <el-select
          placeholder="select currency"
          clearable
          v-model="transferAssetForm.currency"
          style="float: left"
        >
          <el-option
            v-for="item in ownAssets"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; margin-right: 2em"
              >{{ item.desc }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Amount.">
        <el-input-number
          v-model="transferAssetForm.amount"
          style="float: left; width: 300px"
          :min="0">
        </el-input-number>
      </el-form-item>
      <el-form-item label="Recipient">
        <el-input v-model="transferAssetForm.recipientId"></el-input>
      </el-form-item>
      <el-form-item label="Message">
        <el-input v-model="transferAssetForm.message"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="transferAsset" style="float: left;">Transfer Asset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as client from '@gny/client'
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  process.env.VUE_APP_GNY_PORT,
  process.env.VUE_APP_GNY_NETWORK,
);
import {
  Notification
} from 'element-ui';

export default {
  data() {
    return {
      transferAssetForm: {
        currency: '',
        amount: 0,
        recipientId: '',
        message: '',
      },
    };
  },
  computed: {
    ...mapState(['user', 'passphrase']),
    ...mapGetters(['ownAssets']),
  },
  methods: {
    async transferAsset() {
      try {
        const currency = this.transferAssetForm.currency;

        const precisionRaw = this.ownAssets[currency].precision;
        const precision = Math.pow(10, precisionRaw);

        const amount = String(this.transferAssetForm.amount * precision);
        const recipientId = this.transferAssetForm.recipientId;
        const message = this.transferAssetForm.message;

        const trs = client.uia.transfer(
          currency,
          amount,
          recipientId,
          message,
          this.passphrase,
        );
        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        const message = (err.response && err.response.data && err.response.data.error) || 'request failed';
        Notification({
          title: 'Error',
          message: message,
        });
      }
    },
  },
}
</script>
