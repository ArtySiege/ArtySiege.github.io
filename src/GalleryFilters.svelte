<script lang="ts">
  import { filteredCards, displayFilter, searchCard, search, season } from './stores/cards'
  import { CardFeatureType, FeatureTypeFilterOptions } from './card/interface'
  import { prefersReducedMotion, prefersReducedLighting } from './stores/interaction'
  export let userScale: number
  export let scrollToRandom: () => void
  import fragment from 'svelte-fragment'
  import { lang } from './stores/lang'

  let panelOpen = false

  function isFeatureType(featureType: typeof FeatureTypeFilterOptions[number]): featureType is CardFeatureType | 'All' {
    return typeof featureType === 'string'
  }
</script>

<template use:fragment slot="content">
  <div>
    <button on:click={scrollToRandom}> Jump to a random card! </button>
    <button on:click={() => (panelOpen = !panelOpen)}>Search, Filter and Display Options</button>
  </div>

  {#if panelOpen}
    <div class="options">
      <div class="display-option-row">
        <label for="cardSearch">Search by card name</label>
        <input id="cardSearch" type="text" bind:value={$searchCard} />
      </div>
      <div class="display-option-row">
        <label for="artistSearch">Search by artist</label>
        <input id="artistSearch" type="text" bind:value={$search} />
      </div>
      <label for="season">Season</label>
      <select id="season" bind:value={$season}>
        <option value="">All</option>
        <option value="1">Drizzle Season 2022</option>
        <option value="2">Chill Season 2022</option>
        <option value="3">Fresh Season 2023</option>
      </select>

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

      <div class="featureTypeButton">
        <button
          on:click={() => displayFilter.set('All')}
          class="featureTypeButton"
          class:selected={'All' === $displayFilter}>All</button
        >
        {#each FeatureTypeFilterOptions as featureType}
          {#if isFeatureType(featureType)}
            <button
              on:click={() => displayFilter.set(featureType)}
              class="featureTypeButton"
              class:selected={featureType === $displayFilter}>{featureType}</button
            >
          {:else}
            {#each Object.keys(featureType) as key}
              <!-- <optgroup label={key}> -->
              {#each featureType[key] as subType}
                <button
                  on:click={() => displayFilter.set(subType)}
                  class="featureTypeButton"
                  class:selected={subType === $displayFilter}>{subType}</button
                >
              {/each}
              <!-- </optgroup> -->
            {/each}
          {/if}
        {/each}
      </div>
      <div class="display-option-row">
        <label for="zoom">Zoom</label>
        <input id="zoom" type="range" min=".25" max="1" bind:value={userScale} step="0.05" />
      </div>
      <div class="display-option-row">
        <label for="disableMotion">Disable Card Motion</label><input
          id="disableMotion"
          type="checkbox"
          bind:checked={$prefersReducedMotion}
        />
      </div>
      <div class="display-option-row">
        <label for="disableLighting">Disable Lighting Effects</label><input
          id="disableLighting"
          type="checkbox"
          bind:checked={$prefersReducedLighting}
        />
      </div>
      <div class="display-option-row">
        <label for="language">Language</label>

        <select id="language" bind:value={$lang}>
          <option value="en_US">English</option>
          <option value="es_EU">Español</option>
          <option value="es_US">Español (MX)</option>
          <option value="fr_EU">Français</option>
          <option value="fr_US">Français (CA)</option>
        </select>
      </div>
    </div>
  {/if}
</template>

<style>
  .options {
    flex: 1 0 100%;
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
  .display-option-row {
    display: flex;
    gap: 0 1rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .display-option-row input {
    margin: 0;
  }
  .display-option-row input[type='text'] {
    height: 2rem;
  }
  @media (min-width: 640px) {
    .featureTypeButton {
      display: flex;
    }
    .featureTypeSelect {
      display: none;
    }
  }
</style>
