import '../src/components/moralis/MoralisComponents'
import { ContractDefinition } from '../src/components/moralis/moralisTypings'
import { CONFIG } from '@CONFIG'

export { LmDefaultApp as default } from 'lumen-cms-core'

const contractProps: ContractDefinition = {
  contractDetailFunctions: [
    'sale', 'paused', 'revealed',
    'cost', 'preSaleCost', 'getCurrentCost',
    'maxMintWhitelist', 'maxMintAmount', 'maxSupply', 'totalSupply'],
  contractDetailWithUserFunctions: ['isWhitelisted', 'walletOfOwner'],
  cost: 'getCurrentCost',
  soldAmount: 'totalSupply',
  totalAvailableAmount: 'maxSupply',
  maxPresaleAmount: 'maxMintWhitelist',
  isWhitelisted: 'isWhitelisted',
  countOfUserMinted: 'walletOfOwner',
  paused: 'paused',
  sale: 'sale',
  maxMintAmount: 'maxMintAmount'
}

CONFIG.MORALIS_CONTRACT_DEFINITION = contractProps
