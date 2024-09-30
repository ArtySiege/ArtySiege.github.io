<script lang="ts">
  import About from './About.svelte'
  import Credits from './Credits.svelte'
  import Footer from './Footer.svelte'
  import Navigation from './Navigation.svelte'
  import WhatsNext from './WhatsNext.svelte'
  import Gallery from './card/Gallery.svelte'
  import PrintGallery from './card/PrintGallery.svelte'
  import { activeCard, activeCardNumber } from './stores/cards'
  import { cardDescriptionEnabled, galleryWidth } from './stores/interaction'
  import { lang, titleFontSize } from './stores/lang'
  const closeDetail = () => {
    activeCardNumber.set(undefined)
  }

  let splatoon1Font = 'Splatoon1, sans-serif'
  document.body.style.setProperty('--splatoon1-font-family', splatoon1Font)

  $: document.body.style.setProperty('--title-font-size', $titleFontSize.toString())
  $: {
    if ($lang === 'ja_JP') {
      splatoon1Font = "Splatoon1, 'Splatoon1_ja_JP', 'DFPZongYiW9-GB', sans-serif"
    } else if ($lang === 'zh_CN') {
      splatoon1Font = "Splatoon1, 'Splatoon1_zh_CN', 'DFPZongYiW9-GB', sans-serif"
    } else if ($lang === 'zh_TW') {
      splatoon1Font = "Splatoon1, 'Splatoon1_zh_TW', 'DFPZongYiW9-GB', sans-serif"
    } else {
      splatoon1Font = 'Splatoon1, sans-serif'
    }
    document.body.style.setProperty('--splatoon1-font-family', splatoon1Font)
  }
</script>

<main style="--gallery-width:{$galleryWidth}px;">
  <Navigation />
  <div class="alert-banner">
    Thankyou for everyone at Riptide for your support! Together we raised $1233 for <a
      href="https://www.weallcode.org/"
      target="_blank"
      rel="noreferrer">We All Code</a
    >. We're now back in hiatus mode. For updates, join our
    <a href="https://discord.gg/Be9XqKmVwf" target="_blank" rel="noreferrer">Discord Server</a>
    or
    <a href="https://forms.gle/keK7rG84gPcT7qit9" target="_blank" rel="noreferrer">Mailing List</a>.
  </div>
  <About />
  <!-- <BoosterGroup /> -->
  <!-- <Titles /> -->
  <Gallery />
  <PrintGallery />
  <WhatsNext />
  <Credits />
  <Footer />
  {#if $activeCard && $cardDescriptionEnabled}
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

  .alert-banner {
    background-color: var(--theme-highlight);
    padding: 1rem;
  }
  .alert-banner a {
    color: var(--theme-background-accent);
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
    z-index: 100;
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
    .alert-banner {
      display: none;
    }
  }
</style>
