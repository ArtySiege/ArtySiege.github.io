import { readable } from 'svelte/store'

var isSafari =
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1

const r = 1 * (isSafari ? 1.4 : 1) /* width of outline in pixels */
const n = Math.ceil(2 * Math.PI * r) /* number of shadows */
const shadowList = []
for (let i = 0; i < n; i++ /* append shadows in n evenly distributed directions */) {
  const theta = ((2 * i) / n) * Math.PI
  let x = r * Math.cos(theta)
  let y = r * Math.sin(theta)
  shadowList.push(`drop-shadow(${(x + 0.2).toFixed(4)}px ${(y + 0.2).toFixed(4)}px 0px var(--shadowColor))`)
}
const shadows = shadowList.join(' ')

export const styles = readable({ shadows })
