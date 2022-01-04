import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../web3Injector'

export function useEagerConnect() {
  const { activate, active } = useWeb3React()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true)
          .then(() => {
            window.gtag &&
            gtag('event', 'sign_up', {
              event_category: 'Auth',
              event_label: 'Eager Connect MetaMask Success'
            })
          })
          .catch(() => {
            window.gtag &&
            gtag('event', 'exception', {
              event_category: 'Auth',
              event_label: 'Eager Connect MetaMask Failed'
            })
            setTried(true)
          })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}
