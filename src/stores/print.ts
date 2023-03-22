import { writable } from 'svelte/store'

const printing = writable<boolean>(false)
const bleed = writable<0 | 1 | 2 | 3>(1)

export { printing, bleed }
