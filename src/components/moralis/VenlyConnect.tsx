import { MoralisVenlyStoryblok } from '../../typings/__generated__/components-schema'

type VenlyConnectProps = {
  content: MoralisVenlyStoryblok
}
export default function VenlyConnect({ content }: VenlyConnectProps) {
  console.log(content)
  return (
    <div>
      venly
    </div>
  )
}
