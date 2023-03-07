<script>
  import { uniqueArtists } from './stores/cards'
</script>

<main>
  Card effects based on <a href="https://poke-holo.simey.me/">poke-holo.simey.me</a>, with code adapted from the Pokémon
  Cards Holographic effect in CSS <a href="https://github.com/simeydotme/pokemon-cards-css">GitHub project</a>.

  <h2>Contributors</h2>
  <ul>
    {#each $uniqueArtists as artist}
      <li>{artist.artist}</li>
    {/each}
  </ul>
  <h2>Playtesters</h2>
</main>
