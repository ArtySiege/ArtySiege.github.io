<script lang="ts">
  import { onMount, select_value } from 'svelte/internal'
  import { Grid } from 'svelte-virtual'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import { CardDetails, CardFeatureType, FeatureTypeFilterOptions } from './interface'
  import { prefersReducedMotion } from '../stores/interaction'
  import { cards } from '../stores/cards'

  let displayFilter: CardFeatureType | 'All' = 'All'
  let search = ''

  let gridWrapperWidth = 1
  const cardWidth = (744 + 71) / 2
  const cardHeight = (1039 + 71) / 2
  let userScale = 1
  let gridFitColumns = Math.max(1, Math.floor(window.innerWidth / (cardWidth * userScale)))
  let gridWrapperHeight = window.innerHeight
  let scale = 1

  onMount(() => {
    setTimeout(() => {
      gridFitColumns = Math.floor(gridWrapperWidth / (cardWidth * userScale))
      if (gridFitColumns < 1) {
        gridFitColumns = 1
        scale = gridWrapperWidth / (cardWidth * userScale)
      } else {
        scale = 1
      }
      gridWrapperHeight = Math.ceil(filteredCards.length / gridFitColumns) * cardHeight
    }, 1000)
  })

  $: {
    gridFitColumns = Math.floor(gridWrapperWidth / (cardWidth * userScale))
    if (gridFitColumns < 1) {
      gridFitColumns = 1
      scale = gridWrapperWidth / (cardWidth * userScale)
    } else {
      scale = 1
    }
    gridWrapperHeight = Math.ceil(filteredCards.length / gridFitColumns) * cardHeight
  }

  const setDisplayFilter = (filter: string) => {
    displayFilter = filter as CardFeatureType | 'All'
  }
  $: filteredCards = $cards.filter(
    (c) =>
      c.img &&
      (displayFilter === 'All' || c.featureType === displayFilter) &&
      (search === '' ||
        c.artist.toLowerCase().includes(search.toLowerCase()) ||
        c.artistAlias.toLowerCase().includes(search.toLowerCase()))
  )

  let scrollToIndex
</script>

<main style="--gallery-scale: {scale * userScale}">
  <h2>Card Gallery</h2>
  {#await cards.init()}
    loading...
  {:then}
    <div class="filters">
      <h3>Search by artist:</h3>
      <input bind:value={search} />

      <h3>Filter by card type:</h3>
      <div class="featureTypeSelect">
        <select bind:value={displayFilter}>
          <option value="All">All</option>
          {#each FeatureTypeFilterOptions as featureType}
            {#if typeof featureType === 'string'}
              <option value={featureType}>{featureType}</option>
            {:else}
              {#each Object.keys(featureType) as key}
                <!-- <optgroup label={key}> -->
                {#each featureType[key] as subType}
                  <option value={subType}>{subType}</option>
                {/each}
                <!-- </optgroup> -->
              {/each}
            {/if}
          {/each}
        </select>
      </div>

      <div class="featureTypeButton">
        <button
          on:click={() => setDisplayFilter('All')}
          class="featureTypeButton"
          class:selected={'All' === displayFilter}>All</button
        >
        {#each FeatureTypeFilterOptions as featureType}
          {#if typeof featureType === 'string'}
            <button
              on:click={() => setDisplayFilter(featureType)}
              class="featureTypeButton"
              class:selected={featureType === displayFilter}>{featureType}</button
            >
          {:else}
            {#each Object.keys(featureType) as key}
              <!-- <optgroup label={key}> -->
              {#each featureType[key] as subType}
                <button
                  on:click={() => setDisplayFilter(subType)}
                  class="featureTypeButton"
                  class:selected={subType === displayFilter}>{subType}</button
                >
              {/each}
              <!-- </optgroup> -->
            {/each}
          {/if}
        {/each}
      </div>
      <div>
        <button
          on:click={() =>
            scrollToIndex(~~(Math.random() * filteredCards.length), $prefersReducedMotion ? 'auto' : 'smooth')}
        >
          Jump to a random card!
        </button>
      </div>
      <div>
        <input type="range" min=".25" max="1" bind:value={userScale} step="0.05" />
        <span>Prefer reduced motion</span><input type="checkbox" bind:checked={$prefersReducedMotion} />
      </div>
    </div>
    <div class="grid_wrapper" bind:clientWidth={gridWrapperWidth}>
      {#key gridFitColumns + displayFilter + search}
        <Grid
          width={cardWidth ? cardWidth * userScale * gridFitColumns + 20 + 'px' : '100%'}
          height={Math.min(window.innerHeight, gridWrapperHeight)}
          itemWidth={cardWidth * scale * userScale}
          itemHeight={cardHeight * scale * userScale}
          itemCount={filteredCards.length}
          marginLeft={10 * scale * userScale}
          bind:scrollToIndex
        >
          <p slot="header">Click on a card for artist links and notes!</p>
          <div slot="placeholder" let:style {style}>
            <img
              class="card_back"
              src="./img/UI/CardBack.webp"
              alt="The back of an Arty Siege card, showing the logo and splatters"
            />
          </div>
          <CardContext
            width={(744 + 71) / 2}
            height={(1039 + 71) / 2}
            units="px"
            slot="item"
            let:style
            let:index
            cardDetails={filteredCards[index]}
          >
            <Card {style} />
          </CardContext>
          <div slot="footer" style="height: 100px">
            <!-- spacer to allow extra scroll when the artist notes are open -->
          </div>
        </Grid>
      {/key}
    </div>
  {/await}
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    /* margin: 0 auto; */
  }
  .featureTypeButton {
    display: none;
    gap: 0 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .grid_wrapper {
    display: inline-flex;
    justify-content: center;
    width: 100vw;
    transform-origin: top;
  }
  :global(.grid_wrapper) > div {
    margin: auto;
    /* overflow-x: hidden; */
    padding-left: calc(var(--padding) * var(--gallery-scale)) !important;
  }
  .featureTypeButton.selected {
    color: blue;
  }
  .card_back {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    clip-path: inset(17.75px round 20px);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
    .featureTypeButton {
      display: flex;
    }
    .featureTypeSelect {
      display: none;
    }
  }
  @media print {
    main {
      display: none;
    }
  }
</style>
