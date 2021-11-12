import { Web3ReactProvider } from '@web3-react/core'
import { FC } from 'react'
import { Web3Provider } from '@ethersproject/providers'


export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}


const LmWeb3ReactProvider: FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}

export default LmWeb3ReactProvider
