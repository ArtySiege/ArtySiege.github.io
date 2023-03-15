<script>
  import { uniqueArtists } from './stores/cards'
</script>

<main>
  <h2>Credits</h2>
  <h3>
    All art remains property of the respective artists. Files on this site are provided for personal use only - do not
    produce copies to sell.
  </h3>

  <h3>Artists</h3>
  <div class="contributors">
    {#each $uniqueArtists as artist}
      <span />
      <span>{artist.artist}</span>
      {#each [...Array(3).keys()] as i}
        {#if i < artist.artistLinks.length}
          <span><a href={artist.artistLinks[i].link}>{artist.artistLinks[i].title}</a></span>
        {:else}
          <span />
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
  <p>
    We did actually <a href="https://twitter.com/alecatmew/status/1578373911892226048">playtest IRL tableturf</a>, but
    since the game now offers multiplayer the focus of the project has pivoted away from making it a practical Print
    &amp; Play game.
  </p>

  <h3>Code</h3>
  <p>Website by Alecat. Built with Svelte.</p>
  <p>
    Card effects based on <a href="https://poke-holo.simey.me/">poke-holo.simey.me</a>, with code adapted from the
    Pokémon Cards Holographic effect in CSS
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
    grid-template-columns: 1fr minmax(100px, 200px) minmax(60px, 100px) minmax(60px, 100px) minmax(60px, 100px) 1fr;
    gap: 0 16px;
    align-items: center;
    line-height: 1.5;
    margin: 0 auto;
  }
  .contributors span:nth-child(6n + 2) {
    text-align: right;
  }
  @media print {
    main {
      padding: 10mm;
    }
  }
</style>
