<template>
  <el-main>
    <div>
    <el-card class="box-card1">
      <div slot="header">
        <span>Delegate Info</span>
      </div>

      <div v-if="user.isDelegate === 1">
        <p>Delegate Name: {{ user.username }}</p>
        <p>Approval: {{delegate.approval }}</p>
        <p>Fees (earned): {{ delegate.fees }}</p>
        <p>Rewards (earned): {{ delegate.rewards }}</p>
        <p>Produced Blocks: {{ delegate.producedBlocks }}</p>
        <p>Missed Blocks: {{ delegate.missedBlocks }}</p>
        <p>Rate (Position): {{ delegate.rate }} </p>
        <p>Votes: {{ delegate.votes }}</p>
        <p>Productivity {{ delegate.productivity }} </p>
      </div>


    </el-card>

    <el-card class="box-card1" v-if="user.isDelegate === 0">
      <div slot="header">
        <span>Register</span>
      </div>

      <el-form ref="form" :model="form" >
        <el-form-item>
          <el-button type="primary" @click="registerAsDelegate">Register as Delegate</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card2">
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
    </el-card>
    </div>
  </el-main>
</template>

<script>
import { mapState } from 'vuex';
import * as client from '@gny/client';
import { Notification } from 'element-ui';
const connection = new client.Connection(process.env['GNY_ENDPOINT'], process.env['GNY_PORT'], process.env['GNY_NETWORK']);

export default {
  computed: {
    ...mapState(['user', 'passphrase', 'delegate']),
  },
  data() {
    return {
      position: 0,
      form: {
      },
      delegates: [],
      currentPage: 1,
      pageSize: 20,
      total: 101,
      currentDelegates: [],
    };
  },
  methods: {
    async registerAsDelegate() {
      try {
        const trs = client.basic.registerDelegate(this.passphrase);
        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        console.log(err);
      }
    },
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
      await this.$store.dispatch('refreshDelegateInfo')
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
        type: 'error'
      });
    }

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

<style scoped>

.box-card1 {
  margin: 18px 18px;
  padding: 18px 18px;
  width: 480px;
  float: left;
}

.box-card2 {
  margin: 18px 18px;
  padding: 18px 18px;
  width: 100%;
  float: left;
}
</style>
