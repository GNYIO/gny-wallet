<template>
  <el-card shadow="hover">
    <div slot="header">Who voted for me</div>

    <el-table :data="myVoters" stripe style="width: 100%" :height="250">
      <el-table-column prop="lockAmount" label="Lock Amount"></el-table-column>
      <el-table-column prop="weightRatio" label="weightRatio"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column prop="username" label="Username"> </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  props: {
    myVoters: Array,
  },
};
</script>

<style scoped>
.el-card {
  text-align: left;
}

.el-card {
  margin: 0 auto;
  margin-top: 20px;
  width: 500px;
}

</style>
