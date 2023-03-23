<script lang="ts">
  import { setContext } from 'svelte'
  import type { CardDetails } from './interface'

  export let cardDetails: Omit<CardDetails, 'name' | 'points'>

  setContext<CardDetails>('card', {
    ...cardDetails,
    name: cardDetails.nameParts.join(' '),
    points: cardDetails.grid.join('').match(/[XS]/g).length,
  })
</script>

<slot />
