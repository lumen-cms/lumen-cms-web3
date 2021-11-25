import { FC } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'

const Web3Provider: FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={(provider) => {
      return new ethers.providers.Web3Provider(provider)
    }}>{children}</Web3ReactProvider>
  )
}
export default Web3Provider
