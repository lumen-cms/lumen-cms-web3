import { FC } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'

// import Web3 from 'web3'

async function getLibrary(provider: any) {
  // return new Eth(provider)
  // return new ethers.providers.Web3Provider(provider)
  // console.log('inside get Lib', provider)
  // // @ts-ignore
  // ContractDefault.setProvider(provider)
  // return ContractDefault
}

const Web3Provider: FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={(provider) => {
      return new ethers.providers.Web3Provider(provider)
    }}>{children}</Web3ReactProvider>
  )
}
export default Web3Provider
