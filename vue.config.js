const Web3 = require('web3');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
};



const bscChainId = 56;

if (!Web3.utils.isAddress(process.env.VUE_APP_BSC_SWAPGATE_ADDRESS, bscChainId)) {
  console.error('env variable VUE_APP_BSC_SWAPGATE_ADDRESS is not a valid address');
  process.exit(1);
}

if (!Web3.utils.isAddress(process.env.VUE_APP_BSC_ERC20_ADDRESS, bscChainId)) {
  console.error('env variable VUE_APP_BSC_ERC20_ADDRESS is not a valid address');
  process.exit(1);
}



const ethChainId = 1;

