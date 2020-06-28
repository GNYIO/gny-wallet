<template>
  <div>
    <el-row :gutter="20" v-if="!isIssuer">
      <RegisterIssuerComponent
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
        v-bind:positiveBalance="positiveBalance"
      ></RegisterIssuerComponent>
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
      <CreateAssetsComponent
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></CreateAssetsComponent>

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

      <AssetBalancesComponent
        v-bind:prettyBalances="prettyBalances"
      ></AssetBalancesComponent>
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
import RegisterIssuerComponent from './Assets/RegisterIssuerComponent';
import CreateAssetsComponent from './Assets/CreateAssetsComponent';
import AssetBalancesComponent from './Assets/AssetBalancesComponent';

export default {
  components: {
    RegisterIssuerComponent,
    AssetsPaged,
    AssetTransfer,
    AssetsOwnTransfers,
    IssueAssetsComponent,
    CreateAssetsComponent,
    AssetBalancesComponent,
  },
  computed: {
    ...mapState(['isIssuer', 'issuer', 'passphrase', 'secondPassphrase']),
    ...mapGetters(['ownAssets', 'prettyBalances', 'positiveBalance']),
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
