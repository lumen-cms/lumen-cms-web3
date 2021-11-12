import { Contract } from 'web3-eth-contract'

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
  amount: {
    preSale: 'preSaleMaxSupply',
    sale: 'maxSupply'
  }
}

export default async function getContractDetails(contract: Contract, currentUser: string) {
  const getter = await Promise.all(CONFIG_CONTRACT.contractDetailFunctions.map(key => contract.methods[key]().call()))
  const getterObj = CONFIG_CONTRACT.contractDetailFunctions.reduce((obj, item, iteration) => ({
    ...obj,
    [item]: getter[iteration]
  }), {})
  const getterWithUser = await Promise.all(CONFIG_CONTRACT.contractDetailWithUserFunctions.map(key => contract.methods[key](currentUser).call()))
  const getterObjWithUser = CONFIG_CONTRACT.contractDetailWithUserFunctions.reduce((obj, item, iteration) => ({
    ...obj,
    [item]: getterWithUser[iteration]
  }), {})

  const dateNow = Date.now()
  return {
    ...getterObj,
    ...getterObjWithUser,
    isPreSale: dateNow >= Number(getterWithUser[CONFIG_CONTRACT.preSale.start as any]) && dateNow <= Number(getterWithUser[CONFIG_CONTRACT.preSale.end as any]),
    isPublicSale: dateNow >= Number(getterWithUser[CONFIG_CONTRACT.preSale.start as any]),
    isPreSaleSoldOut: Number(CONFIG_CONTRACT.amount.preSale) === 0,
    isSaleSoldOut: Number(CONFIG_CONTRACT.amount.sale) === 0
  }
}
