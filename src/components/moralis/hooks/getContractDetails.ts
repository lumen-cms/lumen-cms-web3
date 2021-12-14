import { ContractDefinition, ContractDescription } from '../moralisTypings'
import { CONFIG } from '@CONFIG'
import { Contract } from 'ethers'

export default async function getContractDetails(contract: Contract, account: string): Promise<ContractDescription> {
  const CONFIG_CONTRACT = CONFIG.MORALIS_CONTRACT_DEFINITION as ContractDefinition

  const getter = await Promise.all(CONFIG_CONTRACT.contractDetailFunctions.map(key => contract.functions[key]().then((r) => {
    const value = r[0]
    if (value._isBigNumber) {
      try {
        return value.toNumber()
      } catch (e) {
        return value
      }
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

  let saleValue = getterObj[CONFIG_CONTRACT.sale]
  const contractDesc: ContractDescription = {
    isSaleActive: saleValue === 3,
    isPreSaleActive: saleValue === 2,
    isWhitelistActive: saleValue === 1,
    canPurchaseAmount: 0,
    cost: getterObj[CONFIG_CONTRACT.cost],
    soldAmount: getterObj[CONFIG_CONTRACT.soldAmount],
    totalAvailableAmount: getterObj[CONFIG_CONTRACT.totalAvailableAmount],
    paused: getterObj[CONFIG_CONTRACT.paused],
    maxPresaleAmount: getterObj[CONFIG_CONTRACT.paused],
    isWhitelisted: getterObjWithUser[CONFIG_CONTRACT.isWhitelisted],
    countOfUserMinted: getterObjWithUser[CONFIG_CONTRACT.countOfUserMinted]?.length || 0,
    maxMintAmount: getterObj[CONFIG_CONTRACT.maxMintAmount],
    sale: saleValue
  }

  if (contractDesc.isSaleActive || contractDesc.isPreSaleActive || contractDesc.isWhitelistActive) {
    if (contractDesc.isWhitelistActive) {
      if (contractDesc.isWhitelisted) {
        contractDesc.canPurchaseAmount = contractDesc.maxPresaleAmount - contractDesc.countOfUserMinted
      }
    } else {
      contractDesc.canPurchaseAmount = contractDesc.maxMintAmount
    }
  }

  return contractDesc
}
