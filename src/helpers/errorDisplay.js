export function showErrorPopup(err) {
  const serverDown = 'The server seems to be down';
  const contractError =
    err && err.response && err.response.data && err.response.data.error;
  let lockError = undefined;

  if (typeof contractError === 'string' && contractError.includes('Lock name')) {
    lockError = 'Already a transaction in this block';
  }

  this.$message({
    message: lockError || contractError || serverDown,
    type: 'error',
  });
}
