<template>
  <div>
    <el-card>
      <div slot="header">
        Past Transfers
      </div>
      <el-table :data="currentTransfers" stripe style="width: 100%">
        <el-table-column
          prop="senderId"
          label="Sender">
        </el-table-column>
        <el-table-column
          prop="recipientId"
          label="Recipient">
        </el-table-column>
        <el-table-column
          prop="currency"
          label="Currency"
        ></el-table-column>
        <el-table-column
          prop="amount"
          label="Amount"
        ></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="prev, pager, next"
          :total="transfersCount"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['transfersPretty', 'transfersCount']),
  },
  data() {
    return {
      currentTransfers: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.changePage(this.transfersPretty, currentPage);
    },
    changePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.currentTransfers = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.currentTransfers.push(list[from]);
        }
      }
    },
  },
  async mounted() {
    this.handleCurrentChange(1);
  },
}
</script>
