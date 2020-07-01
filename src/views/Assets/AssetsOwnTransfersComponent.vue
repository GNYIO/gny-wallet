<template>
  <el-col :span="24">
    <el-card>
      <div slot="header">
        Past Own Asset Transfers ({{ assetTransfersPrettyCount }})
      </div>

      <el-table
        :data="currentTransfers"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="senderId" label="Sender"></el-table-column>
        <el-table-column prop="recipientId" label="Recipient"></el-table-column>
        <el-table-column
          prop="currency"
          label="Currency"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="amount"
          label="Amount"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="height"
          label="Height"
          width="150"
        ></el-table-column>
        <el-table-column prop="message" label="message"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="prev, pager, next"
          :total="assetTransfersPrettyCount"
        ></el-pagination>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['user']),
    ...mapGetters(['assetTransfersPretty', 'assetTransfersPrettyCount']),
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
      this.changePage(this.assetTransfersPretty, currentPage);
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
    tableRowClassName({ row }) {
      if (row.senderId === this.user.address) {
        return 'warning-row';
      }

      if (row.recipientId === this.user.address) {
        return 'success-row';
      }
      return '';
    },
  },
  mounted() {
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
