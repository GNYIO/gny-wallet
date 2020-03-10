<template>
    <el-card>
      <div slot="header">
        <span>Transaction History</span>
      </div>
      <el-table stripe :data="transactionsNewestFirst" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="type" label="Contract Number" width="150"></el-table-column>
        <el-table-column label="Contract Name">
          <template slot-scope="scope">
            <div slot="reference">
              {{ scope.row.type | contractMapping }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="args" label="Args"></el-table-column>
        <el-table-column prop="height" label="height"></el-table-column>
        <el-table-column
          prop="message"
          label="Message"
          width="120"
        ></el-table-column>
      </el-table>
    </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { contractMappingFilter } from '../filters/index';

export default {
  computed: {
    ...mapGetters(['transactionsNewestFirst']),
  },
  filters: {
    contractMapping: contractMappingFilter,
  },
}
</script>
