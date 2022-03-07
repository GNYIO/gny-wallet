<template>
  <div class="top">
    <el-card shadow="hover">
      <div slot="header">
        Past GNY Transfers
      </div>
      <el-table
        :data="currentTransfers"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="Sender">
          <template slot-scope="scope">
            <div slot="reference">
              {{ scope.row.senderId | prettyPrintMyAddress(user.address, 8) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Recipient">
          <template slot-scope="scope">
            <div slot="reference">
              {{
                scope.row.recipientId | prettyPrintMyAddress(user.address, 8)
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="currency" label="Currency"></el-table-column>
        <el-table-column prop="amount" label="Amount"></el-table-column>
        <el-table-column v-if="width >= 1040" prop="height" label="Height">
        </el-table-column>
        <el-table-column
          v-if="width >= 1040"
          prop="transactions.message"
          label="Message"
        >
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="prev, pager, next"
          :total="gnyTransfersPrettyCount"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { prettyPrintMyAddressFilter } from '../../filters/index';

export default {
  filters: {
    prettyPrintMyAddress: prettyPrintMyAddressFilter,
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['gnyTransfersPretty', 'gnyTransfersPrettyCount', 'width']),
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
      this.changePage(this.gnyTransfersPretty, currentPage);
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
  async mounted() {
    await this.$store.dispatch('getTransfers');

    this.handleCurrentChange(1);
  },
};
</script>

<style>
.top {
  margin: 0 auto;
  margin-top: 20px;
  width: 500px;
}

@media screen and (min-width: 1040px) {
  .top {
    width: 1000px;
  }
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.block {
  text-align: center;
}
</style>
