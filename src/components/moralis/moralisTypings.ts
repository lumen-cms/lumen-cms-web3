import { Contract } from 'ethers'
import { MoralisMintStoryblok } from '../../typings/__generated__/components-schema'


export type ContractDescription = {
  isWhitelistActive: boolean
  isPreSaleActive: boolean
  isSaleActive: boolean
  cost: number
  soldAmount: number
  totalAvailableAmount: number
  maxPresaleAmount: number
  isWhitelisted: boolean
  countOfUserMinted: number
  paused: boolean
  canPurchaseAmount: number
  sale: number
  maxMintAmount: number
}

export type ContractNft = {
  contract?: Contract,
  contractDescription?: ContractDescription
}

export interface ContractDefinition {
  contractDetailFunctions: string[]
  contractDetailWithUserFunctions: string[]
  cost: string
  soldAmount: string
  totalAvailableAmount: string
  maxPresaleAmount: string
  isWhitelisted: string
  countOfUserMinted: string
  paused: string
  sale: string
  maxMintAmount: string
}

export type MoralisMintProps = {
  content: MoralisMintStoryblok & {
    moralis_mint_data: any
  }
}

