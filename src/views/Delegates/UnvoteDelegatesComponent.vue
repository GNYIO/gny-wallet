<template>
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
</template>

<script>
import { showErrorPopup } from '../../helpers/errorDisplay';
import * as client from '@gnyio/client';
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);

export default {
  props: {
    whoIVotedFor: Array,
    user: Object,
    passphrase: String,
    secondPassphrase: String,
  },

  data() {
    return {
      hideUnvoteBadge: true,

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
    };
  },

  methods: {
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
        showErrorPopup.apply(this, [err]);
      }
    },
    resetUnvoteForm() {
      this.$refs['unvoteForm'].resetFields();
    },
  },
};
</script>
