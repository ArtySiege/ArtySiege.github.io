import Papa from 'papaparse'
import { derived, writable } from 'svelte/store'
import type { CardDetails } from '../card/interface'
import { cards } from './cards'

type SupportedLanguage = 'en_US' | 'es_EU' | 'es_US' | 'fr_EU' | 'fr_US'
type LocalizedCardDetails = Pick<CardDetails, 'name' | 'nameParts' | 'headerScale'>

const lang = writable<SupportedLanguage>('fr_US')

const initial_language = navigator.language
if (['en-US', 'es-EU', 'es-US', 'fr-EU', 'fr-US'].includes(initial_language)) {
  lang.set(initial_language.replace('-', '_') as SupportedLanguage)
  // } else if (initial_language.startsWith('en')) {
  //   lang.set('en_US')
} else {
  lang.set('en_US')
}

const fetchData = async ($lang) => {
  let cardFetch = await fetch('/i18n/' + $lang + '.csv')
  let cardData = await cardFetch.text()
  const cardRows = Papa.parse(cardData, { header: true, delimiter: ',' })
  const cards: Record<string, LocalizedCardDetails> = {}
  cardRows.data.forEach((row) => {
    cards[parseInt(row['No.'])] = {
      name: row['Name'],
      nameParts: [row['Title Line 1'], row['Title Line 2']].filter((s) => !!s) as [string, string?],
      headerScale: parseFloat(row['Title Scale']),
    }
  })
  return cards
}

const asyncDerivedStream = (stores, callback, initial_value = {}) => {
  let previous = 0

  return derived(
    stores,
    ($stores, set) => {
      const start = Date.now()
      Promise.resolve(callback($stores)).then((value) => {
        if (start > previous) {
          previous = start
          set(value)
        }
      })
    },
    initial_value
  )
}

let cardNames = asyncDerivedStream(lang, fetchData)
const BOUNDING_WIDTH = 392 * 0.64
const FONT_SIZE = 32
const LETTER_SPACING = 0.5

const calculateNameWidths = (cards, cardNames) => {
  const canvas = document.createElement('canvas')
  canvas.width = BOUNDING_WIDTH
  canvas.height = 0
  document.body.appendChild(canvas)
  cards.forEach((card) => {
    let ratio = 100
    cardNames[card.number].nameParts.forEach((namePart) => {
      const namePartWidth = getTextWidth(namePart, canvas)
      ratio = Math.min(BOUNDING_WIDTH / namePartWidth, ratio)
    })
    console.log('R', card.number, ratio)
  })
}

function getTextWidth(text, canvas) {
  const context = canvas.getContext('2d')
  context.font = '32px Splatoon1'
  context.letterSpacing = '0.5px'
  const metrics = context.measureText(text)
  return metrics.width
}

export { calculateNameWidths, lang, cardNames }
