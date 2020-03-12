<template>
  <el-main>
    <el-row :gutter="20" v-if="!isIssuer">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            Register as Issuer
          </div>
          <el-form :ref="registerIssuerForm" :model="registerIssuerForm" label-width="80px">
            <el-form-item label="Name">
               <el-input v-model="registerIssuerForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Desc.">
              <el-input v-model="registerIssuerForm.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="registerIssuer" style="float: left;">Register Issuer</el-button>
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

          <p>Name: <b>{{ issuer.name }}</b></p>
          <p>Description: <b>{{ issuer.desc }}</b></p>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header">
            My Created Assets
          </div>
          <el-table stripe :data="ownAssets" style="width: 100%">
            <el-table-column prop="name" label="Asset Name">
            </el-table-column>
            <el-table-column prop="desc" label="Description">
            </el-table-column>
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

          <el-form :ref="createAssetsForm" :model="createAssetsForm" label-width="80px">
            <el-form-item label="Name">
              <el-input v-model="createAssetsForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Desc.">
              <el-input v-model="createAssetsForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="Precision">
              <el-input-number v-model="createAssetsForm.precision" :min="1" :max="10" style="float: left;"></el-input-number>
            </el-form-item>
            <el-form-item label="Maximum">
              <el-input v-model="createAssetsForm.maximum"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="createAsset" style="float: left;" type="primary">Create Asset</el-button>
            </el-form-item>
          </el-form>

        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header">
            Issue Assets
          </div>

          <el-form label-position="left" :ref="issueAssetsForm" :model="issueAssetsForm" label-width="80px">
            <el-form-item label="Asset">
              <el-select
                placeholder="select currency"
                clearable
                v-model="issueAssetsForm.currency"
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

              <el-form-item label="Amount">
                <el-input-number
                  v-model="issueAssetsForm.amount"
                  style="float: left; width: 300px"
                  :min="0">
                </el-input-number>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="issueAsset" style="float: left;">Issue Asset</el-button>
              </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <AssetTransfer></AssetTransfer>
      </el-col>
    </el-row>

    <!-- all assets -->
    <el-row :gutter="20">
      <AssetsPaged></AssetsPaged>
    </el-row>
  </el-main>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AssetsPaged from './AssetsPaged';
import AssetTransfer from './AssetTransfer';

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
  },
  data() {
    return {
      registerIssuerForm: {
        name: '',
        description: '',
      },
      createAssetsForm: {
        name: '',
        description: '',
        precision: 8,
        maximum: 1000000 * 1e8,
      },
      issueAssetsForm: {
        currency: '',
        amount: '',
      },
    };
  },
  computed: {
    ...mapState(['isIssuer', 'issuer', 'passphrase']),
    ...mapGetters(['ownAssets']),
  },
  methods: {
    async registerIssuer() {
      try {
        const name = this.registerIssuerForm.name;
        const description = this.registerIssuerForm.description;

        const trs = await connection.contract.Uia.registerIssuer(
          name,
          description,
          this.passphrase
        );

        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        console.log(err.message)
      }
    },
    async createAsset() {
      try {
        const name = this.createAssetsForm.name;
        const description = this.createAssetsForm.description;
        const maximum = String(this.createAssetsForm.maximum);
        const precision = Number(this.createAssetsForm.precision);

        const trs = await connection.contract.Uia.registerAsset(
          name,
          description,
          maximum,
          precision,
          this.passphrase,
        );

        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        console.log(err.response && err.response.data);
      }
    },
    async issueAsset() {
      try {
        const currency = this.issueAssetsForm.currency;

        const precision = Math.pow(10, this.issueAssetsForm.currency.precision);
        const amount = String(this.issueAssetsForm.amount * precision);

        console.log(`currency: ${currency}, amount: ${amount}`);

        const trs = client.uia.issue(
          currency,
          amount,
          this.passphrase
        );

        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        console.log(err.response && err.response.data);
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('refreshIsIssuer');
    await this.$store.dispatch('getIssuer');
    await this.$store.dispatch('getAssets');
  }
}
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
