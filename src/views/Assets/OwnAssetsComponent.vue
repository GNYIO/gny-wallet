<template>
  <el-col :span="12">
    <el-card>
      <div slot="header">
        My Created Assets
      </div>
      <el-table stripe :data="ownAssets" style="width: 100%">
        <el-table-column prop="name" label="Asset Name"> </el-table-column>
        <el-table-column prop="desc" label="Description"> </el-table-column>
        <el-table-column prop="leftToIssuePretty" label="Left to Issue">
        </el-table-column>
      </el-table>
    </el-card>
  </el-col>
</template>

<script>
export default {
  props: {
    ownAssets: Array,
  },
};
</script>
