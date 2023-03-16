<script lang="ts">
  import { onMount } from 'svelte/internal'
  import Grid from '../lib/Grid.svelte'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardFeatureType } from './interface'
  import { cards, filteredCards, resetFilters } from '../stores/cards'
  import { prefersReducedMotion } from '../stores/interaction'
  import GalleryFilters from '../GalleryFilters.svelte'

  let gridWrapperWidth = 1
  const cardWidth = (744 + 71) / 2
  const cardHeight = (1039 + 71) / 2
  let userScale = 1
  let gridFitColumns = Math.max(1, Math.floor(window.innerWidth / (cardWidth * userScale)))
  let gridWrapperHeight = window.innerHeight
  let scale = 1

  const setGridWrapperHeight = () => {
    gridFitColumns = Math.floor((gridWrapperWidth - 20) / (cardWidth * userScale))
    if (gridFitColumns < 1) {
      gridFitColumns = 1
      scale = (gridWrapperWidth - 20) / (cardWidth * userScale)
    } else {
      scale = 1
    }
    gridWrapperHeight = Math.ceil($filteredCards.length / gridFitColumns) * cardHeight
  }

  onMount(() => {
    setTimeout(setGridWrapperHeight, 1000)
  })

  $: gridWrapperWidth, userScale && setGridWrapperHeight()

  // const scrollTop = () => {
  //   if ($cards.length > 0 && $filteredCards.length === 0) {
  //     scrollToPosition(-100)
  //   }
  // }
  // $: $filteredCards.length && scrollTop()

  let scrollToIndex: Grid['scrollToIndex']
  let scrollToPosition: Grid['scrollToPosition']
</script>

<main style="--gallery-scale: {scale * userScale}">
  {#await cards.init()}
    <h2 id="gallery">Card Gallery</h2>
    loading...
  {:then}
    <nav>
      <h2 id="gallery">Card Gallery</h2>
      <GalleryFilters
        bind:userScale
        scrollToRandom={() =>
          scrollToIndex(~~(Math.random() * $filteredCards.length), $prefersReducedMotion ? 'auto' : 'smooth')}
      />
    </nav>

    <div class="grid-wrapper" bind:clientWidth={gridWrapperWidth}>
      <div
        class="grid-wrapper-inner"
        style="--width: {cardWidth ? cardWidth * scale * userScale * gridFitColumns + 20 + 'px' : '100%'}"
      >
        {#key $filteredCards}
          <Grid
            width={cardWidth ? cardWidth * scale * userScale * gridFitColumns + 20 + 'px' : '100%'}
            height={Math.min(window.innerHeight - 100, gridWrapperHeight)}
            itemWidth={cardWidth * scale * userScale}
            itemHeight={cardHeight * scale * userScale}
            itemCount={$filteredCards.length}
            marginLeft={10 * scale * userScale}
            scrollPosition={-100}
            bind:scrollToIndex
          >
            <header slot="header">
              <p>Click on a card for artist links and notes!</p>

              {#if $filteredCards.length === 0}
                <p>No cards found</p>
                <!-- display a button to clear the filters and search  -->
                <button
                  on:click={() => {
                    resetFilters()
                  }}>Clear filters</button
                >
              {/if}
            </header>
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
              cardDetails={$filteredCards[index]}
            >
              <Card {style} />
            </CardContext>
          </Grid>
        {/key}
      </div>
    </div>
  {/await}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    /* margin: 0 auto; */
  }
  .grid-wrapper {
    color: white;
    display: inline-flex;
    justify-content: center;
    width: 100%;
    transform-origin: top;
  }
  .grid-wrapper-inner > :global(div):first-child {
    /* The grid */
    overflow-x: hidden !important;
    margin: auto;
    position: relative;
    /* padding-left: calc(var(--padding) * var(--gallery-scale)) !important; */
  }
  .grid-wrapper-inner {
    background: repeating-linear-gradient(45deg, #606dbc22, #606dbc22 30px, #46529822 30px, #46529822 60px);
    border-radius: 10px;
    width: var(--width);
    position: relative;
  }
  .grid-wrapper-inner::after {
    content: '';
    border-radius: 10px;
    margin: auto;
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-shadow: inset 0 0 10px #000000;
    width: 100%;
    mix-blend-mode: multiply;
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
  }
  @media print {
    main {
      display: none;
    }
  }
</style>
