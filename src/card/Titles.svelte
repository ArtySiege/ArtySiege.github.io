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
  // Get the key CommonMsg/MiniGame/MiniGameCardName from the full translation string file, assign it to variable cards
  // Then transform into tab separated data
  // Object.keys(cards).map(k => console.log(`${k}\t${cards[k].split('\n').join(' ').replace('- ', '-')}\t${cards[k].split('\n').join('\t')}`))
</script>

<div>
  {#await cards.init() && cardNames}
    loading...
  {:then}
    {#each $cards as card}
      <CardContext cardDetails={card}>
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
