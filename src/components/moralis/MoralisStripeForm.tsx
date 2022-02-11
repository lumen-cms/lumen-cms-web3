import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { MoralisStripePayNowProps } from './moralisTypings'
import { renderRichText } from 'lumen-cms-core/src/components/paragraph/renderRichText'


export default function MoralisStripeForm(props: MoralisStripePayNowProps) {
  const { content, contractToken, userToken, mintAmount } = props
  const { checkout_content, price_fiat } = content
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            break
          default:
            setMessage('Something went wrong.')
            break
        }
      })
  }, [stripe])

  const handleSubmit = async (e: any) => {
    debugger
    e.preventDefault()
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: content.return_url
          ? content.return_url.startsWith('http') ? content.return_url : window.location.origin + content.return_url
          : window.location.origin
      }
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message as string)
    } else {
      setMessage('An unexpected error occured.')
    }

    setIsLoading(false)
  }
  let stringify = checkout_content ? JSON.stringify(checkout_content) : ''
  stringify = stringify.replaceAll('{contractToken}', `${contractToken}`)
  stringify = stringify.replaceAll('{userToken}', `${userToken}`)
  const currentMintAmount = mintAmount()
  stringify = stringify.replaceAll('{mintAmount}', `${currentMintAmount}`)
  stringify = stringify.replaceAll('{price}', `${price_fiat}`)
  if (price_fiat) {
    const totalPrice = price_fiat * currentMintAmount
    stringify = stringify.replaceAll('{priceTotal}', `${totalPrice}`)
  }
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className={'lm-checkout__data'}>
        {renderRichText(JSON.parse(stringify))}
      </div>
      <PaymentElement id="payment-element" options={{
        fields: {
          billingDetails: {
            email: 'auto',
            name: 'auto',
            phone: 'never',
            address: {
              city: 'never',
              postalCode: 'never',
              line1: 'never',
              line2: 'never',
              state: 'never',
              country: 'auto'
            }
          }
        }
      }} />
      <div style={{ marginTop: '16px' }}>
        <Button fullWidth
                color={'primary'}
                variant={'contained'}
                disabled={isLoading || !stripe || !elements}
                id="submit"
                type={'submit'}>
          Pay now
        </Button>
      </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}
