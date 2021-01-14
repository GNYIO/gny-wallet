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
              :min="0"
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
        <el-form-item label="Full" prop="fullMaximum">
          <el-tooltip
            effect="light"
            content="Precision and Maximum combined"
            placement="top-start"
          >
            <el-input
              v-model="fullMaximum"
              :disabled="true"
              :readonly="true"
            ></el-input>
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
import { showErrorPopup } from '../../helpers/errorDisplay';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

import { BigNumber } from 'bignumber.js';

export default {
  props: {
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    const validatePrecision = (rule, value, callback) => {
      const highestPossibleMaximum = '9000000000000000000';

      const precRaw = Math.pow(10, Number(value));
      const maximum = new BigNumber(this.createAssetsForm.maximum)
        .multipliedBy(precRaw)
        .toFixed();

      const errorMsg = `Precision too high for this maximum`;
      try {
        if (new BigNumber(maximum).isGreaterThan(highestPossibleMaximum)) {
          callback(new Error(errorMsg));
        } else {
          callback();
        }
      } catch (err) {
        callback(new Error(errorMsg));
      }
    };

    const validateMaximum = (rule, value, callback) => {
      const highestPossibleMaximum = '9000000000000000000';

      const precRaw = Math.pow(10, Number(this.createAssetsForm.precision));
      const maximum = new BigNumber(value).multipliedBy(precRaw).toFixed();

      const errorMsg = `Maximum can be maximum "${highestPossibleMaximum}"`;
      try {
        if (new BigNumber(maximum).isGreaterThan(highestPossibleMaximum)) {
          callback(new Error(errorMsg));
        } else {
          callback();
        }
      } catch (err) {
        callback(new Error(errorMsg));
      }
    };

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
          {
            type: 'string',
            pattern: /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/,
            trigger: 'change',
          },
        ],
        precision: [
          {
            required: true,
            message: 'Please add a precision',
            trigger: 'blur',
          },
          {
            validator: validatePrecision,
            trigger: 'change',
          },
        ],
        maximum: [
          {
            required: true,
            message: 'Please add a maximum',
            trigger: 'change',
          },
          {
            pattern: /^[1-9][0-9]*$/,
            trigger: 'change',
          },
          {
            validator: validateMaximum,
            trigger: 'change',
          },
        ],
      },
    };
  },
  computed: {
    fullMaximum: function() {
      const precision = this.createAssetsForm.precision;

      const maximum = this.createAssetsForm.maximum;
      const prec = precision > 0 ? `.${'0'.repeat(precision)}` : '';
      const result = `${maximum}${prec}`;

      return result;
    },
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
        showErrorPopup.apply(this, [err]);
      }
    },
    resetCreateAssetsForm() {
      this.$refs['createAssetsForm'].resetFields();
    },
  },
};
</script>
