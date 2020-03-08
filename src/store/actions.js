import * as client from '@gny/client';
import {
  Notification
} from 'element-ui';

const connection = new client.Connection(process.env['GNY_ENDPOINT'], process.env['GNY_PORT'], process.env['GNY_NETWORK']);
const getKeys = client.crypto.getKeys;

export const actions = {
  setToken({
    commit
  }, token) {
    commit('setToken', token);
  },
  setUser({
    commit
  }, user) {
    commit('setUser', user);
  },
  setLatestBlock({
    commit
  }, block) {
    commit('setLatestBlock', block);
  },
  setPassphrase({
    commit
  }, passphrase) {
    commit('setPassphrase', passphrase);
  },
  async refreshAccounts({
    commit,
    state
  }) {
    try {
      const keys = getKeys(state.passphrase)
      const response = await connection.api.Account.openAccount(
        keys.publicKey
      );
      commit('setUser', response.account);
      commit('setLatestBlock', response.latestBlock)
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message
      });
    }
  },
  async refreshDelegateInfo({
    commit,
    state,
  }) {
    try {
      if (state.user.username) {
        const result = await connection.api.Delegate.getDelegateByUsername(state.user.username);
        if (result.success) {
          commit('setDelegateInfo', result.delegate);
        } else {
          throw new Error(result.error);
        }
      }

    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message
      })
    }
  },
  async getMyVoters({
    commit,
    state,
  }) {
    try {
      if (state.user.username) {
        const result = await connection.api.Delegate.getVoters(state.user.username);
        if (result.accounts) {
          commit('setMyVoters', result.accounts)
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      Notification({
        title: 'Error',
        message: err.message
      });
    }
  },
  async getAllDelegateNames({
    commit,
  }) {
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
        message: err.message
      });
    }
  },
  async refreshIsIssuer({
    commit
  }) {
    const isIssuer = await connection.api.Uia.isIssuer(this.user.address);
    if (isIssuer.success === true) {
      commit('setIsIssuer', isIssuer.isIssuer);

      if (isIssuer.isIssuer === true) {
        const issuer = await connection.api.Uia.getIssuer(this.user.username);
        if (issuer.success === true) {
          commit('setIssuer', issuer.issuer);
        }
      }
    }
  },
  async refreshAssets({
    commit
  }) {
    const count = await connection.api.Uia.getAssets();
    if (count.success === true) {
      const allAssets = [];

      const howManyAssets = count.count;
      const limit = 100;
      for (let offset = 0; offset < howManyAssets; offset += limit) {
        const result = await connection.api.Uia.getAssets(limit, offset);
        if (result.success) {
          allAssets.push(...result.assets);
        }
      }

      commit('setAssets', allAssets);
    }
  },
  async getTransactions({
    commit,
    state
  }) {
    const result = await connection.api.Transaction.getTransactions({
      senderId: state.user.address,
    });
    if (result.success === true) {
      const transactions = result.transactions;
      commit('setTransactions', transactions);
    }
  },
  async getWhoIVotedFor({
    commit,
    state
  }) {
    try {
      const response = await connection.api.Transaction.getTransactions({
        type: 4,
        senderId: state.user.address,
      });
      if (response.success === true) {
        const usernames = response.transactions
          .map(x => JSON.parse(x.args))
          .map(x => x[0])
          .map(x => ({ username: x }));

        commit('setWhoIVotedFor', usernames);
      }
    } catch(err) {
      Notification({
        title: 'Error',
        message: err.message
      });
    }
  },
};
