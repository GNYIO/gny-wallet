<template>
  <el-main>


    <!-- all assets -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>Who voted for me</span>
          </div>

          <el-table :data="assets" stripe style="width: 100%">
            <el-table-column
              prop="lockAmount"
              label="Lock Amount"
            ></el-table-column>
          </el-table>

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
    await this.$store.dispatch('refreshIsIssuer');
    await this.$store.dispatch('getAssets');
  }
}
</script>
