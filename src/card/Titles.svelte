<script lang="ts">
  import { onMount, select_value } from 'svelte/internal'
  import { Grid } from 'svelte-virtual'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import { CardDetails, CardFeatureType, FeatureTypeFilterOptions } from './interface'
  import { prefersReducedMotion } from '../stores/interaction'
  import { cards } from '../stores/cards'
  import TitleSvg from './face/TitleSvg.svelte'
  import { calculateNameWidths, cardNames } from '../stores/lang'

  const displayFilter = 'All'
  const search: string = ''

  $: {
    setTimeout(() => calculateNameWidths($cards, $cardNames), 1000)
  }
</script>

<div>
  {#await cards.init() && cardNames}
    loading...
  {:then}
    {#each $cards as card}
      <CardContext width={(744 + 71) / 2} height={(1039 + 71) / 2} cardDetails={card} units="px">
        <TitleSvg />
      </CardContext>
    {/each}
  {/await}
</div>

<style>
  @media print {
    div {
      display: none;
    }
  }
</style>
