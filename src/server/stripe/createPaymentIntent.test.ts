import { createPaymentIntent, retrievePaymentIntent, updatePaymentIntent } from './createPaymentIntent'
import { StripeRequestBodyProps } from '../../lib/stripeConfig'

describe('test stripe payment', function() {
  test('test intent', async () => {
    const props: StripeRequestBodyProps = {
      amount: '100',
      nftAmount: '1',
      walletToken: '123',
      contractToken: '123'
    }
    const { client_secret, metadata, id } = await createPaymentIntent(props)
    expect(typeof client_secret).toBe('string')
    expect(metadata.nftAmount).toBe(`${props.nftAmount}`)
    expect(metadata.walletToken).toBe(props.walletToken)
    expect(metadata.contractToken).toBe(props.contractToken)

    const { metadata: meta2 } = await retrievePaymentIntent(id)
    expect(meta2.nftAmount).toBe(`${props.nftAmount}`)
    expect(meta2.walletToken).toBe(props.walletToken)
    expect(meta2.contractToken).toBe(props.contractToken)

    const { metadata: meta3 } = await updatePaymentIntent(id, { ...props, airdropped: '1' })
    expect(meta3.nftAmount).toBe(`${props.nftAmount}`)
    expect(meta3.walletToken).toBe(props.walletToken)
    expect(meta3.contractToken).toBe(props.contractToken)
    expect(meta3.airdropped).toBe('1')

  })
})
