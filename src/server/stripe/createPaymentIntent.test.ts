import { createPaymentIntent, retrievePayment } from './createPaymentIntent'
import { StripeRequestBodyProps } from '../../lib/stripeConfig'

describe('test stripe payment', function() {
  test('test intent', async () => {
    const props: StripeRequestBodyProps = {
      amount: 100,
      nftAmount: 1,
      walletToken: '123',
      contractToken: '123'
    }
    const { client_secret, metadata, id } = await createPaymentIntent(props)
    expect(typeof client_secret).toBe('string')
    expect(metadata.nftAmount).toBe(`${props.nftAmount}`)
    expect(metadata.walletToken).toBe(props.walletToken)
    expect(metadata.contractToken).toBe(props.contractToken)

    const ret = await retrievePayment(id)
    console.log(ret)
  })
})
