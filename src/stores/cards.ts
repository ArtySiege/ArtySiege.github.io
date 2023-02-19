import { writable } from 'svelte/store'
import type { CardDetails, CardFeatureType, FeatureTypeFilterOptions } from '../card/interface'

let cards = []
const getCards = async () => {
  let cardFetch = await fetch('/data.csv')
  let cardData = await cardFetch.text()

  const cardRows = cardData.split('\r\n')
  cardRows.shift()
  cards = cardRows.map((row) => {
    const cols = row.split(',')
    return {
      nameParts: cols.slice(2, 4).filter((s) => !!s) as [string, string?],
      img: cols[18],
      featureType: cols[22] as CardDetails['featureType'],
      number: parseInt(cols[0]),
      rarity: cols[6].toLowerCase() as 'common' | 'rare' | 'fresh',
      artist: cols[17],
      artistLink: cols[19],
      artistLinkType: cols[20],
      points: cols[8],
      grid: cols.slice(9, 17) as [string, string, string, string, string, string, string, string],
      specialCost: parseInt(cols[4]),
    }
  })
  return cards
}
