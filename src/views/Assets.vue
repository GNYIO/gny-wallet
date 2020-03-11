<template>
  <el-main>


    <!-- all assets -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>

        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import { mapState } from 'vuex';

export default {
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
