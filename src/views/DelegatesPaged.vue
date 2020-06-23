<template>
  <div>
    <el-table :data="currentDelegates" stripe style="width: 100%">
      <el-table-column prop="rate" label="Rank" width="100"></el-table-column>
      <el-table-column
        prop="username"
        label="Username"
        width="120"
      ></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column
        prop="producedBlocks"
        label="Produced Blocks"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="rewards"
        label="Rewards"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="productivity"
        label="Productivity"
      ></el-table-column>
      <el-table-column prop="approval" label="Approval"> </el-table-column>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['prettyDelegates', 'delegatesCount']),
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
  },
  async mounted() {
    await this.$store.dispatch('getAllDelegateNames');

    this.handleCurrentChange(1);
  },
};
</script>
