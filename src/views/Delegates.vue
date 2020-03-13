<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card v-if="user.isDelegate === 1">
          <div slot="header">
            <span>Delegate Info</span>
          </div>

          <el-row>
            <el-col :span="12">
              <p>
                <span
                  >Delegate Name: <b>{{ user.username }}</b></span
                >
              </p>
              <p>
                <span
                  >Approval: <b>{{ delegate.approval }}</b></span
                >
              </p>
              <p>
                <span
                  >Fees (earned): <b>{{ delegate.fees }}</b></span
                >
              </p>
              <p>
                <span
                  >Rewards (earned): <b>{{ delegate.rewards }}</b></span
                >
              </p>
              <p>
                <span
                  >Produced Blocks: <b>{{ delegate.producedBlocks }}</b></span
                >
              </p>
            </el-col>
            <el-col :span="12">
              <p>
                <span
                  >Missed Blocks: <b>{{ delegate.missedBlocks }}</b></span
                >
              </p>
              <p>
                <span
                  >Rate (Position): <b>{{ delegate.rate }}</b></span
                >
              </p>
              <p>
                <span
                  >Votes: <b>{{ delegate.votes }}</b></span
                >
              </p>
              <p>
                <span
                  >Productivity <b>{{ delegate.productivity }}</b></span
                >
              </p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="user.isDelegate === 0 && user.username !== null">
          <div slot="header">
            <span>Register Delegate</span>
          </div>

          <el-form ref="form" :model="form">
            <el-form-item>
              <el-button type="primary" @click="registerAsDelegate"
                >Register as Delegate</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-if="user.isDelegate === 0 && user.username === null">
          <h1>
            You need to first set your username before registering as Delegate
          </h1>
          <p>Lock your account here:</p>
          <router-link to="/home">Home</router-link>
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
            <el-table-column prop="address" label="Address"></el-table-column>
            <el-table-column prop="username" label="Username">
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
            <el-table-column prop="username" label="Username"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" v-if="user.lockHeight == 0">
        <el-card>
          <h1>You can't vote, you need to first lock your account</h1>
          <span>
            <p>Lock your account here:</p>
            <router-link to="/home">Home</router-link>
          </span>
        </el-card>
      </el-col>

      <!-- vote for delegates -->
      <el-col :span="12" v-if="user.lockHeight > 0">
        <el-card>
          <div slot="header">
            <span>Vote for Delegates</span>
          </div>

          <el-form :ref="voteForm" :model="voteForm" label-width="80">
            <el-form-item label="Delegates">
              <el-select
                placeholder="select multiple delegates"
                clearable
                multiple
                v-model="voteForm.delegates"
                style="float: left; width:80%"
              >
                <el-option
                  v-for="item in allDelegateNames"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                >
                  <span style="float: left">{{ item.username }}</span>
                  <span style="float: right; margin-right: 2em"
                    >rank: {{ item.rate }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="vote">Vote</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>


      <!-- unvote delegates -->
      <el-col :span="12" v-if="user.lockHeight > 0">
        <el-card>
          <div slot="header">
            <span>Unvote Delegates</span>
          </div>

          <el-form :ref="unvoteForm" :model="unvoteForm" label-width="80">
            <el-form-item label="Delegates">
              <el-select
                placeholder="select multiple delegates"
                clearable
                multiple
                v-model="unvoteForm.delegates"
                style="float: left; width:80%"
              >
                <el-option
                  v-for="item in allDelegateNames"
                  :key="item.username"
                  :label="item.username"
                  :value="item.username"
                >
                  <span style="float: left">{{ item.username }}</span>
                  <span style="float: right; margin-right: 2em"
                    >rank: {{ item.rate }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="unvote">Unvote</el-button>
            </el-form-item>
          </el-form>

        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <DelegatePaged></DelegatePaged>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DelegatePaged from './DelegatesPaged';
import { mapState, mapGetters } from 'vuex';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  process.env.VUE_APP_GNY_PORT,
  process.env.VUE_APP_GNY_NETWORK,
);

export default {
  components: {
    DelegatePaged,
  },
  computed: {
    ...mapState([
      'user',
      'passphrase',
      'delegate',
      'myVoters',
      'allDelegateNames',
      'whoIVotedFor',
    ]),
    ...mapGetters(['prettyDelegates']),
  },
  data() {
    return {
      position: 0,
      form: {},
      voteForm: {
        delegates: [],
      },
      unvoteForm: {
        delegates: [],
      },
      delegates: [],
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
    async unvote() {
      try {
        const trs = client.basic.unvote(this.unvoteForm.delegates, this.passphrase);
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
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getWhoIVotedFor');

    await this.$store.dispatch('getAllDelegateNames');
    await this.$store.dispatch('getMyVoters');
    await this.$store.dispatch('refreshDelegateInfo');
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
