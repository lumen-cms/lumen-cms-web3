import { MoralisStoryblok } from '../../typings/__generated__/components-schema'
import MoralisAuth from './MoralisAuth'
import MoralisMint from './MoralisMint'

type MoralisProps = {
  content: MoralisStoryblok
}
export default function MoralisContent({ content }: MoralisProps): JSX.Element {
  const { body } = content

  return (
    <div className={'lm-moralis'}>
      {body?.map(block => {
        if (block.component === 'moralis_button') {
          return <MoralisAuth {...block} key={block._uid} />
        } else if (block.component === 'moralis_mint') {
          return <MoralisMint {...block} key={block._uid} />
        }
        return null
      })}
    </div>
  )
}
