import { useEffect, useRef, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { Contract } from 'web3-eth-contract'
import useSWR from 'swr'
import { getContractAbi } from '../../../lib/getContractAbi'
import getContractDetails from './getContractDetails'
import { ContractNft } from '../moralisTypings'

const ABI_URL: string = process.env.NEXT_PUBLIC_ABI_URI as string + process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS as string

export default function useContract() {
  const contractRef = useRef<Contract | null>()
  const { user, web3, isWeb3EnableLoading, isWeb3Enabled, web3EnableError, enableWeb3, isLoggingOut } =
    useMoralis()
  const { data, isValidating, error } = useSWR(ABI_URL, getContractAbi)
  const [contractNft, setContract] = useState<ContractNft>()
  useEffect(
    () => {
      const eth = web3?.eth
      const utils = web3?.utils
      if (eth && utils && data) {
        const init = async () => {
          const contract = new eth.Contract(typeof data === 'string' ? JSON.parse(data) : data, process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS)
          console.log('hier')
          const accounts = await eth.getAccounts()
          console.log('hier 2')
          let currentUser = accounts?.[0]
          contract.options.from = currentUser
          if (!contract.methods) {
            console.log('contract is not loaded', contract.methods)
            return
          }
          console.log(contract.methods)
          setContract({
            contract,
            contractDescription: await getContractDetails(contract, currentUser, utils)
          })
          console.log('hier 3')
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
