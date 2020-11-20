<template>
  <div>
    <title>Upload CVS DATA File</title>

    <br />

    <h1>run GNY ML Demos</h1>
    <br />

    <el-button type="primary" @click="runDemo">Run Demos</el-button>

    <br />
    <br />
    <h1>run plug-n-play ML contracts(new contracts added quarterly)</h1>
    <br />
    <el-button type="success" @click="runDemo"
      >Run GNY ML with your data</el-button
    >

    <br />
    <br />
    <h1>build custom GNY ML contracts with Jupyter Notebooks</h1>
    <br />
    <el-button type="danger" @click="runJupyter">
      Customize GNY ML with Jupyter</el-button
    >

    <br />
  </div>
</template>

<script>
export default {
  methods: {
    runDemo() {
      this.$router.push('/run_demo');
    },
    runMLContracts() {
      this.$router.push('/run_data');
    },
    runJupyter() {
      this.$router.push('/run_jupyter');
    },
  },
};
</script>
