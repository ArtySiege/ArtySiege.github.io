<script lang="ts">
  import { setContext } from 'svelte'
  import About from './About.svelte'
  import Gallery from './card/Gallery.svelte'
  import PrintGallery from './card/PrintGallery.svelte'
  import Credits from './Credits.svelte'
  import Navigation from './Navigation.svelte'
  import { activeCard, activeCardNumber, cards, printing } from './stores/cards'

  const closeDetail = () => {
    activeCardNumber.set(undefined)
  }
</script>

<main>
  <Navigation />
  <About />
  <Gallery />
  <PrintGallery />
  {#if $activeCard}
    <detail>
      <button on:click={closeDetail}>✕</button>
      <h3>{$activeCard.name} by {$activeCard.artist}</h3>
      <div>
        {#if $activeCard.artistAlias}
          <span>
            Also known as: {$activeCard.artistAlias}
          </span>
        {/if}
        {#each $activeCard.artistLinks as link, index}
          {#if index > 0}
            <span class="link-divider">|</span>
          {/if}
          <a href={link.link}>{link.title}</a>
        {/each}
      </div>
      {#if $activeCard.description}
        <p>
          {$activeCard.description}
        </p>
      {/if}
    </detail>
  {/if}
  <!-- <Credits /> -->
</main>

<style>
  main {
    text-align: center;
    --padding: 10px;
  }

  detail {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-height: 80vh;
    color: white;
    background: rgba(0, 0, 0, 0.8);
    padding: var(--padding);
    box-sizing: border-box;
  }

  detail h3 {
    margin-top: 0;
    margin-bottom: 0;
  }
  detail button {
    position: absolute;
    right: var(--padding);
    top: var(--padding);
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  detail .link-divider {
    padding-left: var(--padding);
  }
  detail a {
    color: #b970df;
  }

  detail a:not(:first-child) {
    padding-left: var(--padding);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  @media print {
    detail {
      display: none;
    }
  }
</style>
