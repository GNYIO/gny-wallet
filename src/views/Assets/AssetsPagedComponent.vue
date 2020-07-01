<template>
  <el-col :span="24">
    <div>
      <el-card>
        <div slot="header">
          All Assets (from all users)
        </div>
        <el-table :data="currentAssets" stripe style="width: 100%">
          <el-table-column
            prop="name"
            label="Name"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="precision"
            label="Precision"
            width="120"
          ></el-table-column>
          <el-table-column prop="maximumPretty" label="Maximum" width="150">
          </el-table-column>
          <el-table-column
            prop="quantityPretty"
            label="Already Issued Quantity"
          >
          </el-table-column>
          <el-table-column prop="leftToIssuePretty" label="Left to Issue">
          </el-table-column>
          <el-table-column prop="issuerId" label="Issuer"> </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="prev, pager, next"
            :total="assetsCount"
          ></el-pagination>
        </div>
      </el-card>
    </div>
  </el-col>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['prettyAssets', 'assetsCount']),
  },
  data() {
    return {
      currentAssets: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.changePage(this.prettyAssets, currentPage);
    },
    changePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.currentAssets = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.currentAssets.push(list[from]);
        }
      }
    },
  },
  mounted() {
    this.handleCurrentChange(1);
  },
};
</script>
