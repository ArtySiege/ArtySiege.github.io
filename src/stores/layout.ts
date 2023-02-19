import { writable } from 'svelte/store'
import type { CardRenderingSettings } from '../card/interface'

export const layoutType = writable<CardRenderingSettings>({
  type: 'rtcg',
  effects: 'flashy',
})
