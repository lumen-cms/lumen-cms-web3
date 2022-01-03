import { MoralisMintStoryblok } from '../../typings/__generated__/components-schema'


export type MoralisMintData = {
  abi: any
  merkleRoot: string
}
export type MoralisMintProps = {
  content: MoralisMintStoryblok & {
    moralis_mint_data: MoralisMintData
  }
}

