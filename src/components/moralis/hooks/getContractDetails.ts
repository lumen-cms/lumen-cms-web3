import { ContractDescription, MoralisContractDefinition } from '../moralisTypings'
import { CONFIG } from '@CONFIG'
import { Contract } from 'ethers'

// @ts-ignore
const CONFIG_CONTRACT = CONFIG.MORALIS_CONTRACT_DEFINITION as MoralisContractDefinition

const getValueFromObject = (obj: any, key: string, returnAsNumber?: boolean) => {
  let value = obj[key]
  return returnAsNumber ? Number(value) : value
}

export default async function getContractDetails(contract: Contract, account: string): Promise<ContractDescription> {
  const getter = await Promise.all(CONFIG_CONTRACT.contractDetailFunctions.map(key => contract.functions[key]().then((r) => {
    const value = r[0]
    if (value._isBigNumber) {
      return value.toNumber()
    }
    return value
  })))
  const getterObj: Partial<ContractDescription> = CONFIG_CONTRACT.contractDetailFunctions.reduce((obj, item, iteration) => ({
    ...obj,
    [item]: getter[iteration]
  }), {})
  const getterWithUser = await Promise.all(CONFIG_CONTRACT.contractDetailWithUserFunctions.map(key => contract.functions[key](account).then(r => {
    const value = r[0]
    if (value._isBigNumber) {
      return value.toNumber()
    }
    return value
  })))
  const getterObjWithUser: Partial<ContractDescription> = CONFIG_CONTRACT.contractDetailWithUserFunctions.reduce((obj, item, iteration) => ({
    ...obj,
    [item]: getterWithUser[iteration]
  }), {})

  const dateNow = Date.now()
  const contractDesc = {
    ...getterObj,
    ...getterObjWithUser,
    isPreSale: dateNow >= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.start, true) * 1000 && dateNow <= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.end, true) * 1000,
    isPublicSale: dateNow >= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.start, true),
    remainingPreSaleAmout: getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.preSale, true) - getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.current, true),
    remainingSaleAmount: getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.sale, true) - getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.current, true),
    canPurchaseAmount: 0
  } as ContractDescription
  contractDesc.isPreSaleSoldOut = contractDesc.remainingPreSaleAmout === 0
  contractDesc.isSaleSoldOut = contractDesc.remainingSaleAmount === 0
  const currentWalletAmount = contractDesc.walletOfOwner.length
  const maxMintPresale = Number(contractDesc.maxMintAmountPresale)
  if (contractDesc.isPreSale) {
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
