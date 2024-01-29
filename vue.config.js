const Web3 = require('web3');
const bs58 = require('bs58');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
};



// copied here because of ESM issue
function isGNYAddress(address) {
  if (typeof address !== 'string') {
      return false;
  }
  try {
      if (address.length === 0) {
          return false;
      }
      if (!bs58.decode(address.slice(1))) {
          return false;
      }
      const checkLength = bs58.decode(address.slice(1));
      if (checkLength.length !== 20) {
          return false;
      }
  }
  catch (err) {
      return false;
  }
  if (address[0] !== 'G') {
      return false;
  }
  return true;
}



const ethChainId = 1;


if (!isGNYAddress(process.env.VUE_APP_SWAP_MAINNET_TO_ETH)) {
  console.error('env variable VUE_APP_SWAP_MAINNET_TO_ETH is not a valid GNY address');
  process.exit(1);
}

if (!Web3.utils.isAddress(process.env.VUE_APP_ETH_ERC20_ADDRESS, ethChainId)) {
  console.error('env variable VUE_APP_ETH_ERC20_ADDRESS is not a valid ETH address');
  process.exit(1);
}

if (!Web3.utils.isAddress(process.env.VUE_APP_ETH_SWAPGATE_ADDRESS, ethChainId)) {
  console.error('env variable VUE_APP_ETH_SWAPGATE_ADDRESS is not a valid ETH address');
  process.exit(1);
}


