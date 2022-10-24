<template>
  <div>
    <button @click="handleWalletConnect">WalletConnect</button>
    <button @click="resetApp">resetApp</button>
    <button @click="approve">approve</button>
    <p>
      Address:
      {{ userAddress }}
    </p>
    <p>balance:{{ assets }}</p>
    <p>networkId: {{ networkId }}</p>
    <p>chainId: {{ chainId }}</p>
  </div>
</template>
<script setup>
import { toRaw } from 'vue';
import { ethers } from 'ethers'
import useWallet from '../hooks/useWallte';

const {
  onConnect,
  connected,
  web3,
  userAddress,
  chainId,
  networkId,
  resetApp,
  assets,
  getAccountAssets,
} = useWallet();

const handleWalletConnect = async () => {
  await onConnect();
  if (connected) {
    console.log('afterConnectdWallet', connected);
  }
};

const approve = () => {
  let tx = {
    from: userAddress.value,
    to: '0xb0eE1755460DdDb01F73104dF2E61a89b0464885',
    value: ethers.utils.parseEther('0.0001')
  }
  console.log(tx)
  console.log(web3.value)
  toRaw(web3.value).getSigner().sendTransaction(tx).then(async (transaction) => {
    console.dir(transaction)
    const receipt = await transaction.wait()
    alert("发送成功")
    console.log(receipt)
  }).catch(err => {
    console.log(err)
    if (err.message) {
      alert(err.message)
    }
  })
  // return contract.value.methods
  //   .approve(USDT_ADDRESS, utils.toHex(utils.toWei('1000000000000000000000000000', 'gwei')))
  //   .send({ from: userAddress.value });
}

// .....

</script>
