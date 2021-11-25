import create from 'zustand'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import { FC } from 'preact/compat'
import { useEffect } from 'react'
// supported CHAINIDS
// let supportedChainIds = [1, 3, 4, 5, 42, 56, 97, 1337]

const RPC_URLS: { [chainId: number]: string } = {
  1: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
  4: 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213'
}


type EthersState = {
  metamask: () => void
  walletConnect: () => void
  provider?: ethers.providers.Web3Provider
  account?: string
  deactivate: () => void
  isMetaMaskInstalled: () => boolean
  chainId: number
  setChainId: (chainId: number) => void
  setAccount: (account: string) => void
}

export const useEthers = create<EthersState>((set, get) => ({
  chainId: 1, // mainnet
  setAccount: (account) => set({ account }),
  setChainId: (chainId) => set({ chainId }),
  isMetaMaskInstalled: () =>
    // @ts-ignore
    Boolean(window.ethereum && window.ethereum.isMetaMask),
  metamask: async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const addrs = await signer.getAddress()
    const network = await provider.getNetwork()
    const chainId = network.chainId
    // console.log(addrs, signer)
    set({ account: addrs, provider, chainId })
  },
  walletConnect: async () => {
    const walletConnectProvider = new WalletConnectProvider({
      // in
      // infuraId: infura.id, // Required

      rpc: { 1: RPC_URLS[process.env.NEXT_PUBLIC_MORALIS_CHAIN === 'rinkeby' ? 4 : 1] },
      qrcode: true
    })
    const provider = new ethers.providers.Web3Provider(walletConnectProvider)
    await walletConnectProvider.enable()
    // console.log(provider)
  },
  deactivate: async () => {
    const provider = get().provider
    if (provider?.provider.isMetaMask) {
      set({ account: undefined })
    }
  }
}))
const EthersProvider: FC = ({ children }) => {
  const [provider, setAccount, setChainId] = useEthers(state =>
    [state.provider, state.setAccount, state.setChainId]
  )

  useEffect(
    () => {
      if (provider) {
        provider.on('network', ({ chainId }: { chainId: number }) => {
          setChainId(chainId)
        })
        // @ts-ignore
        window.ethereum?.on('accountsChanged', (accounts: Array<string>) => {
          setAccount(accounts[0])
        })
      }
    }, [provider, setAccount, setChainId]
  )
  return (
    <>{children}</>
  )
}
export default EthersProvider
