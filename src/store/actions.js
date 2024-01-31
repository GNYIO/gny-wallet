import * as client from '@gny/client';
import { Notification } from 'element-ui';
import Web3 from 'web3';
import IERC20 from '../assets/ierc20_abi';



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

  async listenForMetaMaskChanges({ commit }) {

    // this change does **NOT** get propagated to the VUE app
    window.ethereum.on('accountsChanged', (accounts) => {
        // Time to reload your interface with accounts[0]!

        console.log(`MetaMask accounts changed: ${JSON.stringify(accounts, null, 2)}`);
        // Notification({
        //   message: 'Warning: Your MetaMask wallet changed',
        //   type: 'error',
        //   duration: 10 * 1000,
        // });

        // this.isConnected = false;

    });

    // sometimes users change the networks their are connected to in MetaMask
    window.ethereum.on('networkChanged', (newNetwork) => {
      console.log(`MetaMask networks changed: ${JSON.stringify(newNetwork, null, 2)}`);
      Notification({
        message: 'Warning: Your MetaMask network changed',
        type: 'warning',
        duration: 10 * 1000,
      });

      commit('setIsCorrectChainId', false);
    });

  },

  async queryMetaMask({ commit }) {
    const web3 = window.web3;
    console.log(`typeof web3: ${typeof web3}`);
    const ETH_SWAPGATE_ADDRESS = process.env.VUE_APP_ETH_SWAPGATE_ADDRESS;
    const ETH_ERC20_ADDRESS = process.env.VUE_APP_ETH_ERC20_ADDRESS;


    Notification({
      message: 'Queried MetaMask',
      type: 'success',
    });

    const accounts = await web3.eth.getAccounts();
    console.log(`first account: ${accounts[0]}`);
    const ethAddress = accounts[0];
    console.log(`ethAddress: ${ethAddress}`);


    // new
    console.log(`BSC_ERC20_ADDRESS: ${ETH_ERC20_ADDRESS}`);
    const gnyBEP20Contract = new web3.eth.Contract(IERC20, ETH_ERC20_ADDRESS);
    console.log(gnyBEP20Contract.methods.allowance);


    // this throws if not pointed to the correct address
    const currentAllowance = await gnyBEP20Contract.methods.allowance(
      ethAddress,
      ETH_SWAPGATE_ADDRESS
    ).call();
    console.log(`currentAllowance: ${currentAllowance}`);
    commit('setAllowance', currentAllowance);


    const metaMaskBalance = await gnyBEP20Contract.methods.balanceOf(
      ethAddress
    ).call();
    console.log(`metaMaskBalance: ${metaMaskBalance}`);
    commit('setMetaMaskBalance', metaMaskBalance);

  },


  resetState({ commit }) {
    commit('resetState');
  },
};
