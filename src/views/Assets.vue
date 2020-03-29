<template>
  <div>
    <el-row :gutter="20" v-if="!isIssuer">
      <el-col :span="12">
        <el-card v-if="!positiveBalance">
          <h3>You need 100 GNY to register as issuer</h3>
        </el-card>

        <el-card v-if="positiveBalance">
          <div slot="header">Register as Issuer</div>
          <el-form
            ref="registerIssuerForm"
            :model="registerIssuerForm"
            :rules="registerIssuerFormRules"
            label-width="80px"
          >
            <el-form-item label="Name" prop="name">
              <el-tooltip
                effect="light"
                content="Example: AAA"
                placement="top-start"
              >
                <el-input
                  v-model="registerIssuerForm.name"
                  :disabled="alreayRegisteredIssuer"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="Desc." prop="description">
              <el-tooltip
                effect="light"
                content="Description"
                placement="top-start"
              >
                <el-input
                  v-model="registerIssuerForm.description"
                  :disabled="alreayRegisteredIssuer"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="registerIssuer"
                style="float: left;"
                :disabled="alreayRegisteredIssuer"
                >Register Issuer</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="isIssuer">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            Issuer
          </div>

          <p>
            Name: <b>{{ issuer.name }}</b>
          </p>
          <p>
            Description: <b>{{ issuer.desc }}</b>
          </p>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header">
            My Created Assets
          </div>
          <el-table stripe :data="ownAssets" style="width: 100%">
            <el-table-column prop="name" label="Asset Name"> </el-table-column>
            <el-table-column prop="desc" label="Description"> </el-table-column>
            <el-table-column prop="leftToIssuePretty" label="Left to Issue">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="isIssuer">
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
              <el-tooltip
                effect="light"
                content="Precision"
                placement="top-start"
              >
                <el-input-number
                  v-model="createAssetsForm.precision"
                  :min="1"
                  :max="16"
                  style="float: left;"
                ></el-input-number>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="Maximum" prop="maximum">
              <el-tooltip
                effect="light"
                content="Maximum"
                placement="top-start"
              >
                <el-input v-model="createAssetsForm.maximum"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-button
                @click="createAsset"
                style="float: left;"
                type="primary"
                >Create Asset</el-button
              >
              <el-button @click="resetCreateAssetsForm" style="float: left;"
                >Reset</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

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
              <el-button type="primary" @click="issueAsset" style="float: left;"
                >Issue Asset</el-button
              >
              <el-button @click="resetIssueAsset" style="float: left"
                >Reset</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <AssetTransfer></AssetTransfer>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header">
            Balances
          </div>
          <el-table stripe :data="prettyBalances" style="width: 100%">
            <el-table-column prop="currency" label="Currency"></el-table-column>
            <el-table-column
              prop="balancePretty"
              label="Balance"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- own asset transfers -->
    <el-row :gutter="20">
      <el-col :span="24">
        <AssetsOwnTransfers></AssetsOwnTransfers>
      </el-col>
    </el-row>

    <!-- all assets -->
    <el-row :gutter="20">
      <el-col :span="24">
        <AssetsPaged></AssetsPaged>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AssetsPaged from './AssetsPaged';
import AssetTransfer from './AssetTransfer';
import AssetsOwnTransfers from './AssetsOwnTransfers';
import { BigNumber } from 'bignumber.js';

import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  process.env.VUE_APP_GNY_PORT,
  process.env.VUE_APP_GNY_NETWORK,
);

export default {
  components: {
    AssetsPaged,
    AssetTransfer,
    AssetsOwnTransfers,
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
      alreayRegisteredIssuer: false,

      registerIssuerForm: {
        name: '',
        description: '',
      },
      registerIssuerFormRules: {
        name: [
          {
            required: true,
            message: 'Please add a name',
            trigger: 'blur',
          },
          {
            type: 'string',
            pattern: /^[A-Za-z]{1,16}$/,
            trigger: 'change',
          },
        ],
        description: [
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
        maximum: [
          {
            required: true,
            message: 'Please add a maximum',
            trigger: 'blur',
          },
        ],
      },
      createAssetsForm: {
        name: '',
        desc: '',
        precision: 8,
        maximum: 1000000 * 1e8,
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
  computed: {
    ...mapState(['isIssuer', 'issuer', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['ownAssets', 'prettyBalances', 'positiveBalance']),
  },
  methods: {
    async registerIssuer() {
      try {
        const name = this.registerIssuerForm.name;
        const description = this.registerIssuerForm.description;

        const trs = await connection.contract.Uia.registerIssuer(
          name,
          description,
          this.passphrase,
          this.secondPassphrase,
        );

        this.$message(trs.transactionId);
        this.alreayRegisteredIssuer = true;
      } catch (err) {
        console.log(err.message);
      }
    },
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
        const maximum = String(this.createAssetsForm.maximum);
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
        console.log(err.response && err.response.data);
      }
    },
    resetIssueAsset() {
      this.$refs['issueAssetsForm'].resetFields();
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getTransfers');

    await this.$store.dispatch('refreshIsIssuer');
    await this.$store.dispatch('getIssuer');
    await this.$store.dispatch('getAssets');
    await this.$store.dispatch('getBalances');
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
