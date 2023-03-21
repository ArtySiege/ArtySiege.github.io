<script lang="ts">
  import { init } from 'svelte/internal'
  import { cards, filteredCards } from '../stores/cards'
  import { printing, horizontalMargin } from '../stores/print'
  import { bleed } from '../stores/print'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardDetails } from './interface'

  window.addEventListener('beforeprint', (event) => {
    printing.set(true)
    window.dataLayer.push({ event: 'arty__print_dialog_opened' })
  })
  const handlePrint = () => {
    printing.set(true)
    window.dataLayer.push({ event: 'arty__print_nav_clicked' })
    setTimeout(window.print, 500)
  }

  let cardGroups: Array<Array<CardDetails>> = []
  $: {
    cardGroups = []
    const printCards =
      printGroup === 'All' ? $cards.filter((c) => !!c.artist) : $cards.filter((c) => printSelection.includes(c.number))
    while (printCards.length > 0) {
      cardGroups.push(printCards.splice(0, 9))
    }
  }

  let printGroup: 'All' | 'Selection' = 'All'
  let printSelection: Array<number> = []

  let marginUnits: 'mm' | 'inch' = 'mm'
</script>

<main>
  <printSettings>
    <h2 id="print">Print</h2>
    <section class="print">
      <p>These cards are sized for printing on A4 or Letter sized pages, with no bleed.</p>
      <h3>Scale</h3>
      <p>
        In the "More Settings" section of your browser print dialog, set the Scale to "100%" - you may need to pick
        "Customized" first then set 100% as the scale.
      </p>
      <h3>Margins</h3>
      <p>
        If your browser has options to adjust margins, choose "Custom" margins and then adjust the top and left margins
        until the cards are centered on the page.
      </p>
    </section>
    <label for="paperSize">Paper Size</label>
    <select id="paperSize">
      <option value="A4">A4</option>
      <option value="Letter">Letter</option>
    </select>
    <label for="bleed">Bleed</label>
    <select id="bleed" bind:value={$bleed}>
      <option value="0">None</option>
      <option value="1">Small</option>
      <option value="2">Medium</option>
      <option value="3">Large</option>
    </select>

    <label for="printGroup">Cards to Print</label>
    <select id="printGroup" bind:value={printGroup}>
      <option value="All">All Illustrated Cards</option>
      <option value="Selection">Select Cards</option>
    </select>
    {#if printGroup === 'Selection'}
      <select id="printSelection" multiple bind:value={printSelection}>
        {#each $cards as card}
          <option value={card.number}>{card.name}</option>
        {/each}
      </select>
    {/if}

    <div>
      <button on:click={handlePrint}>Print</button>
    </div>
  </printSettings>
  {#if $printing}
    {#each cardGroups as group}
      <div
        class="wrapper"
        style="--marginHorizontal: {horizontalMargin}{marginUnits} ;--printBleed: {$bleed}mm;--printInset:{3 -
          $bleed}mm;--cardHeight:{88 + $bleed * 2}mm; --cardWidth:{63 + $bleed * 2}mm"
      >
        {#each group as card, i}
          <img
            class="print-card"
            alt="{card.name} by {card.artist}"
            src="/img/Print/en_US/{card.number.toString().padStart(3, '0')}.webp"
          />
        {/each}
      </div>
    {/each}
  {/if}
</main>

<style>
  main {
    text-align: center;
  }
  .wrapper {
    display: grid;
    grid-template-columns: var(--cardWidth) var(--cardWidth) var(--cardWidth);
    grid-auto-rows: var(--cardHeight);
    page-break-before: always;
    padding: 0 var(--marginHorizontal);
    margin: auto;
  }
  main .print-card {
    width: calc(100% + var(--printInset) * 2);
    height: calc(100% + var(--printInset) * 2);
    top: calc(-1 * var(--printInset));
    left: calc(-1 * var(--printInset));
    clip-path: inset(var(--printInset));
    position: relative;
  }

  @media print {
    :global(*) {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    :global(body) {
      background: transparent !important;
    }
    :global(html),
    :global(body) {
      scroll-padding-top: 0;
    }
  }
  @page {
    size: 210mm 297mm;
    margin: 0;
  }

  @media screen {
    .wrapper {
      display: none !important;
    }
  }
</style>
