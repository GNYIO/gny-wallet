<template>
  <el-main>
    <h2>
      Learn how to run ML contracts using your own data by practicing with our
      Demos.
      <br />Each Demo shows the kind of data required, and the steps taken to
      successfully implement 3 different retail focused ML contracts.
    </h2>
    <br />
    <br />
    <h1>RETAIL DEMO</h1>
    <h2>Predict what will be my next top selling item</h2>

    <el-button type="primary" @click="runRetailDemo">Run Retail Demo</el-button>

    <br />
    <h1>LOCATION DEMO</h1>
    <h2>Predict what locations will sell the most inventory next month</h2>
    <el-button type="success" @click="runLocationDemo"
      >Run Location Demo</el-button
    >
    <br />
    <br />
    <h1>FRAUD DEMO</h1>
    <h2>Predict what transactions are frauds</h2>
    <el-button type="danger" @click="runFraudDemo">Run Fraud Demo</el-button>
    <br />
  </el-main>
</template>

<script>
export default {
  methods: {
    runRetailDemo() {
      this.$router.push('/run_retail_demo');
    },
    runLocationDemo() {
      this.$router.push('/run_location_demo');
    },
    runFraudDemo() {
      this.$router.push('/run_fraud_demo');
    },
  },
};
</script>
