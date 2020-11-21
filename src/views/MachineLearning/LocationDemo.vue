<template>
  <el-main>
    <title>Upload CVS DATA File</title>
    <div style="background-color: #5c89a8; color: white; padding: 20px">
      <h1>LOCATION DEMO</h1>
    </div>
    <h2>Predict locations of customers</h2>
    <br />
    <h3>
      The location of your customers using a multiobjective DBSCAN spatial
      clustering algorithm to find the optimal clusters using the spatial data
      collected in the sales area. We do Spatial Data Mining with a K-means
      algorithm that starts with a first group of randomly selected centroids,
      which are used as the beginning points for every cluster, and then
      performs iterative (repetitive) calculations to optimize the positions of
      the centroids. It halts creating and optimizing clusters when the
      centroids have stabilized — there is no change in their values because the
      clustering has been successful.
    </h3>
    <br />
    <h1>Step 1 : Download Example CSV</h1>

    <el-button type="primary" round>
      <a href="https://mlapi.gny.io/get_covid" download="retail_data">
        Download Example CSV</a
      ></el-button
    >

    <br />
    <h1>Step 2 : Upload CSV DATA File</h1>

    <el-form>
      <el-upload
        action="https://mlapi.gny.io/myupfiles_run_demo_data_location"
        :multiple="false"
        :on-change="handleChange"
        :limit="1"
        :auto-upload="true"
        :file-list="fileList"
        :http-request="uploadFiles"
      >
        <el-button slot="trigger" size="small" type="primary"
          >Click to upload</el-button
        >
        <!-- <el-button
        style="margin-left: 10px;"
        size="small"
        type="success"
        :plain="true"
        @click="onSubmit"
        >Upload</el-button
      > -->
        <div slot="tip" class="el-upload__tip">
          Your file must follow the GNY format.
        </div>
      </el-upload>
    </el-form>

    <br />
    <br />
    <h1>Step 3: Run ML Predictions - Automated</h1>

    <el-button type="danger" :plain="true" @click="runPrediction"
      >Run Predictions</el-button
    >

    <br />
    <div v-show="isRunPredictionClicked">
      <h1>Step 4 : Download Predictions CSV</h1>

      <el-button type="danger" round>
        <a
          href="https://mlapi.gny.io/get_pred_3_loc"
          download="prediction_data"
        >
          Get Predictions</a
        ></el-button
      >
    </div>

    <br />

    <el-button type="primary" round>
      <a href="https://mlapi.gny.io/get_loc_ins" download="retail_data">
        Get GNY ML Tech Notes</a
      ></el-button
    >
  </el-main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fileList: [],
      isFileSelected: true,
      isRunPredictionClicked: false,
    };
  },
  methods: {
    handleChange(file, fileList) {
      console.log('changed', fileList);
    },
    uploadFiles(fileList) {
      if (this.isFileSelected) {
        const formData = new FormData();
        // console.log('fileList', fileList.file);

        formData.append('file', fileList.file);

        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios({
          method: 'post',
          url: 'https://mlapi.gny.io/myupfiles_run_demo_data_location',
          data: formData,
        })
          .then(response => {
            this.$message({
              message:
                'Congratulations! You have uploaded your file successfully',
              type: 'success',
            });
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$message({
          message: 'You have to choose one file!',
          type: 'warning',
        });
      }
    },
    runPrediction() {
      this.isRunPredictionClicked = true;
      axios({
        method: 'get',
        url: 'https://mlapi.gny.io/run_pred_batch_2_loc',
      })
        .then(response => {
          this.$message({
            message: 'You can download your predictions now.',
            type: 'success',
          });
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>
