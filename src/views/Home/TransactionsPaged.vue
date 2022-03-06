<template>
  <el-card shadow="hover">
    <div class="header" slot="header">Transaction History</div>
    <el-table stripe :data="currentTransactions">
      <el-table-column width="100" prop="id" label="ID" :formatter="subID"></el-table-column>
      <el-table-column
        prop="type"
        label="Contract Nr"
      ></el-table-column>
      <el-table-column label="Contract Name">
        <template slot-scope="scope">
          <div slot="reference">
            {{ scope.row.type | contractMapping }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="width >= 1040" prop="args" label="Contract Arguments"></el-table-column>
      <el-table-column v-if="width >= 1040" prop="height" label="height"></el-table-column>
      <el-table-column
        prop="message"
        label="Message"
        v-if="width >= 1040"
      ></el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="prev, pager, next"
        :total="transactionsCount"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { contractMappingFilter } from '../../filters/index';

export default {
  computed: {
    ...mapGetters(['transactionsNewestFirst', 'transactionsCount', 'width']),
  },
  filters: {
    contractMapping: contractMappingFilter,
  },
  data() {
    return {
      currentTransactions: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.changePage(this.transactionsNewestFirst, currentPage);
    },
    changePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.currentTransactions = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.currentTransactions.push(list[from]);
        }
      }
    },
    subID: function (row) {
      return row.id.slice(0,8);
    },
  },
  mounted() {
    // this component is a child component of Home.vue
    // this component must load after the parent component Home.vue
    // therefore this.$nextTick
    this.$nextTick(async () => {
      console.log('starting TransactionsPaged');

      await this.$store.dispatch('getTransactions');
      this.handleCurrentChange(1);

      console.log('Finished rendering TransactionsPaged');
    });
  },
};
</script>

<style scoped>
.el-card {
  text-align: center;
}

.el-card {
  margin: 0 auto;
  margin-top: 20px;
  width: 500px;
}

@media screen and (min-width: 1040px) {
  .el-card {
    width: 1000px;
  }
}

.header {
  text-align: left;
}
</style>
