<template>
  <div>
    <el-card>
      <div slot="header">
        Past GNY Burnings
      </div>
      <el-table
        :data="currentBurn"
        style="width: 100%"
      >
        <el-table-column label="Sender" width="300">
          <template slot-scope="scope">
            <div slot="reference">
              {{ scope.row.senderId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Amount"></el-table-column>
        <el-table-column prop="height" label="Height"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="prev, pager, next"
          :total="burnPrettyCount"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
    ...mapGetters(['burnPretty', 'burnPrettyCount' ]),
  },
  data() {
    return {
      currentBurn: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.changePage(this.burnPretty, currentPage);
    },
    changePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.currentBurn = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.currentBurn.push(list[from]);
        }
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('getBurn');

    this.handleCurrentChange(1);
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
