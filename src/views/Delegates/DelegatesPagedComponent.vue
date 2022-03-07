<template>
  <el-card shadow="hover">
    <div class="header" slot="header">
      All Delegates
    </div>

    <el-table :data="currentDelegates" stripe style="width: 100%">
      <el-table-column prop="rate" label="Rank" width="60"></el-table-column>
      <el-table-column
        prop="username"
        label="Username"
        width="130"
      ></el-table-column>
      <el-table-column prop="address" label="Address" :formatter="subAddress"></el-table-column>
      <el-table-column
        prop="producedBlocks"
        label="Produced Blocks"
      ></el-table-column>
      <el-table-column
        prop="missedBlocks"
        label="Missed Blocks"
        width="80"
      ></el-table-column>
      <el-table-column
        v-if="width >= 1040"
        prop="rewards"
        label="Rewards"
      ></el-table-column>
      <el-table-column
        v-if="width >= 1040"
        prop="productivity"
        label="Productivity"
      ></el-table-column>
      <el-table-column v-if="width >= 1040" prop="approval" label="Approval"> </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="20"
        layout="prev, pager, next"
        :total="delegatesCount"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { prettyPrintMyAddressFilter } from '../../filters/index';

export default {
  filters: {
    prettyPrintMyAddress: prettyPrintMyAddressFilter,
  },
  computed: {
    ...mapGetters(['prettyDelegates', 'delegatesCount', 'width']),
  },
  data() {
    return {
      currentDelegates: [],
      currentPage: 1,
      pageSize: 20,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.changePage(this.prettyDelegates, currentPage);
    },
    changePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.currentDelegates = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.currentDelegates.push(list[from]);
        }
      }
    },
    subAddress: function (row) {
      return row.address.slice(0,8);
    },
  },
  async mounted() {
    await this.$store.dispatch('getAllDelegateNames');

    this.handleCurrentChange(1);
  },
};
</script>

<style scoped>
.header {
  text-align: left;
}

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

</style>
