<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card v-if="user.isDelegate === 1">
          <div slot="header">
            <span>Delegate Info</span>
          </div>

          <el-row>
            <el-col :span="12">
              <p><span>Delegate Name: <b>{{ user.username }}</b></span></p>
              <p><span>Approval: <b>{{ delegate.approval }}</b></span></p>
              <p><span>Fees (earned): <b>{{ delegate.fees }}</b></span></p>
              <p><span>Rewards (earned): <b>{{ delegate.rewards }}</b></span></p>
              <p><span>Produced Blocks: <b>{{ delegate.producedBlocks }}</b></span></p>
            </el-col>
            <el-col :span="12">
              <p><span>Missed Blocks: <b>{{ delegate.missedBlocks }}</b></span></p>
              <p><span>Rate (Position): <b>{{ delegate.rate }}</b></span></p>
              <p><span>Votes: <b>{{ delegate.votes }}</b></span></p>
              <p><span>Productivity <b>{{ delegate.productivity }}</b></span></p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="user.isDelegate === 0">
          <div slot="header">
            <span>Register</span>
          </div>

          <el-form ref="form" :model="form">
            <el-form-item>
              <el-button type="primary" @click="registerAsDelegate"
                >Register as Delegate</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>Who voted for me</span>
          </div>

          <el-table :data="myVoters" stripe style="width: 100%">
            <el-table-column
              prop="lockAmount"
              label="Lock Amount"
            ></el-table-column>
            <el-table-column
              prop="weightRatio"
              label="weightRatio"
            ></el-table-column>
            <el-table-column
              prop="address"
              label="Address"
            ></el-table-column>
            <el-table-column
              prop="username"
              label="Username">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div slot="header">
            Who I voted for
          </div>

          <el-table :data="whoIVotedFor" stripe style="width: 100%">
            <el-table-column
              prop="username"
              label="Username"
            ></el-table-column>
         </el-table>
        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" v-if="user.lockHeight == 0">
        <el-card>
          <h1>You can't vote, you need to first lock your account</h1>
          <span>
            <p>Lock your account here: </p>
            <router-link to="/home">Home</router-link>
          </span>
        </el-card>
      </el-col>

      <el-col :span="12" v-if="user.lockHeight > 0">
        <el-card>
          <div slot="header">
            <span>Vote for Delegates</span>
          </div>

          <el-form :ref="voteForm" :model="voteForm">
            <el-form-item>
              <el-select placeholder="select multiple delegates" clearable multiple v-model="voteForm.delegates">
                <el-option v-for="item in allDelegateNames"
                :key="item.username"
                :label="item.username"
                :value="item.username">
                <span style="float: left">{{item.username}}</span>
                <span style="float: right; margin-right: 2em">rank: {{item.rate}}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <button type="primary" @click="vote">Vote</button>
            </el-form-item>

          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <el-table :data="currentDelegates" stripe style="width: 100%">
            <el-table-column
              prop="rate"
              label="Rate"
              width="100"
            ></el-table-column>
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
            <el-table-column
              prop="approval"
              label="Approval">
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="20"
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import { mapState } from 'vuex';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env['GNY_ENDPOINT'],
  process.env['GNY_PORT'],
  process.env['GNY_NETWORK'],
);

export default {
  computed: {
    ...mapState(['user', 'passphrase', 'delegate', 'myVoters', 'allDelegateNames']),
  },
  data() {
    return {
      position: 0,
      form: {},
      voteForm: {
        delegates: []
      },
      delegates: [],
      currentPage: 1,
      pageSize: 20,
      total: 101,
      currentDelegates: [],
      whoIVotedFor: [],
    };
  },
  methods: {
    async vote() {
      try {
        const trs = client.basic.vote(this.voteForm.delegates, this.passphrase);
        await connection.api.Transport.sendTransaction(trs);
      } catch (err) {
        console.log(err);
      }
    },
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
    },
  },
  async mounted() {
    try {
      const response = await connection.api.Transaction.getTransactions({
        type: 4,
        senderId: this.user.address,
      });
      if (response.success === true) {
        const usernames = response.transactions
          .map(x => JSON.parse(x.args))
          .map(x => x[0])
          .map(x => ({ username: x }));
        console.log(`whoIVotedFor: ${JSON.stringify(usernames, null, 2)}`);
        this.whoIVotedFor = usernames;
      }

    } catch (err) {
      console.log(`error: ${JSON.stringify(err.response, null, 2)}`)
    }

    await this.$store.dispatch('getAllDelegateNames');
    await this.$store.dispatch('getMyVoters');
    await this.$store.dispatch('refreshDelegateInfo');

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
        approval: delegate.approval,
      }));
      this.handleCurrentChange(1);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
