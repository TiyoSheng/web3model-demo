import {
  ref, reactive, getCurrentInstance, toRefs, toRaw
} from 'vue';
import { ethers } from 'ethers'
import Web3Modal from 'web3modal';
import { getChainData } from '@/web3/tools';
import { providerOptions } from '@/web3/config';

const INITIAL_STATE = {
  web3: null,
  provider: null,
  userAddress: '',
  connected: false,
  chainId: 1,
  networkId: 1,
};
export default function UseWallet() {
  const { ctx: that } = getCurrentInstance();

  const walletObj = reactive({ ...INITIAL_STATE });
  const fetching = ref(false);
  const assets = ref(0);
  //https://github.com/Web3Modal/web3modal#web3modal
  const web3Modal = new Web3Modal({
    theme: 'dark',
    network: getChainData(toRaw(walletObj.chainId)).network,
    cacheProvider: false,
    providerOptions,
  });
  // methods wallte.js
  const resetApp = async () => {
    const { web3 } = toRaw(walletObj);
    localStorage.clear();
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }

    web3Modal.clearCachedProvider();
    assets.value = 0;
    Object.keys(INITIAL_STATE).forEach((e) => {
      walletObj[e] = INITIAL_STATE[e];
    });
    that.$forceUpdate();
  };

  const getUserBalance = () => {
    return toRaw(walletObj.web3).getBalance(toRaw(walletObj.userAddress)).then((res) => {
      return (res ? ethers.utils.formatEther(res) : 0)
    });
  }

  const getAccountAssets = async () => {
    fetching.value = true;
    // get account balances
    assets.value = await getUserBalance();
  };
  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts) => {
      // eslint-disable-next-line prefer-destructuring
      walletObj.userAddress = accounts[0];
      await getAccountAssets();
    });
    provider.on('chainChanged', async (chainId) => {
      console.log('333', chainId);
      walletObj.chainId = chainId;
      walletObj.networkId = chainId;
      onConnect()
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    await subscribeProvider(provider);
    let web3 = new ethers.providers.Web3Provider(provider);
    let accounts = await web3.listAccounts()
    const address = accounts[0];
    let network = await web3.getNetwork()
    console.log(network)
    walletObj.web3 = web3;
    walletObj.provider = provider;
    walletObj.connected = true;
    walletObj.userAddress = address;
    walletObj.chainId = network.chainId;
    walletObj.networkId = network.chainId;
    await getAccountAssets();
  };

  return {
    ...toRefs(walletObj),
    fetching,
    assets,
    resetApp,
    getAccountAssets,
    //
    web3Modal,
    // methods
    onConnect,
  };
}
