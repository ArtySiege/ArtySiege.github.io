<script lang="ts">
  import { init } from 'svelte/internal'
  import { cards, filteredCards } from '../stores/cards'
  import { printing } from '../stores/print'
  import { bleed } from '../stores/print'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardDetails } from './interface'

  window.addEventListener('beforeprint', (event) => {
    printing.set(true)
    window.dataLayer.push({
      event: 'arty__print_dialog_opened',
      bleed: $bleed,
      printGroup,
      printSelection,
      selectionCount: printSelection.length,
    })
  })
  const handlePrint = () => {
    printing.set(true)
    window.dataLayer.push({
      event: 'arty__print_button_clicked',
      bleed: $bleed,
      printGroup,
      printSelection,
      selectionCount: printSelection.length,
    })
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

  let printGroup: 'Test Page' | 'All' | 'Selection' = 'Test Page'
  let printSelection: Array<number> = []
</script>

<main>
  <h2 id="print">Print</h2>
  <div class="print-settings">
    <p>It's recommended to print a "Test Page" first to ensure your cards are printed at the right size.</p>
    <label for="bleed">Include Bleed</label>
    <select id="bleed" bind:value={$bleed}>
      <option value={1}>Yes</option>
      <option value={0}>No</option>
    </select>
    <p>
      Bleed is an extended area of artwork around the cards that allows for a margin of error when cutting them to size.
    </p>

    <label for="printGroup">Cards to Print</label>
    <select id="printGroup" bind:value={printGroup}>
      <option value="Test Page">Test Page</option>
      <option value="All">All Illustrated Cards</option>
      <option value="Selection">Choose Cards</option>
    </select>
    {#if printGroup === 'Selection'}
      <select id="printSelection" multiple bind:value={printSelection}>
        {#each $cards as card}
          {#if card.img}
            <option value={card.number}>{card.name}</option>
          {/if}
        {/each}
      </select>
    {/if}

    <div>
      <button on:click={handlePrint}>Print</button>
    </div>
  </div>
  {#if $printing}
    {#if printGroup === 'Test Page'}
      <div
        class="wrapper first"
        style="--printBleed: {$bleed}mm;--printInset:{3 - $bleed}mm;--cardHeight:{88 + $bleed * 2}mm; --cardWidth:{63 +
          $bleed * 2}mm"
      >
        <div class="page">
          <img class="print-card" alt="Test Card" src="/img/Print/en_US/_0_test.webp" />
          {#each Array(8) as _}
            <img class="print-card" alt="Test Card" src="/img/Print/_1_test.webp" />
          {/each}
        </div>

        <div class="marks" style="--markWidth: {$bleed === 0 ? '.5px' : '1px'};">
          <div class="corner" style="grid-area: top-left;" />
          <div class="corner" style="grid-area: top-right" />
          <div class="corner" style="grid-area: bottom-left" />
          <div class="corner" style="grid-area: bottom-right" />
          <div class="vertical top" style="grid-area: top-gap-1;" />
          <div class="vertical top" style="grid-area: top-gap-2;" />
          <div class="horizontal left" style="grid-area: left-gap-1;" />
          <div class="cross" style="grid-area: top-left-intersect;" />
          <div class="cross" style="grid-area: top-right-intersect;" />
          <div class="horizontal right" style="grid-area: right-gap-1;" />
          <div class="horizontal left" style="grid-area: left-gap-2;" />
          <div class="cross" style="grid-area: bottom-left-intersect;" />
          <div class="cross" style="grid-area: bottom-right-intersect;" />
          <div class="horizontal right" style="grid-area: right-gap-2;" />
          <div class="vertical bottom" style="grid-area: bottom-gap-1;" />
          <div class="vertical bottom" style="grid-area: bottom-gap-2;" />
        </div>
      </div>
    {:else}
      {#each cardGroups as group, i}
        <div
          class="wrapper"
          class:first={i === 0}
          style="--printBleed: {$bleed}mm;--printInset:{3 - $bleed}mm;--cardHeight:{88 +
            $bleed * 2}mm; --cardWidth:{63 + $bleed * 2}mm"
        >
          <div class="page">
            {#each group as card}
              <img
                class="print-card"
                alt="{card.name} by {card.artist}"
                loading="lazy"
                src="/img/Print/en_US/{card.number.toString().padStart(3, '0')}.webp"
              />
            {/each}
          </div>

          <div class="marks" style="--markWidth: {$bleed === 0 ? '.5px' : '1px'};">
            <div class="corner" style="grid-area: top-left;" />
            <div class="corner" style="grid-area: top-right" />
            <div class="corner" style="grid-area: bottom-left" />
            <div class="corner" style="grid-area: bottom-right" />
            <div class="vertical top" style="grid-area: top-gap-1;" />
            <div class="vertical top" style="grid-area: top-gap-2;" />
            <div class="horizontal left" style="grid-area: left-gap-1;" />
            <div class="cross" style="grid-area: top-left-intersect;" />
            <div class="cross" style="grid-area: top-right-intersect;" />
            <div class="horizontal right" style="grid-area: right-gap-1;" />
            <div class="horizontal left" style="grid-area: left-gap-2;" />
            <div class="cross" style="grid-area: bottom-left-intersect;" />
            <div class="cross" style="grid-area: bottom-right-intersect;" />
            <div class="horizontal right" style="grid-area: right-gap-2;" />
            <div class="vertical bottom" style="grid-area: bottom-gap-1;" />
            <div class="vertical bottom" style="grid-area: bottom-gap-2;" />
          </div>
        </div>
      {/each}
    {/if}
  {/if}
</main>

<style>
  main {
    text-align: center;
    margin: auto;
    width: 100%;
  }
  h2 {
    text-align: right;
    margin: 5px auto;
    width: var(--gallery-width);
  }
  .print-settings {
    background: repeating-linear-gradient(45deg, #606dbc22, #606dbc22 30px, #46529822 30px, #46529822 60px);
    border-radius: 10px;
    color: white;
  }
  .wrapper {
    margin: auto;
    content: '';
    position: relative;
    width: calc(var(--cardWidth) * 3 + 6mm);
    height: 100vh;
    min-height: calc(var(--cardHeight) * 3 + 6mm);
    display: flex;
    align-items: center;
    page-break-before: always;
    overflow: hidden;
  }
  .first {
    page-break-before: unset;
  }
  .marks {
    position: absolute;
    top: calc((100% - var(--cardHeight) * 3) / 2 - 3mm);
    left: 0;
    width: calc(var(--cardWidth) * 3 + 6mm);
    height: calc(var(--cardHeight) * 3 + 6mm);
    display: grid;
    grid-template-columns:
      calc(3mm + var(--printBleed))
      63mm
      calc(var(--printBleed) * 2)
      63mm
      calc(var(--printBleed) * 2)
      63mm
      calc(3mm + var(--printBleed));
    grid-template-rows:
      calc(3mm + var(--printBleed))
      88mm
      calc(var(--printBleed) * 2)
      88mm
      calc(var(--printBleed) * 2)
      88mm
      calc(3mm + var(--printBleed));

    grid-template-areas:
      'top-left . top-gap-1 . top-gap-2 . top-right'
      '. . . . . . .'
      'left-gap-1 . top-left-intersect . top-right-intersect . right-gap-1'
      '. . . . . . .'
      'left-gap-2 . bottom-left-intersect . bottom-right-intersect . right-gap-2'
      '. . . . . . .'
      'bottom-left . bottom-gap-1 . bottom-gap-2 . bottom-right';
    /* grid-gap: calc(var(--printBleed) * 2); */
  }
  .marks > div {
    border: 1px solid black;
    margin: -0.5px;
    position: relative;
  }
  .marks > .vertical {
    border-width: var(--markWidth);
    border-top: none;
    border-bottom: none;
    height: calc(100% + 1.5mm);
  }

  .top {
    top: 0;
  }
  .top::after {
    content: '';
    width: calc(100% + 3mm);
    border-top: 1px solid black;
    position: relative;
    display: block;
    left: -1.5mm;
    top: calc(100% - 1.5mm);
  }
  .bottom {
    top: -1.5mm;
  }

  .bottom::after {
    content: '';
    width: calc(100% + 3mm);
    border-top: 1px solid black;
    position: relative;
    display: block;
    left: -1.5mm;
    top: 1.5mm;
  }
  .marks > .horizontal {
    border-width: var(--markWidth);
    border-left: none;
    border-right: none;
    width: calc(100% + 1.5mm);
  }

  .left {
    left: 0;
  }
  .left::after {
    content: '';
    height: calc(100% + 3mm);
    border-left: 1px solid black;
    position: relative;
    display: block;
    left: calc(100% - 1.5mm);
    top: -1.5mm;
  }
  .right {
    left: -1.5mm;
  }
  .right::after {
    content: '';
    height: calc(100% + 3mm);
    border-left: 1px solid black;
    position: relative;
    display: block;
    left: 1.5mm;
    top: -1.5mm;
  }
  .corner::after {
    content: '';
    width: 1.5mm;
    height: 1.5mm;
    position: relative;
    display: block;
  }
  .corner:nth-child(1) {
    border-top: none;
    border-left: none;
  }
  .corner:nth-child(1)::after {
    border-top: 1px solid black;
    border-left: 1px solid black;
    left: 100%;
    top: 100%;
  }
  .corner:nth-child(2) {
    border-top: none;
    border-right: none;
  }
  .corner:nth-child(2)::after {
    border-top: 1px solid black;
    border-right: 1px solid black;
    left: calc(-1.5mm - 1px);
    top: 100%;
  }
  .corner:nth-child(3) {
    border-bottom: none;
    border-left: none;
  }
  .corner:nth-child(3)::after {
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    left: 100%;
    top: calc(-1.5mm - 1px);
  }
  .corner:nth-child(4) {
    border-bottom: none;
    border-right: none;
  }
  .corner:nth-child(4)::after {
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    left: calc(-1.5mm - 1px);
    top: calc(-1.5mm - 1px);
  }

  .marks > div.cross {
    /* clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); */
    width: calc(100% + 3mm);
    height: calc(100% + 3mm);
    left: -1.5mm;
    position: relative;
    top: -1.5mm;
    border: none;
  }
  .cross::before {
    /* Horizontal lines */
    content: '';
    border-top: var(--markWidth) solid black;
    border-bottom: var(--markWidth) solid black;
    height: calc(100% - 3mm - 1px);
    position: relative;
    display: block;
    top: 1.5mm;
  }

  .cross::after {
    /* Vertical lines */
    content: '';
    border-left: var(--markWidth) solid black;
    border-right: var(--markWidth) solid black;
    width: calc(100% - 3mm - 1px);
    height: 100%;
    position: relative;
    display: block;
    left: calc(1.5mm);
    top: calc(var(--printBleed) * -2);
  }

  .page {
    display: grid;
    grid-template-columns: var(--cardWidth) var(--cardWidth) var(--cardWidth);
    grid-auto-rows: var(--cardHeight);
    padding: 0 var(--marginHorizontal);
    margin: 3mm;
    position: relative;
    width: fit-content;
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
    h2,
    .print-settings {
      display: none;
    }
  }
  @page {
    margin: 0;
  }

  @media screen {
    .wrapper {
      display: none !important;
    }
  }
</style>
