<template>
  <el-col :span="12">
    <el-card v-if="user.isDelegate === 1" shadow="hover">
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
</template>

<script>
export default {
  props: {
    user: Object,
    delegate: Object,
  },
};
</script>
