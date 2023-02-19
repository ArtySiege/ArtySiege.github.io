import { getContext } from 'svelte'
import type { CardDetails } from './interface'

const getCardContext = () => {
  const card: CardDetails & { width: number; height: number; units: 'mm' | 'px' } = getContext('card')
  if (!card) {
    throw new Error('Card must be called inside a card context')
  }
  return card
}

export { getCardContext }
