<script lang="ts">
  import Gallery from './card/Gallery.svelte'
  import PrintGallery from './card/PrintGallery.svelte'

  let printing = false
  window.addEventListener('beforeprint', (event) => {
    printing = true
  })
</script>

<main>
  <Gallery />
  {#if printing}
    <PrintGallery />
  {/if}
</main>

<style>
  main {
    text-align: center;
    /* padding: 1em; */
    /* margin: 0 auto; */
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
