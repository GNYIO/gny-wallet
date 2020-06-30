<template>
  <div>
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
  </div>
</template>

<script>
import { showErrorPopup } from '../../helpers/errorDisplay';
import * as client from '@gny/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  process.env.VUE_APP_HTTPS || false,
);

export default {
  props: {
    delegatesForWhichIHaveNotVotedYet: Array,
    user: Object,
    passphrase: String,
    secondPassphrase: String,
  },
  data() {
    return {
      hideVoteBadge: true,

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
        showErrorPopup.apply(this, [err]);
      }
    },

    resetVoteForm() {
      this.$refs['voteForm'].resetFields();
    },
  },
};
</script>
