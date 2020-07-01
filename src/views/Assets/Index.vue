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
      <IssuerInfoComponent v-bind:issuer="issuer"></IssuerInfoComponent>

      <OwnAssetsComponent v-bind:ownAssets="ownAssets"></OwnAssetsComponent>
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
      <AssetTransferComponent></AssetTransferComponent>

      <AssetBalancesComponent
        v-bind:prettyBalances="prettyBalances"
      ></AssetBalancesComponent>
    </el-row>

    <el-row :gutter="20">
      <AssetsOwnTransfersComponent></AssetsOwnTransfersComponent>
    </el-row>

    <el-row :gutter="20">
      <AssetsPagedComponent></AssetsPagedComponent>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AssetsPagedComponent from './AssetsPagedComponent';
import AssetTransferComponent from './AssetTransferComponent';
import AssetsOwnTransfersComponent from './AssetsOwnTransfersComponent';
import IssueAssetsComponent from './IssueAssetsComponent';
import RegisterIssuerComponent from './RegisterIssuerComponent';
import CreateAssetsComponent from './CreateAssetsComponent';
import AssetBalancesComponent from './AssetBalancesComponent';
import OwnAssetsComponent from './OwnAssetsComponent';
import IssuerInfoComponent from './IssuerInfoComponent';

export default {
  components: {
    RegisterIssuerComponent,
    AssetsPagedComponent,
    AssetTransferComponent,
    AssetsOwnTransfersComponent,
    IssueAssetsComponent,
    CreateAssetsComponent,
    AssetBalancesComponent,
    OwnAssetsComponent,
    IssuerInfoComponent,
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
