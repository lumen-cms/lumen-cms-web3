import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
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
  const { user, web3, isWeb3EnableLoading, isWeb3Enabled, web3EnableError, enableWeb3, userError } =
    useMoralis()
  const { data, error } = useSWR(isWeb3Enabled ? '/api/get-abi' : null, pureFetch)
  const [contractNft, setContract] = useState<ContractNft>()

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
    }, [data, web3, enableWeb3]
  )
  if (error || userError) {
    console.error(error)
  }

  useEffect(() => {
    if (!isWeb3Enabled && !isWeb3EnableLoading) {
      // enable web3
      enableWeb3()
    }
  }, [isWeb3EnableLoading, isWeb3Enabled])

  return { user, web3EnableError, isWeb3Enabled, contractNft }
}
