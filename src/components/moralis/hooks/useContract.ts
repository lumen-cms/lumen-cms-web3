import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { ContractNft } from '../moralisTypings'
import { useWeb3React } from '@web3-react/core'
import { MoralisMintStoryblok } from '../../../typings/__generated__/components-schema'
// import ContractDefault, { Contract } from 'web3-eth-contract'
// import { Eth } from 'web3-eth'
// import Web3 from 'web3'
import { ethers } from 'ethers'
import getContractDetails from './getContractDetails'


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
  const { account, chainId, library } = useWeb3React()
  const selectedChain = CHAINS[content.chain || 'main']
  const isCorrectChain = selectedChain?.id === chainId

  const { data } = useSWR(isCorrectChain && content.contract_token ? `/api/get-abi?id=${content.contract_token}` : null, pureFetch)

  const [contractNft, setContract] = useState<ContractNft>()
  useEffect(
    () => {

      const init = async () => {

        if (!(data && account && library)) {
          return
        }
        let ABI = typeof data === 'string' ? JSON.parse(data) : data

        const signer = library.getSigner()
        const contract = new ethers.Contract(content.contract_token, ABI, signer)
        const contractDescription = await getContractDetails(contract, account)
        setContract({
          contract,
          contractDescription
        })
      }
      init()
    }, [data, account, library, content.contract_token]
  )


  // if (error || userError) {
  //   console.error(error)
  // }

  return { account, contractNft, selectedChain, isCorrectChain }
}
