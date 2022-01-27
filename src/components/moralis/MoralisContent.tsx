import { MoralisStoryblok } from '../../typings/__generated__/components-schema'
import { LmComponentRender } from '@LmComponentRender'

type MoralisProps = {
  content: MoralisStoryblok
}
export default function MoralisContent({ content }: MoralisProps): JSX.Element {
  const { body } = content
  return (
    <div className={'lm-moralis'}>
      {body?.map(block =>
        <LmComponentRender content={block} key={block._uid} />
      )}
    </div>
  )
}
