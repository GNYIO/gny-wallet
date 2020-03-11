<template>
  <el-main>


    <!-- all assets -->
    <el-row :gutter="20">
      <AssetsPaged></AssetsPaged>
    </el-row>
  </el-main>
</template>

<script>
import { mapState } from 'vuex';
import AssetsPaged from './AssetsPaged';

export default {
  components: {
    AssetsPaged,
  },
  computed: {
    ...mapState(['isIssuer', 'assets']),
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('refreshIsIssuer');
    await this.$store.dispatch('getAssets');
  }
}
</script>
