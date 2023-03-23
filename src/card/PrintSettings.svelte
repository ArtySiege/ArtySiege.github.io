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

  export let printGroup: 'Test Page' | 'All' | 'Selection'
  export let printSelection
</script>

<div id="print" class="print-settings">
  <div class="print-settings-inner">
    <h2>Print</h2>
    <div class="option-wrapper">
      Thanks to our generous artists, the cards on this site are available for you to print for personal use!
    </div>
    <div class="option-wrapper">
      <label for="bleed"
        >Include Bleed <Tooltip
          text="Bleed is an extended area of artwork around the cards that allows for a margin of error when cutting them to size."
          ><div class="icon-info">ℹ️</div></Tooltip
        >
      </label>
      <select id="bleed" bind:value={$bleed}>
        <option value={1}>Yes</option>
        <option value={0}>No</option>
      </select>
      <p />
    </div>

    <div class="option-wrapper">
      <label for="printGroup"
        >Cards to Print <Tooltip
          text="It's recommended to print a Test Page first to ensure your cards are printed at the right size."
          ><div class="icon-info">ℹ️</div></Tooltip
        ></label
      >
      <select id="printGroup" bind:value={printGroup}>
        <option value="Test Page">Test Page</option>
        <option value="All">All Illustrated Cards</option>
        <option value="Selection">Choose Cards</option>
      </select>
    </div>
    {#if printGroup === 'Selection'}
      <div class="option-wrapper">
        {printSelection.length} card{printSelection.length === 1 ? '' : 's'} selected
      </div>
      <select id="printSelection" multiple bind:value={printSelection}>
        {#each $cards as card}
          {#if card.img}
            <option value={card.number}>{$cardNames[card.number].name}</option>
          {/if}
        {/each}
      </select>
    {/if}
    <div class="option-wrapper">
      <button on:click={handlePrint}>Print</button>
    </div>
  </div>
</div>

<style>
  h2 {
    text-align: left;
    margin: 20px 0 10px;
    color: var(--theme-highlight);
  }
  .print-settings-inner {
    width: var(--gallery-width);
    margin: auto;
    text-align: left;
  }
  .print-settings {
    padding: var(--padding) 0 25px;
    background: url(../img/Site/PrintBackground.webp) no-repeat top center;
    background-size: 100%;
    color: white;
  }
  label {
    display: inline-flex;
  }
  .icon-info {
    display: inline-block;
    /* font-size: 0.75rem;
    line-height: 1.2rem;
    width: 1.2rem;
    height: 1.2rem;
    border: 1px solid white;
    border-radius: 50%; */
    margin: 0 5px;
  }
  .options-wrapper {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .options-left {
    display: flex;
    flex-direction: column;
    flex: 1 2 auto;
  }
  .options-right {
    flex: 2 0 auto;
    max-width: 200px;
    text-align: right;
    display: flex;
    /* align-items: flex-end; */
    flex-direction: column;
  }
  .option-wrapper {
    display: flex;
    align-items: center;
    min-height: 3rem;
  }
  #printSelection {
    width: 100%;
  }

  @media print {
    h2,
    .print-settings {
      display: none;
    }
  }
</style>
