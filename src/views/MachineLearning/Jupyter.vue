<template>
  <el-main>
     <h1>Customize GNY ML with Jupyter</h1>
<h2>
CUSTOMIZE YOUR GNY ML CONTRACTS
</h2>
<h3>
<br>
GNY is the world’s first decentralised machine learning platform catering to developers and enterprises. We use blockchain technology to deliver a secure, collaborative platform for machine learning, data capture and analysis.

<br>
<br>
We provide our users with hundreds of machine learning functions and contracts securely on chain (including data preparation). However, sometimes a user may wish to customize those contracts, or build them from scratch to better suit their needs. To allow users this flexibility we have integrated Jupyter Notebooks into the GNY WebWallet.

<br>
<br>
Jupyter Notebooks boast the ability to allow its users create and share documents that contain live code, equations, visualizations and narrative text. So users of the GNY platform will now have the option to begin with our plug-n-play contracts, modify them if needed, or even build contracts totally from scratch while still accessing the full power of our GNY Brain ML engine that incorporates:


<br>
<br>
The GNY Data Preparation API which includes the ability to:
<br>

    Rescale data.
<br>

    Standardize data.
<br>

    Normalize data.
<br>

    Binarize data.

<br>
    One Hot encode data
<br>

    Feature select data
<br>
<br>

GNY's exclusive data prep tech transforms your raw data, allowing your selected machine learning algorithm to reveal incredibly accurate insights, predictions, and results.

<br>

Our GNY Brain ML engine also incorporates:

<br>
The GNY Machine Learning Prediction API with 100 algorithms including:

<br>
    Regressions
<br>

    Classification
<br>

    Neural Nets

<br>
    Clustering
<br>

    Deep Learning

<br>
<br>
Our proprietary software helps select which algorithms provide the best correlations/ predictions results, and help deploy those results to guide future actions.
For this we have integrated Jupyter Notebooks into the GNY WebWallet. You can start with on our plug-n-play contracts and modify it, or build contracts from scratch while still accessing the full power of our GNY Brain ML engine.
<br>

<br>
<br>
Sign In to JupyterHub using your own username/password
<br>
<br>
You will see your JupyterHub admin screen
<br>
<br>
Click on New Terminal
<br>
<br>
You will see your New Terminal screen
<br>
<br>
Enter the command: python gny_retail_ml/gny_retail_ml.py
<br>
<br>
You will see the GNY Retail Machine Learning Code run:
<br>
<br>
Enter the command: python gny_retail_ml/gny_retail_ml.py
<br>
<br>
You will see you editing GNY Retail Machine Learning Code

<br>
</h3>

      <el-button type="danger" round>
        <a
          href="http://3.23.20.59:5000/get_jup_ins"
          download="jupyter instruction"
        >
          Get GNY ML with Jupyter User Guide</a
        ></el-button
      >
      <el-button type="danger" round>
        <a
          href="http://18.219.197.224/hub/login"
        >
          Customize GNY ML with Jupyter</a
        ></el-button
      >

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
