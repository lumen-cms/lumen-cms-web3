import { useEffect, useMemo, useState } from 'react'
import { ContractNft, MoralisMintProps } from '../moralisTypings'
import { useWeb3React } from '@web3-react/core'
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

export default function useContract(content: MoralisMintProps) {
  const { account, chainId, library } = useWeb3React()
  const selectedChain = CHAINS[content.chain || 'main']
  const isCorrectChain = selectedChain?.id === chainId
  const [contractDescription, setContractDescription] = useState<ContractNft['contractDescription']>()
  const contract: ethers.Contract | null = useMemo(
    () => {
      if (content.contract_token && content.moralis_mint_data && library) {
        const signer = library.getSigner()
        return new ethers.Contract(content.contract_token, content.moralis_mint_data, signer)
      }
      return null
    }, [content.contract_token, content.moralis_mint_data, library]
  )
  useEffect(
    () => {
      const init = async () => {
        if (contract && account) {
          const contractDescription = await getContractDetails(contract, account)
          console.log(contractDescription)
          setContractDescription(contractDescription)
        }
      }
      init()
    }, [account, contract]
  )


  // if (error || userError) {
  //   console.error(error)
  // }
  const contractNft = {
    contractDescription,
    contract
  }
  return { account, contractNft, selectedChain, isCorrectChain }
}
