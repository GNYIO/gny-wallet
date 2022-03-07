<template>
  <el-card shadow="hover">
    <div slot="header">
      Who I voted for
    </div>

    <el-table :data="whoIVotedFor" stripe style="width: 100%" :height="250">
      <el-table-column
        prop="username"
        label="Username"
        width="90"
      ></el-table-column>
      <el-table-column prop="rate" label="Rank" width="80"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column prop="approval" label="Approval"></el-table-column>
      <el-table-column
        prop="productivity"
        label="Productivity"
      ></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  props: {
    whoIVotedFor: Array,
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
