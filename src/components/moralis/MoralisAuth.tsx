import { LmComponentRender } from '@LmComponentRender'
import {
  ButtonStoryblok,
  HeadlineStoryblok,
  ImageStoryblok,
  MoralisButtonStoryblok
} from '../../typings/__generated__/components-schema'
import { useMoralis } from 'react-moralis'

export default function MoralisAuth(content: MoralisButtonStoryblok) {
  const { authenticate, isAuthenticating, user, logout, userError } =
    useMoralis()

  let username = user?.getUsername()
  if (userError?.message) {
    return <p>{userError.message}</p>
  }
  if (username) {
    let headlineElement = { ...content.user?.[0] }
    let logoutElement = content.logout?.[0]
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center'
        }}
      >
        <LmComponentRender
          content={
            {
              component: 'headline',
              _uid: headlineElement?._uid || 'head_' + content._uid,
              typography: 'headline6',
              ...headlineElement,
              text:
                headlineElement?.text?.replace('{user}', username) || username.substr(0, 5) + '..'
            } as HeadlineStoryblok
          }
        />
        <LmComponentRender
          content={
            {
              component: 'button',
              _uid: 'head',
              label: 'Logout',
              ...logoutElement
            } as ButtonStoryblok | ImageStoryblok
          }
          disabled={isAuthenticating}
          onClick={() => logout()}
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
      onClick={() => {
        authenticate()
      }}
    />
  )
}
