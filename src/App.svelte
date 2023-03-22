<script lang="ts">
  import { setContext } from 'svelte'
  import About from './About.svelte'
  import BoosterGroup from './BoosterGroup.svelte'
  import Gallery from './card/Gallery.svelte'
  import PrintGallery from './card/PrintGallery.svelte'
  import Titles from './card/Titles.svelte'
  import Credits from './Credits.svelte'
  import Navigation from './Navigation.svelte'
  import { activeCard, activeCardNumber, cards } from './stores/cards'
  import { lang } from './stores/lang'
  import { galleryWidth } from './stores/interaction'
  import WhatsNext from './WhatsNext.svelte'
  const closeDetail = () => {
    activeCardNumber.set(undefined)
  }

  let splatoon1Font = 'Splatoon1'
  $: {
    if ($lang === 'zh_CN') {
      splatoon1Font = 'Splatoon1, Splatoon1_zh_CN, DFPZongYiW9-GB'
    } else {
      splatoon1Font = 'Splatoon1'
    }
  }
</script>

<main style="--gallery-width:{$galleryWidth}px;--splatoon1-font-family:{splatoon1Font}">
  <Navigation />
  <About />
  <!-- <BoosterGroup /> -->
  <!-- <Titles /> -->
  <Gallery />
  <PrintGallery />
  <WhatsNext />
  <Credits />
  {#if $activeCard}
    <detail>
      <button on:click={closeDetail}>✕</button>
      <h3>{$activeCard.seriesNumber}/{$activeCard.seriesTotal}: {$activeCard.name} by {$activeCard.artist}</h3>
      <div>
        {#if $activeCard.artistAlias}
          <span class="alias">
            {$activeCard.artistAlias}
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
</main>

<style>
  main {
    text-align: center;
    --padding: 10px;
    font-size: 0.9rem;
    line-height: 1.1;
  }

  detail {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    max-height: 80vh;
    color: white;
    background: rgba(0, 0, 0, 0.8);
    padding: 5px calc(4 * var(--padding));
    box-sizing: border-box;
  }

  detail h3 {
    margin-top: 0;
    margin-bottom: 5px;
    line-height: 1.1;
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
  .alias:before {
    content: 'AKA: ';
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
      font-size: 1rem;
      line-height: 1.2;
    }
    .alias:before {
      content: 'Also known as: ';
    }
  }

  @media print {
    detail {
      display: none;
    }
  }
</style>
