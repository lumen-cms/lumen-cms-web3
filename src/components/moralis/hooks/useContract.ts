import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { ContractNft } from '../moralisTypings'
import { useWeb3React } from '@web3-react/core'
import getContractDetails from './getContractDetails'
import { MoralisMintStoryblok } from '../../../typings/__generated__/components-schema'
import ContractDefault, { Contract } from 'web3-eth-contract'
// import { Eth } from 'web3-eth'
// import Web3 from 'web3'

const pureFetch = async (url: string) => {
  const result = await fetch(url)
  if (result.ok) {
    return await result.json()
  }
  return null
}

const CHAINS = {
  main: {
    name: 'main',
    displayName: 'Ethereum',
    id: 1
  },
  rinkeby: {
    name: 'rinkeby',
    displayName: 'Rinkeby Test',
    id: 4
  }
}

export default function useContract(content: MoralisMintStoryblok) {
  const { account, chainId, connector, } = useWeb3React()
  const selectedChain = CHAINS[content.chain || 'main']
  const isCorrectChain = selectedChain?.id === chainId

  const { data } = useSWR(isCorrectChain && content.contract_token ? `/api/get-abi?id=${content.contract_token}` : null, pureFetch)

  const [contractNft, setContract] = useState<ContractNft>()

  useEffect(
    () => {

      const init = async () => {

        if (!(data && account && connector)) {
          return
        }
        let ABI = typeof data === 'string' ? JSON.parse(data) : data
        let provider = await connector.getProvider()
        // @ts-ignore
        ContractDefault.setProvider(provider)
        // @ts-ignore
        const contract: Contract = new ContractDefault(ABI, content.contract_token)
        contract.options.from = account
        contract.options.address = content.contract_token
        contract.defaultChain = content.chain || 'mainnet'
        if (!contract.methods) {
          console.log('contract is not loaded', contract.methods)
          return
        }
        let contractDescription = await getContractDetails(contract, account/*, utils*/)
        console.log(contractDescription)
        setContract({
          contract,
          contractDescription
        })
        // @ts-ignore
        // const eth = library?.eth
        // // @ts-ignore
        // const utils = library?.utils
        // if (eth && utils && data) {
        //   const contract = new eth.Contract(ABI, content.owner_token)
        //   const accounts = await eth.getAccounts()
        //   let currentUser = accounts?.[0]
        //   contract.options.from = currentUser
        //   contract.options.address = content.contract_token
        //   contract.defaultChain = content.chain || 'mainnet'
        //   if (!contract.methods) {
        //     console.log('contract is not loaded', contract.methods)
        //     return
        //   }
        //   let contractDescription = await getContractDetails(contract, currentUser, utils)
        //   // contract.options.value = contractDescription.currentCostEth
        //   console.log(contractDescription)
        //   setContract({
        //     contract,
        //     contractDescription
        //   })
        // }
      }
      init()
    }, [data, account, connector]
  )


  // if (error || userError) {
  //   console.error(error)
  // }

  return { account, contractNft, selectedChain, isCorrectChain }
}
