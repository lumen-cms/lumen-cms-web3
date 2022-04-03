import { ButtonStoryblok, FlexRowStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import { Alert, MenuItem, TextField } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { MoralisMintProps } from './moralisTypings'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { CHAINS } from './chainsConfig'
import dynamic from 'next/dynamic'
import { getMintErrorMessage, getPurchaseEventData, MintError } from './eventHelper'

const MoralisStripePayNow = dynamic(() => import('./MoralisStripePayNow'), {
  ssr: false
})


const envAbi = process.env.NEXT_PUBLIC_ABI ? JSON.parse(process.env.NEXT_PUBLIC_ABI) : null
/**
 * Not general in use. To enable overwrite default function
 * @param content
 * @constructor
 */
export default function MoralisMintWithPaypal({ content }: MoralisMintProps): JSX.Element {
  const { account, chainId, library } = useWeb3React()
  const abi = envAbi || content.moralis_mint_data?.abi
  const amountRef = useRef<number>(1)
  const selectedChain = CHAINS[content.chain || 'mainnet']
  const isCorrectChain = selectedChain?.id === chainId
  const currentCost = content.sale === 'whitelist'
    ? content.price_whitelist as string
    : content.price as string
  let mintAmount = 1
  if (content.sale === 'whitelist' && content.mint_amount_whitelist) {
    mintAmount = Number(content.mint_amount_whitelist)
  } else if (content.sale === 'public' && content.mint_amount) {
    mintAmount = Number(content.mint_amount)
  }
  const items: number[] = useMemo(() => {
    const cur = []
    if (mintAmount > 1) {
      for (let i = 1; i <= mintAmount; i++) {
        cur.push(i)
      }
    }
    return cur
  }, [mintAmount])

  const [error, setError] = useState<MintError | null>()
  const [success, setSuccess] = useState<boolean>()

  const trackEvent = (isPurchase?: boolean) => {
    const selectedAmount = amountRef.current || 1
    const { google, facebook } = getPurchaseEventData(content, {
      currentCost,
      amount: selectedAmount
    })
    if (isPurchase) {
      window.fbq && fbq('track', 'Purchase', facebook)
      window.gtag && gtag('event', 'purchase', google)
    } else {
      window.fbq && window.fbq('track', 'InitiateCheckout')
      window.gtag && gtag('event', 'begin_checkout')
    }
  }

  if (!account || !library) {
    return (
      <>
        {content.fallback_login_message?.map(block => <LmComponentRender key={block._uid} content={block} />)}
      </>
    )
  }
  if (!isCorrectChain) {
    return (
      <div className={'py-3'}>You are not in the correct Network. Please change
        to <strong><i>{selectedChain.displayName}</i></strong></div>
    )
  }
  if (error) {
    const errorMessage = error.message
    let customError
    if (error.code === 'not_whitelisted') {
      customError = content.fallback_not_whitelisted
    } else if (error.code === 'sale_not_started') {
      customError = content.fallback_not_started
    } else if (error.code === 'insufficient_fund') {
      customError = content.fallback_insufficient_funds
    }
    return (
      <div className={'py-3'}>
        <Alert severity={'error'} onClose={() => setError(null)}>
          {customError?.[0] ? customError.map(blok => (
            <LmComponentRender content={blok} key={blok._uid} />
          )) : errorMessage}
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <LmComponentRender content={{
        component: 'flex_row',
        _uid: 'mint-flex-row',
        ...content.mint_flexbox_container?.[0]
      } as FlexRowStoryblok}>
        {mintAmount > 1 && (
          <TextField color={'primary'}
                     size={'medium'}
                     id={'lm-mint-amount'}
                     defaultValue={1}
                     select
                     style={{
                       minWidth: `55px`
                     }}
                     onChange={event => {
                       amountRef.current = Number(event.target.value)
                     }}
          >
            {items.map(value => (
              <MenuItem value={value} key={value}>{value}</MenuItem>
            ))}
          </TextField>
        )}
        <LmComponentRender
          content={{
            component: 'button',
            _uid: 'mint_button_' + content._uid,
            label: 'Mint',
            ...content.mint_style?.[0]
          } as ButtonStoryblok}
          onClick={async () => {
            if (content.contract_token && abi && account) {
              const selectedAmount = amountRef.current || 1
              const value = ethers.utils.parseEther(currentCost).mul(selectedAmount)
              trackEvent()
              const signer = library.getSigner()
              const merkleProof: { isWhitelisted: boolean, proof: any[] } = content.sale === 'whitelist'
                ? await fetch('/api/merkle/' + account)
                  .then((r) => r.json())
                : {
                  isWhitelisted: false
                }
              if (content.sale === 'whitelist' && !merkleProof.isWhitelisted) {
                setError({
                  message: 'You are not whitelisted. If you are make sure you have the right account connected.',
                  code: 'not_whitelisted'
                })
                return
              }
              const contract = new ethers.Contract(content.contract_token, abi, signer)
              try {
                if (process.env.NEXT_PUBLIC_MINT_CALL === 'wild') {
                  await contract.functions.mint(selectedAmount, account, {
                    value: value
                  })
                } else {
                  await contract.functions.mint(selectedAmount, merkleProof.isWhitelisted ? merkleProof.proof : [ethers.utils.keccak256('0x00')], {
                    value: value
                  })
                }
                trackEvent(true)
                setSuccess(true)
              } catch (error: any) {
                if (error.code === 4001) {
                  return
                }
                const currentError = getMintErrorMessage(error)
                window.gtag &&
                gtag('event', 'exception', {
                  event_category: 'Mint Error',
                  event_label: currentError.code
                })
                setError(currentError)
              }
            } else {
              setError({
                message: 'There is something wrong with the initialization of Web3. Contact us in case the error persist.',
                code: 'unknown'
              })
            }
          }}
        />
        {process.env.NEXT_PUBLIC_STRIPE_PK && content.price_fiat && (
          <MoralisStripePayNow mintAmount={() => amountRef.current}
                               contractToken={content.contract_token}
                               userToken={account}
                               content={content}
                               chainId={chainId} />
        )}

      </LmComponentRender>
      {success && (
        <div className={'py-3'}>
          <Alert severity={'success'} onClose={() => setSuccess(false)}>
            {content.success_message?.[0] ? content.success_message?.map(blok => (
                <LmComponentRender content={blok} key={blok._uid} />
              )) :
              'Your mint transaction was successful!'
            }
          </Alert>
        </div>
      )}
    </div>
  )
}
