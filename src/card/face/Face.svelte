<script>
  import Art from './Art.svelte'
  import ArtistCredit from './ArtistCredit.svelte'
  import Grid from './Grid.svelte'
  import Numbering from './Numbering.svelte'
  import Points from './Points.svelte'
  import Special from './Special.svelte'
  import Title from './Title.svelte'
</script>

<face>
  <Art />
  <Points />
  <Title />
  <Special />
  <Grid />
  <ArtistCredit />
  <Numbering />
</face>

<style>
  face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
