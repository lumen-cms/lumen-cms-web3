import { Story, StoryContext } from '@storybook/react'
import MoralisProvider from '../src/components/moralis/MoralisProvider'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  options: {
    storySort: (a: any, b: any) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
  }
}

const MoralisDecorator = (Story: Story, _context: StoryContext) => {
  return (
    <MoralisProvider>
      <Story />
    </MoralisProvider>
  )
}

export const decorators = [MoralisDecorator]
