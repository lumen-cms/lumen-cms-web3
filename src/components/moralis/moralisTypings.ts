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
}

export type ContractNft = {
  contract?: Contract,
  contractDescription?: ContractDescription
}

export interface MoralisContractDefinition {
  contractDetailFunctions: string[]
  contractDetailWithUserFunctions: string[]
  isWhitelistActive: string
  isPreSaleActive: string
  isSaleActive: string
  cost: string
  soldAmount: string
  totalAvailableAmount: string
  maxPresaleAmount: string
  isWhitelisted: string
  countOfUserMinted: string
  paused: string
}

export type MoralisMintProps = MoralisMintStoryblok & {
  moralis_mint_data: any
}

