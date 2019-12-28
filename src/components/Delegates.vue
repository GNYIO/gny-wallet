<template>
  <el-table :data="delegates" stripe style="width: 100%">
    <el-table-column prop="rate" label="Rate" width="100"> </el-table-column>
    <el-table-column prop="username" label="Username" width="120">
    </el-table-column>
    <el-table-column prop="address" label="Address"> </el-table-column>
    <el-table-column prop="producedBlocks" label="Produced Blocks" width="180">
    </el-table-column>
    <el-table-column prop="rewards" label="Rewards" width="180">
    </el-table-column>
    <el-table-column prop="productivity" label="Productivity">
    </el-table-column>
  </el-table>
</template>

<script>
import { Connection } from '@gny/client';
const connection = new Connection('192.168.1.252', 4096, 'testnet');
export default {
  data() {
    return {
      delegates: []
    };
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
        productivity: delegate.productivity + '%'
      }));
      console.log('delegates', this.delegates);
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style></style>
