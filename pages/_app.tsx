import '../src/components/moralis/MoralisComponents'
import { MoralisContractDefinition } from '../src/components/moralis/moralisTypings'
import { CONFIG } from '@CONFIG'

export { LmDefaultApp as default } from 'lumen-cms-core'


const contractProps: MoralisContractDefinition = {
  contractDetailFunctions: [
    'vipPreSaleActive', 'preSaleActive', 'publicSaleActive',
    'paused', 'revealed',
    'cost', 'preSaleCost', 'getCurrentCost',
    'maxMintAmountVipPresale', 'maxSupply', 'totalSupply'],
  contractDetailWithUserFunctions: ['isWhitelisted', 'walletOfOwner'],
  isWhitelistActive: 'vipPreSaleActive',
  isPreSaleActive: 'preSaleActive',
  isSaleActive: 'publicSaleActive',
  cost: 'getCurrentCost',
  soldAmount: 'totalSupply',
  totalAvailableAmount: 'maxSupply',
  maxPresaleAmount: 'maxMintAmountVipPresale',
  isWhitelisted: 'isWhitelisted',
  countOfUserMinted: 'walletOfOwner',
  paused: 'paused'
}

CONFIG.MORALIS_CONTRACT_DEFINITION = contractProps
