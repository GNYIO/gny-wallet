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
          <el-table stripe :v-model="ownAssets" style="width: 100%">
            <el-table-column prop="name" label="Name">
            </el-table-column>
          </el-table>
        </el-card>
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

import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  process.env.VUE_APP_GNY_PORT,
  process.env.VUE_APP_GNY_NETWORK,
);

export default {
  components: {
    AssetsPaged,
  },
  data() {
    return {
      registerIssuerForm: {
        name: '',
        description: '',
      },
    };
  },
  computed: {
    ...mapState(['isIssuer', 'issuer', 'passphrase']),
    ...mapGetters(['ownAsssets']),
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
