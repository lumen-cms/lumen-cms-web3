import { LmComponentRender } from '@LmComponentRender'
import { ButtonStoryblok, ImageStoryblok, MoralisButtonStoryblok } from '../../typings/__generated__/components-schema'
import { useEthers } from './useEthers'
import { injected, walletconnect } from './web3Injector'
import { useWeb3React } from '@web3-react/core'

import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'

export default function MoralisAuth(content: MoralisButtonStoryblok) {
  const { account, activate, deactivate } = useWeb3React()
  // useEagerConnect()
  // const { walletConnect, metamask, account, deactivate } = useEthers()
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
            await deactivate()
          }}
        />
      </div>
    )
  }

  let loginElement = content.login?.[0]
  return (
    <div>

      <LmComponentRender
        content={
          {
            component: 'button',
            _uid: loginElement?._uid || 'login_' + content._uid,
            ...loginElement,
            label: 'MetaMask'
          } as ButtonStoryblok
        }
        onClick={async () => {
          try {

            await activate(injected)

            // await metamask()
          } catch (e) {
            console.log(e)
          }
        }}
      />
      <LmComponentRender
        content={
          {
            component: 'button',
            _uid: loginElement?._uid || 'login_' + content._uid,
            ...loginElement,
            label: 'WalletConnect'
          } as ButtonStoryblok
        }
        onClick={async () => {
          try {
            await activate(walletconnect, error => {
                  if (error instanceof UserRejectedRequestErrorWalletConnect) {
                    // walletconnect.deactivate()
                    walletconnect.walletConnectProvider = null
                    // @ts-ignore
                    // walletconnect.handleDisconnect()
                  }
                })
            // await walletConnect()
          } catch (e) {
            console.log(e)
          }
        }}
      />
    </div>
  )
}
