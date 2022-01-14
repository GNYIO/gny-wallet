export function showErrorPopup(err) {
  const serverDown = 'The server seems to be down';
  const contractError =
    err && err.response && err.response.data && err.response.data.error;

  this.$message({
    message: contractError || serverDown,
    type: 'error',
  });
}
