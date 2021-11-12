import { Contract } from 'web3-eth-contract'
import { ContractNft } from '../moralisTypings'
import { Utils } from 'web3-utils'

const CONFIG_CONTRACT = {
  contractDetailFunctions: ['preSaleStartDate', 'preSaleEndDate', 'publicSaleDate', 'paused',
    'maxMintAmountPresale', 'maxMintAmount', 'cost', 'preSaleCost', 'getCurrentCost', 'revealed', 'maxSupply',
    'preSaleMaxSupply'],
  contractDetailWithUserFunctions: ['isWhitelisted', 'walletOfOwner'],
  preSale: {
    start: 'preSaleStartDate',
    end: 'preSaleEndDate'
  },
  publicSale: {
    start: 'publicSaleDate'
  },
  availableAmount: {
    preSale: 'preSaleMaxSupply',
    sale: 'maxSupply'
  },
  cost: {
    preSale: 'preSaleCost',
    sale: 'cost'
  }
}

type ContractDescription = ContractNft['contractDescription']

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
    isPreSale: dateNow >= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.start, true) && dateNow <= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.end, true),
    isPublicSale: dateNow >= getValueFromObject(getterObj, CONFIG_CONTRACT.preSale.start, true),
    isPreSaleSoldOut: getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.preSale, true) === 0,
    isSaleSoldOut: getValueFromObject(getterObj, CONFIG_CONTRACT.availableAmount.sale, true) === 0,
    costEth: utils.fromWei(getValueFromObject(getterObj, CONFIG_CONTRACT.cost.sale)),
    preSaleCostEth: utils.fromWei(getValueFromObject(getterObj, CONFIG_CONTRACT.cost.preSale))
  } as ContractDescription
  return contractDesc
}
