import { Contract } from 'web3-eth-contract'

export type ContractNft = {
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
    isPreSale: boolean
    isPublicSale: boolean
    isPreSaleSoldOut: boolean
    isSaleSoldOut: boolean
    costEth: string
    preSaleCostEth: string
  }
}
