<script lang="ts">
  import { setContext } from 'svelte'
  import type { CardDetails } from './interface'

  export let cardDetails: Omit<CardDetails, 'name' | 'points'>
  export let width: number
  export let height: number
  export let units: 'mm' | 'px'

  setContext<CardDetails & { width: number; height: number; units: 'mm' | 'px' }>('card', {
    ...cardDetails,
    width,
    height,
    units,
    name: cardDetails.nameParts.join(' '),
    points: cardDetails.grid.join('').match(/[XS]/g).length,
  })
  let cardWidth
  let scale = 1
  $: scale = units === 'px' ? 1 : cardWidth / ((744 + 71) / 2)
</script>

<!-- <div bind:clientWidth={cardWidth} style="width:{width}px; height: {height}px; transform: scale({scale})"> -->
<slot />
<!-- </div> -->
