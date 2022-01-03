import { ButtonStoryblok, FlexRowStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import { TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useRef, useState } from 'react'
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

  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<boolean>()

  const mintFunction = async () => {
    if (content.contract_token && content.moralis_mint_data.abi) {
      const signer = library.getSigner()
      const contract = new ethers.Contract(content.contract_token, content.moralis_mint_data.abi, signer)
      const hexProof = content.moralis_mint_data.merkleRoot.getHexProof()
      const selectedAmount = amountRef.current
      const currentCost = content.sale === 'whitelist'
        ? content.price_whitelist as string
        : content.price as string
      try {
        await contract.functions.mint(selectedAmount, {
          value: ethers.utils.parseEther(currentCost).mul(selectedAmount)
        })
        setSuccess(true)
      } catch (error: any) {
        console.error(error)
        if (error.code === 4001) {
          return
        }
        if (error?.message) {
          if (error?.message.includes('insufficient funds')) {
            setError('Your wallet does not have enough balance to purchase an item.')
          } else {
            setError(error.message)
          }
        }
      }
    } else {
      setError('There is something wrong with the initialization of Web3. Contact us in case the error persist.')
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

  return (
    <div>
      {error && (
        <Alert severity={'error'} className={'py-3'}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity={'success'} className={'py-3'}>
          Your Transaction was successful. Welcome to the Club!
        </Alert>
      )}
      <LmComponentRender content={{
        component: 'flex_row',
        _uid: 'mint-flex-row',
        ...content.mint_flexbox_container?.[0]
      } as FlexRowStoryblok}>
        {mintAmount > 1 && (
          <TextField type={'number'}
                     color={'primary'}
                     size={'medium'}
                     id={'lm-mint-amount'}
                     defaultValue={1}
                     style={{
                       minWidth: `55px`
                     }}
                     onChange={event => {
                       amountRef.current = Number(event.currentTarget.value)
                     }}
                     onBlur={event => {
                       const blurVal = event.currentTarget.value
                       if (blurVal && Number(blurVal) > mintAmount) {
                         amountRef.current = Number(event.currentTarget.value)
                       }
                     }}
                     inputProps={{
                       min: 1,
                       max: mintAmount
                     }} />
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
    </div>
  )

}
