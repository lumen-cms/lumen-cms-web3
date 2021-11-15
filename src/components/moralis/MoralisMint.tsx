import { ButtonStoryblok, HeadlineStoryblok, MoralisMintStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import useContract from './hooks/useContract'
import { TextField } from '@material-ui/core'
import { useState } from 'react'
import Countdown from 'react-countdown'


export default function MoralisMint(content: MoralisMintStoryblok): JSX.Element {
  const { contractNft, account } = useContract()

  const [error, setError] = useState<string>()
  if (!account) {
    return (
      <>
        {content.fallback_login_message?.map(block => <LmComponentRender key={block._uid} content={block} />)}
      </>
    )
  }
  if (!contractNft) {
    return (
      <div>loading...</div>
    )
  }
  if (error) {
    return (
      <div>{error}</div>
    )
  }
  const { contract, contractDescription } = contractNft
  if (contractDescription && contract) {
    const dateAhead = contractDescription.datePresaleAhead || contractDescription.datePublicSaleAhead
    if (dateAhead) {
      const counterHeadline = { ...content.counter_style?.[0] }
      return <LmComponentRender content={{
        component: 'headline',
        _uid: 'date_presale',
        ...counterHeadline
      } as HeadlineStoryblok}>
        {counterHeadline?.text ? <><span>{counterHeadline?.text}</span><br /></> : null}
        <Countdown date={dateAhead} />
      </LmComponentRender>
    }
    if (contractDescription.isPreSale && !contractDescription.isWhitelisted) {
      return <>{content.fallback_not_whitelisted?.map(
        blok => (
          <LmComponentRender content={blok} key={blok._uid} />
        )
      ) || <div>You are not whitelisted!</div>}</>
    } else if (!contractDescription.canPurchaseAmount) {
      if (contractDescription.isPreSale) {
        return <>{content.fallback_presale?.map(
          blok => (
            <LmComponentRender content={blok} key={blok._uid} />
          )
        ) || (
          <div>There are no Tokens left for you. Come back when the public sale starts!!</div>
        )}</>
      }
      return <>{content.fallback_sale?.map(
        blok => (
          <LmComponentRender content={blok} key={blok._uid} />
        )
      ) || (
        <div>There are no Tokens left for you.</div>
      )}</>
    }
    return (
      <div>
        <div
          style={{ display: 'flex', alignItems: 'center', alignContent: 'center', flexDirection: 'row', gap: '8px' }}>
          {contractDescription.canPurchaseAmount > 1 && (
            <TextField type={'number'} id={'lm-mint-amount'}
                       defaultValue={1}
                       style={{
                         minWidth: `55px`
                       }}
                       onBlur={event => {
                         const blurVal = event.currentTarget.value
                         if (blurVal && Number(blurVal) > contractDescription.canPurchaseAmount) {
                           event.currentTarget.value = `${contractDescription.canPurchaseAmount}`
                         }
                       }}
                       inputProps={{
                         min: 1,
                         max: contractDescription.canPurchaseAmount
                       }} />
          )}
          <LmComponentRender
            content={{
              component: 'button',
              _uid: 'mint_button_' + content._uid,
              label: 'Mint'
            } as ButtonStoryblok}
            onClick={async () => {
              const amount = (document.getElementById('lm-mint-amount') as HTMLInputElement)?.value
              let selectedAmount = amount ? Number(amount) : 1
              if (contract) {
                try {
                  await contract.methods.mint(selectedAmount)
                    .call({ value: contractDescription.getCurrentCost }) // check if it would work
                  await contract.methods.mint(selectedAmount)
                    .send({ value: contractDescription.getCurrentCost })
                } catch (error: any) {
                  console.error(error)
                  debugger
                  if (error?.message) {
                    setError(error.message)
                  }
                }
              }
            }} />
        </div>
      </div>
    )
  }
  return (
    <div>loading...</div>
  )
}
