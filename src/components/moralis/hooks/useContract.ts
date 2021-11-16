import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { ContractNft } from '../moralisTypings'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import getContractDetails from './getContractDetails'

const pureFetch = async (url: string) => {
  const result = await fetch(url)
  if (result.ok) {
    return await result.json()
  }
  return null
}

export default function useContract() {
  // const { user, web3, isWeb3Enabled, web3EnableError, userError } =
  //   useMoralis()
  const { active, account, library } = useWeb3React<Web3>()

  const { data } = useSWR(active ? '/api/get-abi' : null, pureFetch)
  const [contractNft, setContract] = useState<ContractNft>()
  console.log(active, library, account)


  useEffect(
    () => {
      const eth = library?.eth
      const utils = library?.utils
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
    }, [data, library]
  )


  // if (error || userError) {
  //   console.error(error)
  // }

  return { account, contractNft }
}
