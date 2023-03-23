<script lang="ts">
  import { onMount } from 'svelte/internal'
  import Grid from '../lib/Grid.svelte'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import type { CardFeatureType } from './interface'
  import { activeCardNumber, cards, filteredCards, resetFilters, scrollToIndex } from '../stores/cards'
  import { prefersReducedMotion, galleryWidth, cardDescriptionEnabled } from '../stores/interaction'
  import GalleryFilters from '../GalleryFilters.svelte'

  let gridWrapperWidth = window.innerWidth
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
    // gridWrapperHeight = Math.ceil($filteredCards.length / gridFitColumns) * cardHeight
  }

  let galleryRef: HTMLElement
  let yCoordinate: number
  // record the offset position when the gallery is mounted
  onMount(() => {
    yCoordinate = galleryRef.getBoundingClientRect().top + window.scrollY
  })

  $: gridWrapperWidth, userScale, gridWrapperHeight && setGridWrapperHeight()

  // Hide the card description when scrolling past the gallery
  const handleScroll = () => {
    if ($activeCardNumber && window.scrollY > yCoordinate + gridWrapperHeight - 150) {
      activeCardNumber.set(undefined)
    }
  }
</script>

<svelte:window bind:innerHeight={gridWrapperHeight} on:scroll={handleScroll} />

<main style="--gallery-scale: {scale * userScale}" bind:this={galleryRef}>
  {#await cards.init()}
    <nav>
      <h2 id="gallery">Card Gallery</h2>
      loading...
    </nav>
  {:then}
    <nav>
      <h2 id="gallery">Card Gallery</h2>
      <GalleryFilters
        bind:userScale
        scrollToRandom={() => {
          const scrollToCard = ~~(Math.random() * $filteredCards.length)
          $scrollToIndex(scrollToCard, $prefersReducedMotion ? 'auto' : 'smooth')
          activeCardNumber.set($filteredCards[scrollToCard].number)
        }}
      />
    </nav>

    <div class="grid-wrapper" bind:clientWidth={gridWrapperWidth}>
      <div
        class="grid-wrapper-inner"
        bind:clientWidth={$galleryWidth}
        style="--width: {cardWidth ? cardWidth * scale * userScale * gridFitColumns + 20 + 'px' : '100%'}"
      >
        {#key $filteredCards}
          <Grid
            width={String($galleryWidth)}
            height={gridWrapperHeight - 150}
            itemWidth={cardWidth * scale * userScale}
            itemHeight={cardHeight * scale * userScale}
            itemCount={$filteredCards.length}
            marginLeft={10 * scale * userScale}
            bind:scrollToIndex={$scrollToIndex}
          >
            <header slot="header">
              {#if $filteredCards.length === 0}
                <p>No cards found</p>
                <button on:click={resetFilters}>Clear filters</button>
              {:else if $cardDescriptionEnabled}
                <p>Click on a card for artist links and notes!</p>
              {/if}
            </header>
            <div slot="placeholder" let:style {style}>
              <img class="card_back" src="./img/UI/CardBack.webp" alt="" aria-hidden="true" />
            </div>
            <CardContext slot="item" let:style let:index cardDetails={$filteredCards[index]}>
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
    background: #606dbc22; /*repeating-linear-gradient(45deg, #606dbc22, #606dbc22 30px, #46529822 30px, #46529822 60px);*/
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

  nav {
    width: var(--gallery-width);
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  nav h2 {
    margin: 5px 0;
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
