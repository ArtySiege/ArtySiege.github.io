<script lang="ts">
  import { filteredCards, uniqueArtists, scrollToIndex, activeCardNumber } from './stores/cards'
  const scrollToCard = (cardNumber: number) => {
    $scrollToIndex($filteredCards.findIndex((c) => c.number === cardNumber))
    // navigate to the gallery anchor
    window.location = ('' + window.location).replace(/#[A-Za-z0-9_-]*$/, '') + '#gallery'
    window.scrollTo(0, window.scrollY + 110)
    activeCardNumber.set(cardNumber)
  }
</script>

<main id="credits">
  <h2>Credits</h2>
  <h3>
    All art remains property of the respective artists. Files on this site are provided for personal use only - do not
    produce copies to sell.
  </h3>

  <h3>Artists</h3>
  <div class="contributors">
    {#each $uniqueArtists as artist}
      <span />
      <span>{artist.artist} </span>
      <span>
        {#each artist.cards as card}
          <button on:click={() => scrollToCard(card.number)}>
            {card.seriesNumber}
            <img class="button-season" src="./img/UI/Season_{card.series.padStart(2, '0')}.svg" />
          </button>
        {/each}
      </span>
      {#each [...Array(3).keys()] as i}
        {#if i < artist.artistLinks.length}
          <span class="link"><a href={artist.artistLinks[i].link}>{artist.artistLinks[i].title}</a></span>
        {:else}
          <span class="link" />
        {/if}
      {/each}
      <span />
    {/each}
  </div>

  <h3>Hosts</h3>
  Alecat • Charlie

  <h3>Mods</h3>
  alalampone • Camo_Ink

  <p>Thanks also to MidiMayo and kuro for assistance with project setup and artist panelling.</p>

  <h3>Playtesters</h3>
  <div class="playtesters">
    <span>Nicosar</span> •
    <span>Yessoan</span> •
    <span>SpongeBev</span> •
    <span>Palette</span>
  </div>

  <h3>Code</h3>
  <p>Website by Alecat. Built with Svelte.</p>
  <p>
    Card effects based on <a href="https://poke-holo.simey.me/">poke-holo.simey.me</a> - code adapted from the
    <a href="https://github.com/simeydotme/pokemon-cards-css">GitHub project</a>.
  </p>
</main>

<style>
  main {
    page-break-before: always;
    padding: 16px;
  }
  div.contributors {
    display: grid;
    grid-template-columns:
      1fr minmax(100px, 240px) minmax(60px, 100px) minmax(60px, 100px) minmax(60px, 100px) minmax(60px, 100px)
      1fr;
    gap: 0 16px;
    align-items: center;
    line-height: 1.5;
    margin: 0 auto;
  }
  .contributors span:nth-child(7n + 2) {
    text-align: right;
  }
  button {
    display: flex-inline;
    align-items: center;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background: transparent;
    border: none;
    color: var(--link-color);
    cursor: pointer;
    font-size: 0.9rem;
    vertical-align: text-bottom;
  }
  button + button:before {
    content: ', ';
    color: black;
  }
  .button-season {
    width: 1.1rem;
  }

  @media (max-width: 600px) {
    button + button:before {
      content: ' ';
    }
  }
  @media print {
    main {
      display: none;
    }
  }
</style>
