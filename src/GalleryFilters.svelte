<script lang="ts">
  import { filteredCards, displayFilter, searchCard, search, season } from './stores/cards'
  import { CardFeatureType, FeatureTypeFilterOptions } from './card/interface'
  import { prefersReducedMotion, prefersReducedLighting, cardDescriptionEnabled } from './stores/interaction'
  export let userScale: number
  export let scrollToRandom: () => void
  import fragment from 'svelte-fragment'
  import { lang } from './stores/lang'
  import './GalleryFilters.css'

  let panelOpen = false

  function isFeatureType(featureType: typeof FeatureTypeFilterOptions[number]): featureType is CardFeatureType | 'All' {
    return typeof featureType === 'string'
  }
</script>

<template use:fragment slot="content">
  <div>
    <button on:click={scrollToRandom}> Jump to a random card! </button>
    <button class:panelOpen on:click={() => (panelOpen = !panelOpen)}>Search, Filter and Display Options</button>
  </div>

  {#if panelOpen}
    <div class="options">
      <div class="search-group">
        <div class="display-option-row">
          <label for="cardSearch">Search by card name</label>
          <input id="cardSearch" type="text" bind:value={$searchCard} />
        </div>
        <div class="display-option-row">
          <label for="artistSearch">Search by artist</label>
          <input id="artistSearch" type="text" bind:value={$search} />
        </div>
      </div>
      <div class="filter-group">
        <div class="display-option-row">
          <label for="season">Season</label>
          <select id="season" bind:value={$season}>
            <option value="">All</option>
            <option value="1">Drizzle Season 2022</option>
            <option value="2">Chill Season 2022</option>
            <option value="3">Fresh Season 2023</option>
          </select>
        </div>
        <div class="display-option-row">
          <label for="featureTypeSelect">Card Type</label>
          <div id="featureTypeSelect" class="featureTypeSelect">
            <select bind:value={$displayFilter}>
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
      </div>
      <div class="view-group">
        <div class="display-option-row">
          <label for="zoom">Zoom</label>
          <input id="zoom" type="range" min=".25" max="1" bind:value={userScale} step="0.05" />
        </div>
        <div class="display-option-row">
          <input id="showDescriptions" type="checkbox" bind:checked={$cardDescriptionEnabled} />
          <label for="showDescriptions">Show card descriptions</label>
        </div>
      </div>
      <div class="accessibility-group">
        <div class="display-option-row">
          <input id="disableMotion" type="checkbox" bind:checked={$prefersReducedMotion} />
          <label for="disableMotion">Disable Card Motion</label>
        </div>
        <div class="display-option-row">
          <input id="disableLighting" type="checkbox" bind:checked={$prefersReducedLighting} />
          <label for="disableLighting">Disable Lighting Effects</label>
        </div>
      </div>
    </div>
  {/if}
</template>

<style>
  .options {
    flex: 1 0 100%;
    background: #6e4695;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 0 1rem;
    color: white;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 0 0 5px;
  }
  /* .featureTypeButton {
    display: none;
    gap: 0 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .featureTypeButton.selected {
    color: blue;
  } */

  select {
    margin-bottom: 0;
  }
  .search-group {
    flex: 1 1 350px;
  }
  button {
    margin: 5px 0;
  }

  .filter-group,
  .view-group,
  .accessibility-group {
    flex: 1 1 250px;
  }
  .display-option-row {
    display: flex;
    gap: 0 1rem;
    flex-wrap: wrap;
    align-items: center;
    min-height: 3rem;
  }
  .display-option-row input {
    margin: 0;
  }
  .display-option-row input[type='text'] {
    height: 2rem;
  }

  .panelOpen {
    background: #6e4695;
    position: relative;
    color: white;
  }

  .filter-group {
    container-type: inline-size;
    container-name: filter-group;
  }
</style>
