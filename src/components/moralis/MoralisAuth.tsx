import { LmComponentRender } from '@LmComponentRender'
import { ButtonStoryblok, ImageStoryblok, MoralisButtonStoryblok } from '../../typings/__generated__/components-schema'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from './web3Injector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import Web3 from 'web3'
import { useEagerConnect } from './hooks/useEagerConnect'



export default function MoralisAuth(content: MoralisButtonStoryblok) {
  const { account, activate, deactivate } = useWeb3React<Web3>()
  useEagerConnect()

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

  const activateAccount = async () => {
    // @ts-ignore
    if (window.ethereum) {
      await activate(injected)
    } else {
      await activate(walletconnect, error => {
        if (error instanceof UserRejectedRequestErrorWalletConnect) {
          // walletconnect.deactivate()
          walletconnect.walletConnectProvider = null
          // @ts-ignore
          // walletconnect.handleDisconnect()
        }
      })
    }
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
        await activateAccount()
      }}
    />
  )
}
