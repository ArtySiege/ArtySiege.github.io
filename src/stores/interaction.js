import { writable } from 'svelte/store'

export const prefersReducedMotion = writable(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
export const prefersReducedLighting = writable(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

export const galleryWidth = writable(window.innerWidth)
