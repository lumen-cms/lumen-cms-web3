import { useEffect, useRef, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { Contract } from 'web3-eth-contract'
import useSWR from 'swr'

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

const ABI_URL: string = process.env.NEXT_PUBLIC_ABI_URI as string + process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS as string

const fetcher = async (url: string) => {
  const result = await fetch(url)
  if (result.ok) {
    const values = await result.json()
    return values.result?.[0].ABI
  } else {
    return null
  }
}

type ContractNft = {
  contract?: Contract,
  contractDescription?: {
    preSaleStartDate: string
    preSaleEndDate: string
    publicSaleDate: string
    paused: boolean
    maxMintAmountPresale: boolean
    maxMintAmount: boolean
    cost: string
    preSaleCost: string
    getCurrentCost: string
    isWhitelisted: string
    revealed: boolean
    maxSupply: string
    preSaleMaxSupply: string
    walletOfOwner: string
  }
}
export default function useContract() {
  const contractRef = useRef<Contract | null>()
  const { user, web3, isWeb3EnableLoading, isWeb3Enabled, web3EnableError, enableWeb3, isLoggingOut } =
    useMoralis()
  const { data, isValidating, error } = useSWR(ABI_URL, fetcher)
  const eth = web3?.eth
  const [contractNft, setContract] = useState<ContractNft>()
  useEffect(
    () => {
      if (eth && data) {
        const init = async () => {
          const contract = new eth.Contract(ABI, process.env.NEXT_PUBLIC_MORALIS_CONTRACT_ADDRESS)
          const accounts = await eth.getAccounts()
          let currentUser = accounts?.[0]
          contract.options.from = currentUser
          setContract({
            contract,
            contractDescription: {
              preSaleStartDate: await contract.methods.preSaleStartDate().call(),
              preSaleEndDate: await contract.methods.preSaleEndDate().call(),
              publicSaleDate: await contract.methods.publicSaleDate().call(),
              paused: await contract.methods.paused().call(),
              maxMintAmountPresale: await contract.methods.maxMintAmountPresale().call(),
              maxMintAmount: await contract.methods.maxMintAmount().call(),
              cost: await contract.methods.cost().call(),
              preSaleCost: await contract.methods.preSaleCost().call(),
              getCurrentCost: await contract.methods.getCurrentCost().call(),
              isWhitelisted: await contract.methods.isWhitelisted(currentUser).call(),
              revealed: await contract.methods.revealed().call(),
              maxSupply: await contract.methods.maxSupply().call(),
              preSaleMaxSupply: await contract.methods.preSaleMaxSupply().call(),
              walletOfOwner: await contract.methods.walletOfOwner(currentUser).call()
            }
          })
        }
        init()
      }
    }, [data, eth]
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
