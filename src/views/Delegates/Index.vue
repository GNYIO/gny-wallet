<template>
  <div>
    <el-row :gutter="20">
      <DelegateInfoComponent
        v-bind:user="user"
        v-bind:delegate="delegate"
      ></DelegateInfoComponent>

      <RegisterDelegateComponent
        v-bind:user="user"
        v-bind:passphrase="passphrase"
        v-bind:secondPassphrase="secondPassphrase"
      ></RegisterDelegateComponent>
    </el-row>

    <el-row :gutter="20">
      <WhoVotedForMeComponent
        v-bind:myVoters="myVoters"
      ></WhoVotedForMeComponent>

      <WhoIVotedForComponent
        v-bind:whoIVotedFor="whoIVotedFor"
      ></WhoIVotedForComponent>
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
          <DelegatesPagedComponent></DelegatesPagedComponent>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DelegateInfoComponent from './DelegateInfoComponent';
import RegisterDelegateComponent from './RegisterDelegateComponent';
import WhoVotedForMeComponent from './WhoVotedForMeComponent';
import WhoIVotedForComponent from './WhoIVotedForComponent';
import DelegatesPagedComponent from './DelegatesPagedComponent';

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
    DelegateInfoComponent,
    RegisterDelegateComponent,
    WhoVotedForMeComponent,
    WhoIVotedForComponent,
    DelegatesPagedComponent,
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
      hideUnvoteBadge: true,
      hideVoteBadge: true,

      position: 0,
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
