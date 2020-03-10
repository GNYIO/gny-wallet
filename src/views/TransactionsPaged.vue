<template>
    <el-card>
      <div slot="header">
        <span>Transaction History</span>
      </div>
      <el-table stripe :data="currentTransactions" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="type" label="Contract Number" width="150"></el-table-column>
        <el-table-column label="Contract Name">
          <template slot-scope="scope">
            <div slot="reference">
              {{ scope.row.type | contractMapping }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="args" label="Args"></el-table-column>
        <el-table-column prop="height" label="height"></el-table-column>
        <el-table-column
          prop="message"
          label="Message"
          width="120"
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
import { contractMappingFilter } from '../filters/index';

export default {
  computed: {
    ...mapGetters(['transactionsNewestFirst', 'transactionsCount']),
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
  },
  async mounted() {
    this.handleCurrentChange(1);
  },
}
</script>
