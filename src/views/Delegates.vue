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
                  >Productivity: <b>{{ delegate.productivity }}</b></span
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
              <el-badge
                value="100 GNY"
                type="info"
                @mouseover.native="hideRegisterDelegateBadge = false"
                @mouseleave.native="hideRegisterDelegateBadge = true"
                :hidden="hideRegisterDelegateBadge"
              >
                <el-button
                  type="primary"
                  @click="registerAsDelegate"
                  :disabled="alreadyDelegate"
                  >Register as Delegate</el-button
                >
              </el-badge>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-if="user.isDelegate === 0 && user.username === null">
          <h3>
            Set your username before registering as Delegate
          </h3>
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

          <el-table
            :data="whoIVotedFor"
            stripe
            style="width: 100%"
            :height="250"
          >
            <el-table-column
              prop="username"
              label="Username"
              width="90"
            ></el-table-column>
            <el-table-column
              prop="rate"
              label="Rank"
              width="80"
            ></el-table-column>
            <el-table-column prop="address" label="Address"></el-table-column>
            <el-table-column prop="approval" label="Approval"></el-table-column>
            <el-table-column
              prop="productivity"
              label="Productivity"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" v-if="user.lockHeight == 0">
        <el-card>
          <h3>You can't vote, you need to first lock your account</h3>
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

          <el-form
            ref="voteForm"
            :model="voteForm"
            :rules="voteFormRules"
            label-width="80px"
          >
            <el-form-item label="Del." prop="delegates">
              <el-tooltip
                effect="light"
                content="Delegates to vote for"
                placement="top-start"
              >
                <el-select
                  placeholder="select multiple delegates"
                  clearable
                  multiple
                  v-model="voteForm.delegates"
                  style="float: left; width:80%"
                >
                  <el-option
                    v-for="item in delegatesForWhichIHaveNotVotedYet"
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
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <div style="float: left">
                <el-badge
                  value="0.1 GNY"
                  type="info"
                  @mouseover.native="hideVoteBadge = false"
                  @mouseleave.native="hideVoteBadge = true"
                  :hidden="hideVoteBadge"
                >
                  <el-button type="primary" @click="vote">Vote</el-button>
                </el-badge>
              </div>
              <el-button
                @click="resetVoteForm"
                style="float: left; margin-left: 10px;"
                >Reset</el-button
              >
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

          <el-form
            ref="unvoteForm"
            :model="unvoteForm"
            :rules="unvoteFormRules"
            label-width="80px"
          >
            <el-form-item label="Del." prop="delegates">
              <el-tooltip
                effect="light"
                content="Delegates to unvote"
                placement="top-start"
              >
                <el-select
                  placeholder="select multiple delegates"
                  clearable
                  multiple
                  v-model="unvoteForm.delegates"
                  style="float: left; width:80%"
                >
                  <el-option
                    v-for="item in whoIVotedFor"
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
              </el-tooltip>
            </el-form-item>

            <el-form-item>
              <div style="float: left">
                <el-badge
                  value="0.1 GNY"
                  type="info"
                  @mouseover.native="hideUnvoteBadge = false"
                  @mouseleave.native="hideUnvoteBadge = true"
                  :hidden="hideUnvoteBadge"
                >
                  <el-button type="primary" @click="unvote">Unvote</el-button>
                </el-badge>
              </div>
              <el-button
                @click="resetUnvoteForm"
                style="float: left; margin-left: 10px;"
                >Unvote</el-button
              >
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
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

export default {
  components: {
    DelegatePaged,
  },
  computed: {
    ...mapState([
      'passphrase',
      'secondPassphrase',
      'delegate',
      'myVoters',
      'whoIVotedFor',
    ]),
    ...mapGetters([
      'user',
      'prettyDelegates',
      'delegatesForWhichIHaveNotVotedYet',
    ]),
  },
  data() {
    return {
      hideRegisterDelegateBadge: true,
      hideUnvoteBadge: true,
      hideVoteBadge: true,

      alreadyDelegate: false,

      position: 0,
      form: {},
      voteForm: {
        delegates: [],
      },
      voteFormRules: {
        delegates: [
          {
            required: true,
            message: 'Please select at least one delegate',
            trigger: 'change',
          },
        ],
      },
      unvoteForm: {
        delegates: [],
      },
      unvoteFormRules: {
        delegates: [
          {
            required: true,
            message: 'Please select at least one delegate',
            trigger: 'change',
          },
        ],
      },
      delegates: [],
    };
  },
  methods: {
    async vote() {
      try {
        await this.$refs['voteForm'].validate();
      } catch (err) {
        console.log(`validation for voteForm failed`);
        return;
      }

      try {
        const result = await connection.contract.Basic.vote(
          this.voteForm.delegates,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);

        this.$refs['voteForm'].resetFields();
      } catch (err) {
        console.log(err);
      }
    },
    resetVoteForm() {
      this.$refs['voteForm'].resetFields();
    },
    async unvote() {
      try {
        await this.$refs['unvoteForm'].validate();
      } catch (err) {
        console.log(`validation for unvoteForm failed`);
        return;
      }

      try {
        const result = await connection.contract.Basic.unvote(
          this.unvoteForm.delegates,
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);

        this.$refs['unvoteForm'].resetFields();
      } catch (err) {
        console.log(err);
      }
    },
    resetUnvoteForm() {
      this.$refs['unvoteForm'].resetFields();
    },
    async registerAsDelegate() {
      try {
        const result = await connection.contract.Basic.registerDelegate(
          this.passphrase,
          this.secondPassphrase,
        );
        this.$message(result.transactionId);

        this.alreadyDelegate = true;
      } catch (err) {
        console.log(err.message);
        console.log(err.response && err.response.data);
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('refreshAccounts');
    await this.$store.dispatch('getWhoIVotedFor');

    await this.$store.dispatch('getMyVoters');
    await this.$store.dispatch('refreshDelegateInfo');
  },
};
</script>

<style scoped>
.item {
  padding: 18px 18px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
