import { useEffect, useRef } from 'react'
import { useMoralis } from 'react-moralis'
import { Contract } from 'web3-eth-contract'

const ABI = process.env.NEXT_PUBLIC_ABI ? JSON.parse(process.env.NEXT_PUBLIC_ABI) : []

/*
preSaleStartDate
preSaleEndDate
publicSaleDate
paused
maxMintAmountPresale
maxMintAmount
preSaleCost
cost
getCurrentCost
walletOfOwner(walletOfOwner)
isWhitelisted(walletOfUser)
 */
const valuesOfContract = ['preSaleStartDate',
  'preSaleEndDate',
  'publicSaleDate',
  'paused',
  'maxMintAmountPresale',
  'maxMintAmount',
  'preSaleCost',
  'cost',
  'getCurrentCost']

export default function useContract() {
  const contractRef = useRef<Contract | null>()
  const { user, web3, isWeb3EnableLoading, isWeb3Enabled, web3EnableError, enableWeb3, isLoggingOut } =
    useMoralis()
  const eth = web3?.eth
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


  const getContractDetails = async () => {
    const contract = await getContract()
    if (contract) {
      try {
console.log("hier")
        const res = await contract.methods.preSaleStartDate().call()
console.log("dort")
        console.log(res)
      } catch (e) {
        console.error()
      }

      // valuesOfContract.forEach(async key => {
      //   let method = contract.methods[key]
      //   console.log(typeof method)
      //   const res = await method().call()
      //   console.log(res)
      // })
    }
  }

  const getContract = async () => {

    if (contractRef.current) {
      return contractRef.current
    }
    if (eth) {
      const contract = new eth.Contract(ABI, process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS)
      const accounts = await eth.getAccounts()
      // if (process.env.NODE_ENV === 'development') {
      //   contract.options.gasPrice = '0'
      // }
      contract.options.from = accounts?.[0]
      contractRef.current = contract
      return contract
    } else {
      console.warn('web3 eth not ready yet')
    }
  }

  return { user, web3EnableError, isWeb3Enabled, getContract, getContractDetails }
}
