import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT, StripeRequestBodyProps } from '../../../src/lib/stripeConfig'
import { formatAmountForStripe } from '../../../src/lib/stripeHelpers'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2020-08-27'
})


export default async function createPaymentIntent(req: NextApiRequest, res: NextApiResponse) {

  const {
    amount,
    walletToken,
    contractToken,
    nftAmount
  }: StripeRequestBodyProps = req.method === 'POST' ? req.body : req.query
  try {
    const paymentAmount = Number(amount)
    // Validate the amount that was passed from the client.
    if (!(paymentAmount >= MIN_AMOUNT && paymentAmount <= MAX_AMOUNT)) {
      throw new Error('Invalid amount.')
    }
    // Create PaymentIntent from body params.
    const params: Stripe.PaymentIntentCreateParams = {
      // payment_method_types: ['card'],
      amount: formatAmountForStripe(paymentAmount, CURRENCY),
      currency: CURRENCY,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        walletToken: walletToken || '',
        contractToken: contractToken || '',
        nftAmount: nftAmount ? Number(nftAmount) : 0
      }
    }
    console.log('inside payment', params)
    const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
      params
    )
    res.status(200).json(payment_intent)
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}
