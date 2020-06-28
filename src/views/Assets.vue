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
              <div style="float: left;">
                <el-badge
                  value="100 GNY"
                  type="info"
                  @mouseover.native="hideRegisterIssuerBadge = false"
                  @mouseleave.native="hideRegisterIssuerBadge = true"
                  :hidden="hideRegisterIssuerBadge"
                >
                  <el-button
                    type="primary"
                    @click="registerIssuer"
                    :disabled="alreayRegisteredIssuer"
                    >Register Issuer</el-button
                  >
                </el-badge>
              </div>
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

      <IssueAssetsComponent
        v-bind:ownAssets="ownAssets"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></IssueAssetsComponent>
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
import IssueAssetsComponent from './Assets/IssueAssetsComponent';
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
    AssetsPaged,
    AssetTransfer,
    AssetsOwnTransfers,
    IssueAssetsComponent,
  },
  data() {
    return {
      hideRegisterIssuerBadge: true,
      hideCreateAssetBadge: true,

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
