<script lang="ts">
  import { select_value } from 'svelte/internal'
  import { Grid } from 'svelte-virtual'
  import Card from './Card.svelte'
  import CardContext from './Context.svelte'
  import { CardDetails, CardFeatureType, FeatureTypeFilterOptions } from './interface'

  let displayFilter: CardFeatureType | 'All' = 'All'
  let search = ''

  let cards = []
  const getCards = async () => {
    let cardFetch = await fetch('/data.csv')
    let cardData = await cardFetch.text()

    const cardRows = cardData.split('\r\n')
    cardRows.shift()
    cards = cardRows.map((row) => {
      const cols = row.split(',')
      return {
        nameParts: cols.slice(2, 4).filter((s) => !!s) as [string, string?],
        img: cols[18],

        number: parseInt(cols[0]),
        rarity: cols[6].toLowerCase() as 'common' | 'rare' | 'fresh',
        featureType: cols[23] as CardDetails['featureType'],
        series: cols[7],
        seriesNumber: cols[21],
        seriesTotal: cols[22],

        grid: cols.slice(9, 17) as [string, string, string, string, string, string, string, string],
        points: cols[8],
        specialCost: parseInt(cols[4]),

        artist: cols[17],
        artistLinkType: cols[20],
        artistLink: cols[19],
      }
    })
    return cards
  }

  const setDisplayFilter = (filter: string) => {
    displayFilter = filter as CardFeatureType | 'All'
  }
  $: filteredCards = cards.filter(
    (c) =>
      c.img &&
      (displayFilter === 'All' || c.featureType === displayFilter) &&
      (search === '' || c.artist.toLowerCase().includes(search.toLowerCase()))
  )

  let scrollToIndex
</script>

<main>
  <h2>Card Gallery</h2>
  {#await getCards()}
    loading...
  {:then cards}
    <div class="filters">
      <h3>Search by artist:</h3>
      <input bind:value={search} />
      <h3>Filter by card type:</h3>
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
        <button on:click={() => scrollToIndex(~~(Math.random() * filteredCards.length), 'smooth')}>
          Jump to a random card!
        </button>
      </div>
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
    </div>
    <div>
      {#key (displayFilter, search)}
        <Grid
          width="100%"
          height={window.outerHeight}
          itemWidth={(744 + 71) / 2}
          itemHeight={(1039 + 71) / 2}
          itemCount={filteredCards.length}
          bind:scrollToIndex
        >
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
        </Grid>
      {/key}
    </div>
  {/await}
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    margin: 0 auto;
  }
  .featureTypeButton {
    display: none;
    gap: 0 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
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
