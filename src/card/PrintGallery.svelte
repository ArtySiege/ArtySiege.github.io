<script lang="ts">
  import { init } from 'svelte/internal'
  import Tooltip from '../lib/Tooltip.svelte'
  import { cards, filteredCards } from '../stores/cards'
  import { lang, cardNames } from '../stores/lang'
  import { printing } from '../stores/print'
  import { bleed } from '../stores/print'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardDetails } from './interface'
  import PrintMarks from './PrintMarks.svelte'
  import PrintSettings from './PrintSettings.svelte'

  let cardGroups: Array<Array<CardDetails>> = []
  $: {
    cardGroups = []
    const printCards =
      printGroup === 'All' ? $cards.filter((c) => !!c.artist) : $cards.filter((c) => printSelection.includes(c.number))
    while (printCards.length > 0) {
      cardGroups.push(printCards.splice(0, 9))
    }
  }

  const setNumberBackLength = () => {
    numberBacks = printSelection.length || 9
  }

  $: printSelection && setNumberBackLength()

  let printGroup: 'Test Page' | 'Backs' | 'All' | 'Selection' = 'Test Page'
  let printSelection: Array<number> = []
  let numberBacks: number = 9
</script>

<main>
  <PrintSettings bind:printGroup bind:printSelection bind:numberBacks />
  {#if $printing}
    {#if printGroup === 'Test Page'}
      <div
        class="wrapper first"
        style="--printBleed: {$bleed}mm;--printInset:{3 - $bleed}mm;--cardHeight:{88 + $bleed * 2}mm; --cardWidth:{63 +
          $bleed * 2}mm"
      >
        <div class="page">
          <img class="print-card" alt="Test Card" src="./img/Print/{$lang}/0_test.webp" />
          {#each Array(8) as _}
            <img class="print-card" alt="Test Card" src="./img/Print/1_test.webp" />
          {/each}
        </div>

        <PrintMarks />
      </div>
    {:else if printGroup === 'Backs'}
      {@const pageCount = Math.ceil(numberBacks / 9)}
      {#each Array(pageCount) as page, i}
        <div
          class="wrapper back"
          class:first={i === 0}
          style="--printBleed: {$bleed}mm;--printInset:{3 - $bleed}mm;--cardHeight:{88 +
            $bleed * 2}mm; --cardWidth:{63 + $bleed * 2}mm"
        >
          <div class="page">
            <!-- Print 9 cards unless on the last page, then just print the remaining # of needed cards -->
            {#each Array(i <= pageCount - 1 ? 9 : numberBacks % 9) as _}
              <img class="print-card" alt="Test Card" src="./img/UI/CardBack.webp" />
            {/each}
          </div>

          <PrintMarks />
        </div>
      {/each}
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
              <!-- note: can't use loading=lazy here as safari won't load the image in the print dialog -->
              <img
                class="print-card"
                alt="{$cardNames[card.number].name} by {card.artist}"
                src="/img/Print/{$lang}/{card.number.toString().padStart(3, '0')}.webp"
              />
            {/each}
          </div>
          <PrintMarks />
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

  .page {
    display: grid;
    grid-template-columns: var(--cardWidth) var(--cardWidth) var(--cardWidth);
    grid-template-rows: var(--cardHeight) var(--cardHeight) var(--cardHeight);
    padding: 0 var(--marginHorizontal);
    margin: 3mm;
    position: relative;
    width: fit-content;
  }
  .back .page {
    direction: rtl;
  }
  main .print-card {
    width: calc(100% + var(--printInset) * 2);
    height: calc(100% + var(--printInset) * 2);
    top: calc(-1 * var(--printInset));
    left: calc(-1 * var(--printInset));
    clip-path: inset(var(--printInset));
    position: relative;
  }

  main .back .print-card {
    left: unset;
    right: calc(-1 * var(--printInset));
  }

  @media print {
    :global(*) {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    :global(body) {
      background: transparent !important;
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
