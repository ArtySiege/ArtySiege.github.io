import { writable } from 'svelte/store'
import { cards } from './cards'

const lang = writable('en-US')

const BOUNDING_WIDTH = 392 * 0.64
const FONT_SIZE = 32
const LETTER_SPACING = 0.5

const canvas = document.createElement('canvas')
canvas.width = BOUNDING_WIDTH
canvas.height = 0
document.body.appendChild(canvas)

const calculateNameWidths = (cards) => {
  cards.forEach((card) => {
    let ratio = 100
    card.nameParts.forEach((namePart) => {
      const namePartWidth = getTextWidth(namePart)
      ratio = Math.min(BOUNDING_WIDTH / namePartWidth, ratio)
    })
    console.log('R', card.number, ratio)
  })
}

function getTextWidth(text) {
  const context = canvas.getContext('2d')
  context.font = '32px Splatoon1'
  context.letterSpacing = '0.5px'
  const metrics = context.measureText(text)
  return metrics.width
}

export { calculateNameWidths }
