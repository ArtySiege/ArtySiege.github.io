import { derived, Readable, writable } from 'svelte/store'
import type { CardDetails, CardFeatureType, FeatureTypeFilterOptions } from '../card/interface'
import Papa from 'papaparse'

const createCardStore = () => {
  const { subscribe, set } = writable<Array<CardDetails>>([])

  return {
    subscribe,
    set,
    init: async () => {
      let cardFetch = await fetch('/data.csv')
      let cardData = await cardFetch.text()

      const cardRows = Papa.parse(cardData, { header: true, delimiter: ',' })
      const cards: Array<CardDetails> = cardRows.data.map((row) => {
        const artistLinks: CardDetails['artistLinks'] = []
        if (row['Link 1 Description']) {
          artistLinks.push({ title: row['Link 1 Description'], link: row['Link 1 URL'] })
        }
        if (row['Link 2 Description']) {
          artistLinks.push({ title: row['Link 2 Description'], link: row['Link 2 URL'] })
        }
        if (row['Link 3 Description']) {
          artistLinks.push({ title: row['Link 3 Description'], link: row['Link 3 URL'] })
        }
        const cardDetails: CardDetails = {
          name: row['Name'],
          nameParts: [row['Title Line 1'], row['Title Line 2']].filter((s) => !!s) as [string, string?],
          headerScale: parseFloat(row['Title Scale']),
          img: row['@Img'],

          number: parseInt(row['No.']),
          rarity: row['Rarity'].toLowerCase() as 'common' | 'rare' | 'fresh',

          artist: row['Artist'],
          artistAlias: row['ArtistAlias'],
          artistLinks,
          description: row['Card Description'],

          featureType: row['Group'] as CardDetails['featureType'],
          creditColorOverride: row['Credit Colour Override'],
          series: row['Season'],
          seriesNumber: row['Set No.'],
          seriesColorOverride: row['No. Colour Override'],
          seriesTotal: row['Set Total'],

          grid: [
            row['Row1'],
            row['Row2'],
            row['Row3'],
            row['Row4'],
            row['Row5'],
            row['Row6'],
            row['Row7'],
            row['Row8'],
          ] as [string, string, string, string, string, string, string, string],
          points: parseInt(row['Square Count']),
          specialCost: parseInt(row['Special Cost']),
        }
        return cardDetails
      })
      set(cards)
    },
  }
}

const printing = writable<boolean>(false)

const activeCardNumber = writable<number | undefined>()
const cards = createCardStore()

export const activeCard: Readable<CardDetails> = derived([cards, activeCardNumber], ([$cards, $activeCardNumber]) =>
  $activeCardNumber ? $cards[$activeCardNumber - 1] : undefined
)

type ArtistCredit = { cardNumbers: Array<number> } & Pick<CardDetails, 'artist' | 'artistAlias' | 'artistLinks'>

export const uniqueArtists: Readable<Array<ArtistCredit>> = derived(cards, ($cards) => {
  const artists: Array<ArtistCredit> = []
  const seenArtists: Record<string, number> = {}
  $cards.forEach((c) => {
    if (c.artist && seenArtists[c.artist] === undefined) {
      seenArtists[c.artist] = artists.length
      artists.push({
        artist: c.artist,
        artistAlias: c.artistAlias,
        artistLinks: c.artistLinks,
        cardNumbers: [c.number],
      })
    }
    if (seenArtists[c.artist]) {
      const entry = artists[seenArtists[c.artist]]
      entry.cardNumbers = [...entry.cardNumbers, c.number]
    }
  })
  artists.sort((a, b) => a.artist.localeCompare(b.artist))
  return artists
})

export { activeCardNumber, cards, printing }
