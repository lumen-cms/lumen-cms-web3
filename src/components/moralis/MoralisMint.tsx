import { ButtonStoryblok, HeadlineStoryblok, MoralisMintStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import useContract from './hooks/useContract'


export default function MoralisMint(content: MoralisMintStoryblok) {
  const { user, isWeb3Enabled, web3EnableError, getContract,getContractDetails } = useContract()
  const username = user?.getUsername()
  if (!username) {
    if (!content.fallback_login_message?.length) {
      return <LmComponentRender content={{
        component: 'headline',
        _uid: 'fallback_' + content._uid,
        typography: 'subtitle1',
        text: 'Please login first to start the mint.'
      } as HeadlineStoryblok} />
    }
    return (
      <div>
        {content.fallback_login_message?.map(block => <LmComponentRender key={block._uid} content={block} />)}
      </div>
    )
  }
  if (web3EnableError) {
    console.error(web3EnableError)
    return (
      <LmComponentRender content={{
        component: 'headline',
        _uid: 'fallback_' + content._uid,
        typography: 'subtitle1',
        color: 'error',
        text: 'An errror occured.'
      } as HeadlineStoryblok} />
    )
  }

  if (isWeb3Enabled) {
    getContractDetails()
    return (
      <div>

        <LmComponentRender
          content={{
            component: 'button',
            _uid: 'mint_button_' + content._uid,
            label: 'Mint'
          } as ButtonStoryblok}
          onClick={async () => {
            const contract = await getContract()

            if (contract) {
              contract.methods.mint(1).send()
              console.log('inside of mint')
            }


            // const endSale = await contract?.methods.preSaleEndDate()
            //
            // const res = await contract?.methods.mint(1)
          }} />
      </div>
    )
  }
  return (
    <div>loading...</div>
  )

}
