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

  const contractDesc: ContractDescription = {
    isSaleActive: getValueFromObject(getterObj, CONFIG_CONTRACT.isSaleActive),
    isPreSaleActive: getValueFromObject(getterObj, CONFIG_CONTRACT.isPreSaleActive),
    isWhitelistActive: getValueFromObject(getterObj, CONFIG_CONTRACT.isWhitelistActive),
    canPurchaseAmount: 0,
    cost: getValueFromObject(getterObj, CONFIG_CONTRACT.cost),
    soldAmount: getValueFromObject(getterObj, CONFIG_CONTRACT.soldAmount),
    totalAvailableAmount: getValueFromObject(getterObj, CONFIG_CONTRACT.totalAvailableAmount),
    paused: getValueFromObject(getterObj, CONFIG_CONTRACT.paused),
    maxPresaleAmount: getValueFromObject(getterObj, CONFIG_CONTRACT.paused),
    isWhitelisted: getValueFromObject(getterObjWithUser, CONFIG_CONTRACT.isWhitelisted),
    countOfUserMinted: getValueFromObject(getterObjWithUser, CONFIG_CONTRACT.countOfUserMinted)?.length || 0
  }

  if (contractDesc.isSaleActive || contractDesc.isPreSaleActive || contractDesc.isWhitelistActive) {
    if (contractDesc.isWhitelistActive) {
      contractDesc.canPurchaseAmount = contractDesc.maxPresaleAmount - contractDesc.countOfUserMinted
    }
    contractDesc.canPurchaseAmount = 7 // make this configurable through Storyblok
  }

  return contractDesc
}
