import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT, StripeRequestBodyProps } from '../../lib/stripeConfig'
import Stripe from 'stripe'
import { formatAmountForStripe } from '../../lib/stripeHelpers'

type CreatePaymentIntentProps = StripeRequestBodyProps
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2020-08-27'
})
export const createPaymentIntent = async ({
  amount,
  nftAmount,
  contractToken,
  walletToken,
  chainId
}: CreatePaymentIntentProps) => {
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
      nftAmount: `${nftAmount}`,
      chainId: `${chainId}`
    }
  }
  return await stripe.paymentIntents.create(
    params
  )
}

export const retrievePaymentIntent = async (intentId: string) => {
  return await stripe.paymentIntents.retrieve(intentId)
}

export const updatePaymentIntent = async (intentId: string, metadata: Stripe.PaymentIntent['metadata']) => {
  return await stripe.paymentIntents.update(intentId, {
    metadata
  })
}

