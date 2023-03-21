import { derived, Readable, writable } from 'svelte/store'

const printing = writable<boolean>(false)

const pageSize = writable<'A4' | 'Letter'>('A4')
const units = writable<'mm' | 'in'>('mm')
const horizontalMargin = writable<number>(0)
const bleed = writable<0 | 1 | 2 | 3>(1)

export { printing, pageSize, bleed, horizontalMargin }
