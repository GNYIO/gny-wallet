<template>
  <el-main>
    <el-table :data="currentDelegates" stripe style="width: 100%">
      <el-table-column prop="rate" label="Rate" width="100"> </el-table-column>
      <el-table-column prop="username" label="Username" width="120">
      </el-table-column>
      <el-table-column prop="address" label="Address"> </el-table-column>
      <el-table-column
        prop="producedBlocks"
        label="Produced Blocks"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="rewards" label="Rewards" width="180">
      </el-table-column>
      <el-table-column prop="productivity" label="Productivity">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="20"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
  </el-main>
</template>

<script>
import * as client from '@gny/client';
const connection = new client.Connection(process.env['GNY_ENDPOINT'], process.env['GNY_PORT'], process.env['GNY_NETWORK']);
export default {
  data() {
    return {
      delegates: [],
      currentPage: 1,
      pageSize: 20,
      total: 101,
      currentDelegates: [],
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.changePage(this.delegates, currentPage);
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
      console.log(this.tempList);
    },
  },
  async mounted() {
    try {
      const delegates = (await connection.api.Delegate.getDelegates(null, 101))
        .delegates;
      this.delegates = delegates.map(delegate => ({
        address: delegate.address,
        username: delegate.username,
        producedBlocks: delegate.producedBlocks,
        rate: delegate.rate,
        rewards: Number(delegate.rewards) / 1e8,
        productivity: delegate.productivity + '%',
      }));
      this.handleCurrentChange(1);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style></style>
