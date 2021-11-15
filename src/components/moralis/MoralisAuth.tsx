import { LmComponentRender } from '@LmComponentRender'
import { ButtonStoryblok, ImageStoryblok, MoralisButtonStoryblok } from '../../typings/__generated__/components-schema'
import { useWeb3React } from '@web3-react/core'
import { injected } from './web3Injector'

export default function MoralisAuth(content: MoralisButtonStoryblok) {
  // const { authenticate, isAuthenticating, user, logout, userError, enableWeb3, isWeb3EnableLoading } =
  //   useMoralis()
  const { account, activate, deactivate } = useWeb3React()

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
        await activate(injected)
      }}
    />
  )
}
