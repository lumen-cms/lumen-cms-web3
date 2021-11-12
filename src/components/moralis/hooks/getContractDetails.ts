import { Contract } from 'web3-eth-contract'
import { ContractDescription } from '../moralisTypings'
import { Utils } from 'web3-utils'

const CONFIG_CONTRACT = {
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
}

const getValueFromObject = (obj: any, key: string, returnAsNumber?: boolean) =>
  returnAsNumber ? Number(obj[key]) : obj[key]

export default async function getContractDetails(contract: Contract, currentUser: string, utils: Utils): Promise<ContractDescription> {
  const getter = await Promise.all(CONFIG_CONTRACT.contractDetailFunctions.map(key => contract.methods[key]().call()))
  const getterObj: Partial<ContractDescription> = CONFIG_CONTRACT.contractDetailFunctions.reduce((obj, item, iteration) => ({
    ...obj,
    [item]: getter[iteration]
  }), {})
  const getterWithUser = await Promise.all(CONFIG_CONTRACT.contractDetailWithUserFunctions.map(key => contract.methods[key](currentUser).call()))
  const getterObjWithUser: Partial<ContractDescription> = CONFIG_CONTRACT.contractDetailWithUserFunctions.reduce((obj, item, iteration) => ({
    ...obj,
    [item]: getterWithUser[iteration]
  }), {})

  const dateNow = Date.now()
  const contractDesc = {
    ...getterObj,
    ...getterObjWithUser,
    isPreSale: dateNow >= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.start, true) && dateNow <= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.end, true) * 1000,
    isPublicSale: dateNow >= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.start, true),
    remainingPreSaleAmout: getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.preSale, true) - getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.current, true),
    remainingSaleAmount: getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.sale, true) - getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.current, true),
    costEth: utils.fromWei(getValueFromObject(getterObj, CONFIG_CONTRACT.cost.sale)),
    preSaleCostEth: utils.fromWei(getValueFromObject(getterObj, CONFIG_CONTRACT.cost.preSale)),
    currentCostEth: utils.fromWei(getValueFromObject(getterObj, CONFIG_CONTRACT.cost.current)),
    canPurchaseAmount: 0
  } as ContractDescription
  contractDesc.isPreSaleSoldOut = contractDesc.remainingPreSaleAmout === 0
  contractDesc.isSaleSoldOut = contractDesc.remainingSaleAmount === 0
  const currentWalletAmount = contractDesc.walletOfOwner.length
  const maxMintPresale = Number(contractDesc.maxMintAmountPresale)
  if (contractDesc.isPreSale) {
    console.log("inside pre sale",contractDesc.isPreSaleSoldOut, contractDesc.remainingPreSaleAmout, maxMintPresale, currentWalletAmount)
    if (!(contractDesc.isPreSaleSoldOut || !contractDesc.isWhitelisted || currentWalletAmount >= maxMintPresale)) {
      contractDesc.canPurchaseAmount = contractDesc.remainingPreSaleAmout < maxMintPresale ? contractDesc.remainingPreSaleAmout - currentWalletAmount : maxMintPresale - currentWalletAmount
    }
  } else if (contractDesc.isPublicSale) {
    const maxMint = Number(contractDesc.maxMintAmount)
    if (!(contractDesc.isSaleSoldOut || currentWalletAmount >= maxMint)) {
      contractDesc.canPurchaseAmount = contractDesc.remainingSaleAmount < maxMint ? contractDesc.remainingSaleAmount - currentWalletAmount : maxMint - currentWalletAmount
    }
  }
  return contractDesc
}
