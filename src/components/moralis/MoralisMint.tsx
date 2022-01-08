import { ButtonStoryblok, FlexRowStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import { TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useMemo, useRef, useState } from 'react'
import { MoralisMintProps } from './moralisTypings'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

const CHAINS = {
  main: {
    name: 'main',
    displayName: 'Ethereum',
    id: 1
  },
  rinkeby: {
    name: 'rinkeby',
    displayName: 'Rinkeby Test',
    id: 4
  }
}
type MintError = {
  message: string, code: 'insufficient_fund' | 'not_whitelisted' | 'sale_not_started' | 'max_mint_amount_exceed' | 'unknown'
}
export default function MoralisMint({ content }: MoralisMintProps): JSX.Element {
  const { account, chainId, library } = useWeb3React()
  const amountRef = useRef<number>(1)
  const selectedChain = CHAINS[content.chain || 'main']
  const isCorrectChain = selectedChain?.id === chainId

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

  const mintFunction = async () => {
    if (content.contract_token && content.moralis_mint_data.abi && account) {
      const selectedAmount = amountRef.current
      const currentCost = content.sale === 'whitelist'
        ? content.price_whitelist as string
        : content.price as string
      const value = ethers.utils.parseEther(currentCost).mul(selectedAmount)
      window.gtag &&
      gtag('event', 'begin_checkout', {
        event_category: 'Mint',
        value: value
      })
      const signer = library.getSigner()
      const merkleProof: { isWhitelisted: boolean, proof: any[] } = content.sale === 'whitelist' ? await fetch('/api/merkle/' + account)
        .then((r) => r.json()) : {
        isWhitelisted: false
      }
      if (content.sale === 'whitelist' && !merkleProof.isWhitelisted) {
        setError({
          message: 'You are not whitelisted. If you are make sure you have the right account connected.',
          code: 'not_whitelisted'
        })
        return
      }

      const contract = new ethers.Contract(content.contract_token, content.moralis_mint_data.abi, signer)

      try {
        await contract.functions.mint(selectedAmount, merkleProof.isWhitelisted ? merkleProof.proof : [ethers.utils.keccak256('0x00')], {
          value: value
        })
        window.gtag &&
        gtag('event', 'purchase', {
          event_category: 'Mint',
          value: value
        })
        setSuccess(true)
      } catch (error: any) {
        if (error.code === 4001) {
          return
        }
        if (error?.message) {
          let currentError: MintError = {
            message: error.message.split('(')[0],
            code: 'unknown'
          }

          if (error?.message.includes('insufficient funds')) {
            currentError = { code: 'insufficient_fund', message: 'You don\'t have enough funds in your wallet.' }
          } else if (error?.message.includes('Sale has not started yet')) {
            currentError = {
              message: 'The sale has not started yet! Please come back later.',
              code: 'sale_not_started'
            }
          } else if (error?.message.includes('max mint amount exceeded')) {
            currentError = {
              message: 'You already minted the maximum NFTs for your wallet.',
              code: 'max_mint_amount_exceed'
            }
          } else if (error?.message.includes('invalid proof')) {
            currentError = {
              message: 'You are not member of the whitelist. If you are make sure you have the right account connected.',
              code: 'not_whitelisted'
            }
          }
          window.gtag &&
          gtag('event', 'exception', {
            event_category: 'Mint Error',
            event_label: currentError.code
          })
          setError(currentError)
        }
      }
    } else {
      setError({
        message: 'There is something wrong with the initialization of Web3. Contact us in case the error persist.',
        code: 'unknown'
      })
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
                     SelectProps={{
                       native: true
                     }}
                     style={{
                       minWidth: `55px`
                     }}
                     onChange={event => {
                       amountRef.current = Number(event.currentTarget.value)
                     }}
          >
            {items.map(value => (
              <option value={value} key={value}>{value}</option>
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
            await mintFunction()
          }} />

      </LmComponentRender>
      {success && (
        <div className={'py-3'}>
          <Alert severity={'success'} onClose={() => setSuccess(false)}>
            {content.success_message?.[0] ? content.success_message?.map(blok => (
                <LmComponentRender content={blok} key={blok._uid} />
              )) :
              'Your Transaction was successful. Welcome to the club!'
            }
          </Alert>
        </div>
      )}
    </div>
  )

}
