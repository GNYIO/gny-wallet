<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        Balances
      </div>
      <el-table stripe :data="prettyBalances" style="width: 100%">
        <el-table-column prop="currency" label="Currency"></el-table-column>
        <el-table-column prop="balancePretty" label="Balance"></el-table-column>
      </el-table>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    prettyBalances: Array,
  },
};
</script>
