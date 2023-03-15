<script lang="ts">
  import { init } from 'svelte/internal'
  import { cards, printing } from '../stores/cards'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardDetails } from './interface'
  window.addEventListener('beforeprint', (event) => {
    printing.set(true)
  })
  let cardGroups: Array<Array<CardDetails>> = []
  $: {
    cardGroups = []
    const printCards = $cards.filter((c) => !!c.artist)
    while (printCards.length > 0) {
      cardGroups.push(printCards.splice(0, 9))
    }
  }

  let marginHorizontal: number = 7.5
  let marginUnits: 'mm' | 'inch' = 'mm'
</script>

<main>
  {#if $printing}
    {#each cardGroups as group}
      <div class="wrapper" style="--marginHorizontal: {marginHorizontal}{marginUnits}">
        {#each group as card, i}
          <CardContext cardDetails={card} width={69} height={94} units="mm">
            <Card style="" animate={false} />
          </CardContext>
        {/each}
      </div>
    {/each}
  {/if}
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    font-size: 2.1875mm;
  }
  .wrapper {
    display: grid;
    grid-template-columns: 63mm 63mm 63mm;
    grid-auto-rows: 88mm;
    page-break-before: always;
    /* padding: 0 var(--marginHorizontal); */
    margin: auto;
  }

  @media screen {
    main {
      display: none !important;
    }
  }
</style>