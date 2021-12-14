import { LmComponentRender } from '@LmComponentRender'
import { ButtonStoryblok, ImageStoryblok, MoralisButtonStoryblok } from '../../typings/__generated__/components-schema'
import { injected, walletconnect } from './web3Injector'
import { useWeb3React } from '@web3-react/core'

import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useEffect, useState } from 'react'

type MoralisAuthProps = {
  content: MoralisButtonStoryblok
}

const assets = {
  metamask: 'https://cdn.jsdelivr.net/gh/MetaMask/brand-resources/SVG/metamask-fox.svg',
  walletconnect: 'https://cdn.jsdelivr.net/gh/WalletConnect/walletconnect-assets/svg/circle/walletconnect-circle-blue.svg'
}

export default function MoralisAuth({ content }: MoralisAuthProps) {
  const { account, activate, deactivate } = useWeb3React()
  const [hasMetaMask, setHasMetaMask] = useState<boolean>()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      setHasMetaMask(!!window.ethereum)
    }
  }, [])
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
            await deactivate()
          }}
        />
      </div>
    )
  }

  let loginElement = content.login?.[0]
  let loginWalletElement = content.login_walletconnect?.[0]
  return (
    <div style={{
      display: hasMetaMask === undefined ? 'none' : 'flex',
      flexDirection: 'row',
      gap: '12px'
    }}>
      <div className={hasMetaMask ? undefined : 'd-none'}>
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: loginElement?._uid || 'login_' + content._uid,
              image: assets.metamask,
              variant: 'outlined',
              image_size: 'medium',
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
      </div>
      <div>
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: loginWalletElement?._uid || 'login_wallet_' + content._uid,
              image: assets.walletconnect,
              variant: 'outlined',
              image_size: 'medium',
              ...loginWalletElement,
              size: 'lm-button-large',
              label: 'WalletConnect'
            } as ButtonStoryblok
          }
          onClick={async () => {
            try {
              await activate(walletconnect, error => {
                if (error instanceof UserRejectedRequestErrorWalletConnect) {
                  walletconnect.walletConnectProvider = null
                }
              })
            } catch (e) {
              console.log(e)
            }
          }}
        >
          WalletConnect
        </LmComponentRender>
      </div>
    </div>
  )
}
