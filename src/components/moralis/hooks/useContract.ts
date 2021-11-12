import { useEffect, useRef, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { Contract } from 'web3-eth-contract'
import useSWR from 'swr'
import getContractDetails from './getContractDetails'
import { ContractNft } from '../moralisTypings'

const pureFetch = async (url: string) => {
  const result = await fetch(url)
  if (result.ok) {
    return await result.json()
  }
  return null
}

export default function useContract() {
  const contractRef = useRef<Contract | null>()
  const { user, web3, isWeb3EnableLoading, isWeb3Enabled, web3EnableError, enableWeb3, isLoggingOut, userError } =
    useMoralis()
  const { data, isValidating, error } = useSWR('/api/get-abi', pureFetch)
  const [contractNft, setContract] = useState<ContractNft>()
  if(userError){
    console.log(userError)
  }
  useEffect(
    () => {
      const eth = web3?.eth
      const utils = web3?.utils
      if (eth && utils && data) {
        const init = async () => {
          const contract = new eth.Contract(typeof data === 'string' ? JSON.parse(data) : data, process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS)
          const accounts = await eth.getAccounts()
          let currentUser = accounts?.[0]
          contract.options.from = currentUser
          contract.options.address = process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS as string
          contract.defaultChain = process.env.NEXT_PUBLIC_MORALIS_CHAIN as any
          if (!contract.methods) {
            console.log('contract is not loaded', contract.methods)
            return
          }
          let contractDescription = await getContractDetails(contract, currentUser, utils)
          // contract.options.value = contractDescription.currentCostEth
          console.log(contractDescription)
          setContract({
            contract,
            contractDescription
          })
        }
        init()
      }
    }, [data, web3]
  )
  if (error) {
    console.error(error)
  }
  useEffect(() => {
    if (isLoggingOut) {
      contractRef.current = null
    }
  }, [isLoggingOut, contractRef.current])

  useEffect(() => {
    if (!isWeb3Enabled && !isWeb3EnableLoading) {
      // enable web3
      enableWeb3()
    }
  }, [isWeb3EnableLoading, isWeb3Enabled])

  return { user, web3EnableError, isWeb3Enabled, contractNft }
}
