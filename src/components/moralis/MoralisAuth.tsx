import { LmComponentRender } from '@LmComponentRender'
import { ButtonStoryblok, ImageStoryblok, MoralisButtonStoryblok } from '../../typings/__generated__/components-schema'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from './web3Injector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { useEagerConnect } from './hooks/useEagerConnect'

const getErrorMessage = (error: Error) => {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return 'You\'re connected to an unsupported network.'
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}


export default function MoralisAuth(content: MoralisButtonStoryblok) {
  const { account, activate, deactivate, error } = useWeb3React()
  useEagerConnect()

  const currentError = error ? getErrorMessage(error) : null
  if (currentError) {
    console.error(currentError)
  }
  if (account) {
    let logoutElement = content.logout?.[0]
    return (
      <div>
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: 'head',
              label: 'Logout',
              ...logoutElement
            } as ButtonStoryblok | ImageStoryblok
          }
          onClick={async () => {
            // await logout()
            deactivate()
          }}
        />
      </div>
    )
  }
  let loginElement = content.login?.[0]
  return (
    <LmComponentRender
      content={
        {
          component: 'button',
          _uid: loginElement?._uid || 'login_' + content._uid,
          label: 'My Button',
          ...loginElement
        } as ButtonStoryblok
      }
      onClick={async () => {
        // enableWeb3()
        // await authenticate()
        await activate(injected, error => {
          if (error instanceof NoEthereumProviderError) {
            activate(walletconnect)
          }
        })
      }}
    />
  )
}
