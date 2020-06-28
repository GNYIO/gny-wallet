<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        Create Assets
      </div>

      <el-form
        ref="createAssetsForm"
        :model="createAssetsForm"
        :rules="createAssetsFormRules"
        label-width="80px"
      >
        <el-form-item label="Name" prop="name">
          <el-tooltip
            effect="light"
            content="Asset name e.g. BBB"
            placement="top-start"
          >
            <el-input v-model="createAssetsForm.name"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Desc." prop="desc">
          <el-tooltip
            effect="light"
            content="Description"
            placement="top-start"
          >
            <el-input v-model="createAssetsForm.desc"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Prec." prop="precision">
          <el-tooltip effect="light" content="Precision" placement="top-start">
            <el-input-number
              v-model="createAssetsForm.precision"
              :min="1"
              :max="16"
              style="float: left;"
            ></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Maximum" prop="maximum">
          <el-tooltip effect="light" content="Maximum" placement="top-start">
            <el-input v-model="createAssetsForm.maximum"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <div style="float: left;">
            <el-badge
              value="500 GNY"
              type="info"
              @mouseover.native="hideCreateAssetBadge = false"
              @mouseleave.native="hideCreateAssetBadge = true"
              :hidden="hideCreateAssetBadge"
            >
              <el-button @click="createAsset" type="primary"
                >Create Asset</el-button
              >
            </el-badge>
          </div>

          <el-button
            @click="resetCreateAssetsForm"
            style="float: left; margin-left: 10px;"
            >Reset</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </el-col>
</template>

<script>
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

import { BigNumber } from 'bignumber.js';

export default {
  props: {
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    return {
      hideCreateAssetBadge: true,

      createAssetsForm: {
        name: '',
        desc: '',
        precision: 8,
        maximum: 1 * 1e8,
      },
      createAssetsFormRules: {
        name: [
          {
            required: true,
            message: 'Please add a name',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[A-Z]{3,6}$/,
            trigger: 'change',
          },
        ],
        desc: [
          {
            required: true,
            message: 'Please add a description',
            trigger: 'blur',
          },
          {
            max: 4096,
            message: 'Length should not be longer than 4096',
            trigger: 'blur',
          },
        ],
        precision: [
          {
            required: true,
            message: 'Please add a precision',
            trigger: 'blur',
          },
        ],
        maximum: [
          {
            required: true,
            message: 'Please add a maximum',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async createAsset() {
      try {
        await this.$refs['createAssetsForm'].validate();
      } catch (err) {
        console.log(
          `validation for createAssetsForm failed, error: ${err.message}`,
        );
        return;
      }

      try {
        const name = this.createAssetsForm.name;
        const desc = this.createAssetsForm.desc;

        const precRaw = Math.pow(10, Number(this.createAssetsForm.precision));
        const maximum = new BigNumber(this.createAssetsForm.maximum)
          .multipliedBy(precRaw)
          .toFixed();
        const precision = Number(this.createAssetsForm.precision);

        const trs = await connection.contract.Uia.registerAsset(
          name,
          desc,
          maximum,
          precision,
          this.passphrase,
          this.secondPassphrase,
        );

        if (trs.transactionId) {
          this.$message(trs.transactionId);
          this.$refs['createAssetsForm'].resetFields();
        }
      } catch (err) {
        console.log(err.response && err.response.data);
      }
    },
    resetCreateAssetsForm() {
      this.$refs['createAssetsForm'].resetFields();
    },
  },
};
</script>
