import { CONFIG } from '@CONFIG'
import '../src/components/moralis/MoralisComponents'
import { ContractDescription } from '../src/components/moralis/moralisTypings'

export { LmDefaultApp as default } from 'lumen-cms-core'

// @ts-ignore
CONFIG.MORALIS_CONTRACT = {
  contractDetailFunctions: ['preSaleStartDate', 'preSaleEndDate', 'publicSaleDate', 'paused',
    'maxMintAmountPresale', 'maxMintAmount', 'cost', 'preSaleCost', 'getCurrentCost', 'revealed', 'maxSupply',
    'preSaleMaxSupply', 'totalSupply'],
  contractDetailWithUserFunctions: ['isWhitelisted', 'walletOfOwner'],
  preSale: {
    start: 'preSaleStartDate',
    end: 'preSaleEndDate'
  },
  publicSale: {
    start: 'publicSaleDate'
  },
  availableAmount: {
    current: 'totalSupply',
    preSale: 'preSaleMaxSupply',
    sale: 'maxSupply'
  },
  cost: {
    preSale: 'preSaleCost',
    sale: 'cost',
    current: 'getCurrentCost'
  }
} as ContractDescription
