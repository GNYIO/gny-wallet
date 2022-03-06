<template>
  <el-col :span="12">
    <el-card shadow="hover">
      <div slot="header">
        <span>Who voted for me</span>
      </div>

      <el-table :data="myVoters" stripe style="width: 100%" :height="250">
        <el-table-column
          prop="lockAmount"
          label="Lock Amount"
        ></el-table-column>
        <el-table-column
          prop="weightRatio"
          label="weightRatio"
        ></el-table-column>
        <el-table-column prop="address" label="Address"></el-table-column>
        <el-table-column prop="username" label="Username"> </el-table-column>
      </el-table>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    myVoters: Array,
  },
};
</script>
