import { ButtonStoryblok, FlexRowStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import useContract from './hooks/useContract'
import { TextField } from '@material-ui/core'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { useMemo, useState } from 'react'
import { MoralisMintProps } from './moralisTypings'

export default function MoralisMint({ content }: MoralisMintProps): JSX.Element {
  const { contractNft, account, isCorrectChain, selectedChain } = useContract(content)
  const theme = useMemo(
    () => {
      // @ts-ignore
      return createTheme({
        palette: {
          type: content.style_options?.includes('dark') ? 'dark' : 'light'
        }
      })
    }, [content.style_options]
  )

  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<boolean>()
  if (!account) {
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
  if (!contractNft) {
    return (
      <div>loading...</div>
    )
  }

  const { contract, contractDescription } = contractNft
  if (contractDescription && contract) {
    if (contractDescription.isWhitelistActive && !contractDescription.isWhitelisted) {
      return <>{content.fallback_not_whitelisted?.map(
        blok => (
          <LmComponentRender content={blok} key={blok._uid} />
        )
      ) || <div>You are not whitelisted!</div>}</>
    } else if (!contractDescription.canPurchaseAmount) {
      if (contractDescription.isWhitelistActive || contractDescription.isPreSaleActive) {
        return <>{content.fallback_presale?.map(
          blok => (
            <LmComponentRender content={blok} key={blok._uid} />
          )
        ) || (
          <div>There are no Tokens left for you. You have to be on the whitelist or have an invitation key.</div>
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
        {error && (
          <div className={'py-3'}>
            <em>!!! {error}</em>
          </div>
        )}
        {success && (
          <div className={'py-3'}>
            Your Transaction was successful! If you like like you can mint again.
          </div>
        )}
        <LmComponentRender content={{
          component: 'flex_row',
          _uid: 'mint-flex-row',
          ...content.mint_flexbox_container?.[0]
        } as FlexRowStoryblok}>
          {contractDescription.canPurchaseAmount > 1 && (
            <ThemeProvider theme={theme}>
              <TextField type={'number'}
                         color={'primary'}
                         size={'medium'}
                         id={'lm-mint-amount'}
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
            </ThemeProvider>
          )}
          <LmComponentRender
            content={{
              component: 'button',
              _uid: 'mint_button_' + content._uid,
              label: 'Mint',
              ...content.mint_style?.[0]
            } as ButtonStoryblok}
            onClick={async () => {
              const amount = (document.getElementById('lm-mint-amount') as HTMLInputElement)?.value
              let selectedAmount = amount ? Number(amount) : 1
              if (contract) {
                try {
                  await contract.functions.mint(selectedAmount, {
                    // @ts-ignore
                    value: selectedAmount > 1 ? contractDescription.cost.mul(selectedAmount) : contractDescription.cost
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
              }
            }} />

        </LmComponentRender>
      </div>
    )
  }
  return (
    <div>loading...</div>
  )
}
