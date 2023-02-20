<script lang="ts">
  import About from './About.svelte'
  import Gallery from './card/Gallery.svelte'
  import PrintGallery from './card/PrintGallery.svelte'
  import Navigation from './Navigation.svelte'

  let printing = true
  window.addEventListener('beforeprint', (event) => {
    printing = true
  })
</script>

<main>
  <h1>Arty Siege</h1>
  <Navigation />
  <About />
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
