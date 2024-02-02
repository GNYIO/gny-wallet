import * as client from '@gny/client';
import { Notification, Loading } from 'element-ui';
import Web3 from 'web3';
import IERC20 from '../assets/ierc20_abi';
import Swapgate from '../assets/swapgate_abi';
import { BigNumber } from 'bignumber.js';



function correctChainId(chainId) {
  // either ETH (1) in production
  // or hardhat (31337) in development
  // or ETH SEPOLIA (11155111)
  const result =
      (
        process.env.NODE_ENV === 'production' &&
        chainId === 1
      )
      ||
      (
        process.env.NODE_ENV === 'development' &&
        chainId === 31337
      )
      ||
      (
        chainId === 11155111
      );
  return result;
}



export const sleep = (sec) => new Promise(resolve => setTimeout(resolve, sec * 1000));


// retries sending when not found in block
export async function trySending(trs, connection) {

    const isIncluded = async (tid) => {
        // console.log(`checking tid: ${tid} if included in block`);
        const result = await connection.api.Transaction.getTransactions({
            id: tid
        });
        if (result.transactions.length === 0) {
            // console.log(`tid: ${tid} has not been included in block`);
            return false;
        } else {
            console.log(`tid: ${tid} has been included in GNY block`);
            return true;
        }
    }

    const send = async (trs) => {
        // console.log(`trying sending trs ${trs.id}`);
        await connection.api.Transport.sendTransaction(trs);
    }


    while (await isIncluded(trs.id) === false) {
        await send(trs);

        const seconds = 22;
        // console.log(`waiting ${seconds} seconds for ${trs.id}`);
        await sleep(seconds);
    }
}
const connection = new client.Connection(
  process.env.VUE_APP_GNY_ENDPOINT,
  Number(process.env.VUE_APP_GNY_PORT),
  process.env.VUE_APP_GNY_NETWORK,
  JSON.parse(process.env.VUE_APP_HTTPS || false),
);
const getKeys = client.crypto.getKeys;

export const actions = {
  setLogin({ commit }, loggedIn) {
    commit('setLogin', loggedIn);
  },
  setUser({ commit }, user) {
    commit('setUser', user);
  },
  setLatestBlock({ commit }, block) {
    commit('setLatestBlock', block);
  },
  setPassphrase({ commit }, passphrase) {
    commit('setPassphrase', passphrase);
  },
  setSecondPassphrase({ commit }, secondPassphrase) {
    commit('setSecondPassphrase', secondPassphrase);
  },
  async refreshAccounts({ commit, state }) {
    try {
      const keys = getKeys(state.passphrase);
      const response = await connection.api.Account.openAccount(keys.publicKey);
      commit('setUser', response.account);
      commit('setLatestBlock', response.latestBlock);
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async refreshDelegateInfo({ commit, state }) {
    try {
      if (state.user.username && state.user.isDelegate === 1) {
        const result = await connection.api.Delegate.getDelegateByUsername(
          state.user.username,
        );
        if (result.success) {
          commit('setDelegateInfo', result.delegate);
        } else {
          commit('setDelegateInfo', result.delegate);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getMyVoters({ commit, state }) {
    try {
      if (state.user.username) {
        const result = await connection.api.Delegate.getVoters(
          state.user.username,
        );
        if (result.accounts) {
          commit('setMyVoters', result.accounts);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getAllDelegateNames({ commit }) {
    try {
      const countWrapper = await connection.api.Delegate.count();
      if (countWrapper.success === true) {
        const count = countWrapper.count;
        const all = [];
        for (let offset = 0; offset < count; offset += 100) {
          const part = await connection.api.Delegate.getDelegates(offset, 100);
          if (part.success) {
            all.push(...part.delegates);
          }
        }
        commit('setAllDelegateNames', all);
      } else {
        commit('setAllDelegateNames', []);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async refreshIsIssuer({ commit, state }) {
    try {
      const isIssuer = await connection.api.Uia.isIssuer(state.user.address);
      if (isIssuer.success === true) {
        commit('setIsIssuer', isIssuer.isIssuer);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getIssuer({ state, commit }) {
    try {
      if (state.isIssuer === true) {
        const result = await connection.api.Uia.getIssuer(state.user.address);
        if (result.success === true) {
          console.log(JSON.stringify(result.issuer, null, 2));
          commit('setIssuer', result.issuer);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getAssets({ commit }) {
    const count = await connection.api.Uia.getAssets();
    if (count.success === true) {
      const all = [];

      const howManyAssets = count.count;
      const limit = 100;
      for (let offset = 0; offset < howManyAssets; offset += limit) {
        const result = await connection.api.Uia.getAssets(limit, offset);
        if (result.success) {
          all.push(...result.assets);
        }
      }

      commit('setAssets', all);
    }
  },
  async getTransactions({ commit, state }) {
    try {
      let result = await connection.api.Transaction.getTransactions({
        senderId: state.user.address,
      });
      if (result.success === true) {
        const count = result.count;
        const all = [];

        for (let offset = 0; offset < count; offset += 100) {
          const result = await connection.api.Transaction.getTransactions({
            offset: offset,
            senderId: state.user.address,
          });
          if (result.success === true) {
            all.push(...result.transactions);
          }
        }
        commit('setTransactions', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getWhoIVotedFor({ commit, state }) {
    try {
      const address = state.user.address;

      if (address) {
        let result = await connection.api.Delegate.getOwnVotes({
          address,
        });

        if (result.success === true) {
          commit('setOwnVotes', result.delegates);
        } else {
          commit('setOwnVotes', []);
        }
      } else {
        commit('setOwnVotes', []);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getTransfers({ commit, state }) {
    try {
      const count = await connection.api.Transfer.getRoot({
        ownerId: state.user.address,
      });

      if (count.success === true) {
        const all = [];
        for (let offset = 0; offset < count.count; offset += 100) {
          const result = await connection.api.Transfer.getRoot({
            ownerId: state.user.address,
            limit: 100,
            offset: offset,
          });
          if (result.success === true) {
            all.push(...result.transfers);
          }
        }

        commit('setTransfers', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getBalances({ state, commit }) {
    try {
      const address = state.user.address;
      const count = await connection.api.Uia.getBalances(address);

      if (count.success === true) {
        const all = [];
        for (let offset = 0; offset < count.count; offset += 100) {
          const result = await connection.api.Uia.getBalances(
            address,
            100,
            offset,
          );
          if (result.success) {
            all.push(...result.balances);
          }
        }

        commit('setBalances', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },
  async getBurn({ commit }) {
    try {
      const count = await connection.api.Burn.getAll(100, 0);

      if (count.success === true) {
        const all = [];
        for (let offset = 0; offset < count.count; offset += 100) {
          const result = await connection.api.Burn.getAll(100, offset);
          if (result.success === true) {
            all.push(...result.burn);
          }
        }

        commit('setBurn', all);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },

  async getSupply({ commit }) {
    try {
      const raw = await connection.api.Block.getSupply();

      if (raw.success === true) {
        const result = {
          burned: raw.burned,
          supply: raw.supply,
        };

        commit('setSupply', result);
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message,
      });
    }
  },

  async setWeb3() {

    if (!window.ethereum) {
      Notification({
        message: 'could not find MetaMask',
        type: 'error',
        duration: 7 * 1000,
      });
      return false;
    }

    const web3 = new Web3(window.ethereum);

    window.web3 = web3;
    return true;

  },

  async connectToMetaMask({ commit }) {
    const web3 = window.web3;

    const chainId = await web3.eth.getChainId();

    if (!correctChainId(chainId)) {
      Notification({
        message: 'You need to use the ETH Chain in MetaMask!',
        type: 'error',
        duration: 10 * 1000,
      });
      return false;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
      Notification({
        message: 'Access to MetaMask not permitted',
        type: 'error',
        duration: 7 * 1000,
      });
      return false;
    }

    commit('setConnectedToMetaMask', true);
    commit('setIsCorrectChainId', true);

    return true;
  },

  async listenForMetaMaskChanges({ commit, dispatch }) {

    window.ethereum.on('accountsChanged', async (accounts) => {
        console.log(`MetaMask accounts changed: ${JSON.stringify(accounts, null, 2)}`);

        const newAccount = accounts[0];
        Notification({
          message: `Warning: Your connected wallet is now: "${newAccount}"`,
          type: 'warning',
          position: 'top-left',
          customClass: 'custom-notification-style', // class can be found in App.vue
          offset: 100,
        });

        await dispatch('queryMetaMask');
    });

    // sometimes users change the networks their are connected to in MetaMask
    window.ethereum.on('networkChanged', (newNetwork) => {
      console.log(`MetaMask networks changed: ${JSON.stringify(newNetwork, null, 2)}`);
      Notification({
        message: 'Warning: Your MetaMask network changed',
        type: 'warning',
        duration: 10 * 1000,
        position: 'top-left',
      });

      const correctChain = correctChainId(newNetwork);
      commit('setConnectedToMetaMask', correctChain);
    });

  },

  async queryMetaMask({ commit }) {
    const web3 = window.web3;

    const ETH_SWAPGATE_ADDRESS = process.env.VUE_APP_ETH_SWAPGATE_ADDRESS;
    const ETH_ERC20_ADDRESS = process.env.VUE_APP_ETH_ERC20_ADDRESS;

    Notification({
      message: 'Queried MetaMask',
      type: 'success',
      position:'top-left',
    });

    const accounts = await web3.eth.getAccounts();
    console.log(`first account: ${accounts[0]}`);
    const ethAddress = accounts[0];
    console.log(`ethAddress: ${ethAddress}`);
    commit('setEthAddress', ethAddress);


    // new
    console.log(`BSC_ERC20_ADDRESS: ${ETH_ERC20_ADDRESS}`);
    const gnyERC20Contract = new web3.eth.Contract(IERC20, ETH_ERC20_ADDRESS);
    console.log(gnyERC20Contract.methods.allowance);


    // this throws if not pointed to the correct address
    const currentAllowance = await gnyERC20Contract.methods.allowance(
      ethAddress,
      ETH_SWAPGATE_ADDRESS
    ).call();
    console.log(`currentAllowance: ${currentAllowance}`);
    commit('setAllowance', currentAllowance);


    const metaMaskBalance = await gnyERC20Contract.methods.balanceOf(
      ethAddress
    ).call();
    console.log(`metaMaskBalance: ${metaMaskBalance}`);
    commit('setMetaMaskBalance', metaMaskBalance);

  },

  async submitAllowance({ state, dispatch }, amount) {

    const ETH_SWAPGATE_ADDRESS = process.env.VUE_APP_ETH_SWAPGATE_ADDRESS;
    const ETH_ERC20_ADDRESS = process.env.VUE_APP_ETH_ERC20_ADDRESS;
    const web3 = window.web3;

    const ethAddress = state.ethAddress;

    // todo: show modal to explain why this needed

    // todo: show if allowance currently really smaller
    // if already bigger, stop and show success message

    // is the allowance as high as as the?
    console.log(`amount to approve: ${amount}`)

    // todo: show modal
    const gnyContract = new web3.eth.Contract(IERC20, ETH_ERC20_ADDRESS);
    const amount18 = new BigNumber(amount).multipliedBy(1e18).toFixed();


    let login = null;
    try {
      Notification({
        message: 'Please wait 15-20 seconds the transaction to confirm. Then press "refresh" to reload the data!',
        type: 'info',
        duration: 15 * 1000,
        position:'top-left',
      });

      login = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // approve amount
      await gnyContract.methods
        .approve(ETH_SWAPGATE_ADDRESS, amount18)
        .send({ from: ethAddress });

      await dispatch('queryMetaMask');

    } catch (err) {
      Notification({
        message: err.message,
        type: 'error',
        duration: 10 * 1000,
        position:'top-left',
      });
      console.log('error occured when trying to set allowance');
      console.log(err)
    }

    login.close();
  },

  async deposit({ state, dispatch }, amount) {

    // todo: first check again if balance is higher than "amount"
    // todo: then check if allowance is really higher

    // todo: show modal to explain user and user needs to agree

    // todo: has account enough GNY ERC20 to deposit?

    const ETH_SWAPGATE_ADDRESS = process.env.VUE_APP_ETH_SWAPGATE_ADDRESS;

    const ethAddress = state.ethAddress;

    const web3 = window.web3;
    const swapgateContract = new web3.eth.Contract(
      Swapgate,
      ETH_SWAPGATE_ADDRESS
    );

    const amount18 = new BigNumber(amount)
      .multipliedBy(1e18)
      .toFixed();
    console.log(`amountInBSC: ${amount18}`);

    // todo: use GNY address from form
    const myAddress = state.user.address;
    console.log(`my GNY address: ${myAddress}`);

    // const pendingTransactions = await web3.eth.getTransactionCount(
    //   this.ethAddress,
    //   'pending'
    // );
    // console.log(`pendingTransactions: ${pendingTransactions}`);


    let loading = null;
    try {
      Notification({
        message: 'Please wait 15-20 seconds the transaction to confirm. Then press "refresh" to reload the data!',
        type: 'info',
        duration: 25 * 1000,
        position:'top-left',
      });

      loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // deposit
      const res = await swapgateContract.methods
        .deposit(amount18, myAddress)
        .send({
          from: ethAddress,
        });

      console.log(`res: ${JSON.stringify(res, null, 2)}`);

      await dispatch('queryMetaMask');

    } catch (err) {
      Notification({
        message: err.message,
        type: 'error',
        duration: 10 * 1000,
      });
      console.log("error occured when depositing into Swapgate contract");
      console.error(err);
    }

    loading.close();
  },


  async mainnet2Eth({ state }, amount) {

    const SWAP_MAINNET_TO_ETH = process.env.VUE_APP_SWAP_MAINNET_TO_ETH;

    const passphrase = state.passphrase;
    const ethAddress = state.ethAddress;
    const secondPassphrase = state.secondPassphrase;

    const loading = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      const trs = client.basic.transfer(
        SWAP_MAINNET_TO_ETH,
        new BigNumber(amount).multipliedBy(1e8).toFixed(),
        ethAddress,
        passphrase,
        secondPassphrase
      );

      await trySending(trs, connection);

      loading.close();

      Notification({
        message: trs.id,
        type: 'success',
        position: 'top-left',
        duration: 15 * 1000,
        customClass: 'custom-notification-style', // class can be found in App.vue
      });
    } catch (err) {
      loading.close();

      Notification({
        message: err.message,
        type: 'error',
        position: 'top-left',
        duration: 10 * 1000,
        customClass: 'custom-notification-style', // class can be found in App.vue
      });
    }


  },

  resetState({ commit }) {
    commit('resetState');
  },
};
