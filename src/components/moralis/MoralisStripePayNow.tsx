import { LmComponentRender } from '@LmComponentRender'
import { useState } from 'react'
import { Dialog, DialogContent, Toolbar } from '@material-ui/core'
import MoralisStripeForm from './MoralisStripeForm'
import MoralisStripeProvider from './MoralisStripeProvider'
import { ButtonStoryblok } from '../../typings/__generated__/components-schema'
import { MoralisMintProps } from './moralisTypings'

type MoralisStripePayNowProps = MoralisMintProps & {
  mintAmount: () => number
  contractToken: string
  userToken: string
}

export default function MoralisStripePayNow({
  mintAmount,
  contractToken,
  userToken,
  content
}: MoralisStripePayNowProps) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <LmComponentRender
        content={{
          component: 'button',
          _uid: '123123',
          label: 'Pay Now',
          ...content.stripe_btn_style?.[0]
        }}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} fullScreen>
        <Toolbar>
          <div style={{ flexGrow: 1 }}></div>
          <LmComponentRender content={{
            component: 'button',
            _uid: 'close-btn',
            icon: {
              name: 'close'
            }
          } as ButtonStoryblok} onClick={() => setOpen(false)} />
        </Toolbar>
        <DialogContent>
          <div style={{
            maxWidth: 500,
            margin: '0 auto'
          }}>
            Values::: {mintAmount()} {contractToken} {userToken}
            <MoralisStripeProvider>
              <MoralisStripeForm />
            </MoralisStripeProvider>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}