<script lang="ts">
  import { init } from 'svelte/internal'
  import { cards, printing } from '../stores/cards'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardDetails } from './interface'
  window.addEventListener('beforeprint', (event) => {
    printing.set(true)
  })
</script>

<main>
  {#if $printing}
    <div class="wrapper">
      {#each $cards.filter((c) => !!c.artist) as card, i}
        <CardContext cardDetails={card} width={69} height={94} units="mm">
          <Card pagebreak={i % 9 === 8} style="" />
        </CardContext>
      {/each}
    </div>
  {/if}
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    margin: 0;
    font-size: 2.1875mm;
  }
  .wrapper {
    display: grid;
    grid-template-columns: 63mm 63mm 63mm;
    grid-auto-rows: 88mm;
    page-break-before: always;
  }

  @media screen {
    main {
      display: none !important;
    }
  }
</style>
