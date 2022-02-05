import { FC } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import useSWR from 'swr'
import { useTheme } from '@material-ui/core'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!)

const fetcher = (url: string) => {
  return fetch(url).then(r => r.json())
}
const MoralisStripeProvider: FC = ({ children }) => {
  const theme = useTheme()
  const { isValidating, data } = useSWR('/api/stripe/create-payment-intent?amount=10', {
    fetcher,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })
  if (isValidating) {
    return <div>loading...</div>
  }
  if (data.client_secret) {
    return (
      <Elements stripe={stripePromise} options={{
        clientSecret: data.client_secret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: theme.palette.primary.main
          }
        }
      }}>{children}</Elements>
    )
  }
  return <div>Stripe API setup error.</div>
}
export default MoralisStripeProvider
